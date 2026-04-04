import { createSocket, type RemoteInfo } from "node:dgram";
import type { LightState } from "tplink-lightbulb";

const PORT = 9999;

interface BulbState {
  on_off: 0 | 1;
  hue: number;
  saturation: number;
  color_temp: number;
  brightness: number;
}

const state: BulbState = {
  on_off: 1,
  hue: 120,
  saturation: 75,
  color_temp: 2700,
  brightness: 80,
};

/**
 * Encrypt a string using the TP-Link autokey XOR cipher.
 * Each byte is XORed with the current key; the encrypted byte becomes the next key.
 */
function encrypt(str: string, key = 0xab): Buffer {
  const buf = Buffer.from(str);
  // i is always within bounds: loop condition is i < buf.length
  for (let i = 0; i < buf.length; i++) {
    const c = buf[i]!;
    buf[i] = c ^ key;
    key = buf[i]!;
  }
  return buf;
}

/**
 * Decrypt a buffer using the TP-Link autokey XOR cipher.
 * Each byte is XORed with the current key; the original (pre-encryption) byte becomes the next key.
 */
function decrypt(buf: Buffer, key = 0xab): string {
  const out = Buffer.from(buf);
  // i is always within bounds: loop condition is i < out.length
  for (let i = 0; i < out.length; i++) {
    const c = out[i]!;
    out[i] = c ^ key;
    key = c;
  }
  return out.toString("utf8");
}

function send(server: ReturnType<typeof createSocket>, data: unknown, rinfo: RemoteInfo): void {
  const buf = encrypt(JSON.stringify(data));
  server.send(buf, 0, buf.length, rinfo.port, rinfo.address);
}

function lightState(): LightState {
  const { on_off, hue, saturation, color_temp, brightness } = state;
  const dft_on_state = { mode: "normal", hue, saturation, color_temp, brightness };
  return on_off === 1
    ? { on_off, mode: "normal", hue, saturation, color_temp, brightness, dft_on_state }
    : { on_off: 0, dft_on_state };
}

const server = createSocket("udp4");

server.on("message", (msg: Buffer, rinfo: RemoteInfo) => {
  let cmd: Record<string, unknown>;
  try {
    cmd = JSON.parse(decrypt(msg)) as Record<string, unknown>;
  } catch {
    return;
  }

  console.log(`[mock] ${rinfo.address}:${rinfo.port} →`, JSON.stringify(cmd));

  const sys = cmd.system as Record<string, unknown> | undefined;
  if (sys?.get_sysinfo !== undefined) {
    send(server, {
      system: {
        get_sysinfo: {
          model: "LB130(UN)",
          mic_type: "IOT.SMARTBULB",
          alias: "Mock LB130",
          light_state: lightState(),
        },
      },
    }, rinfo);
    return;
  }

  const svc = cmd["smartlife.iot.smartbulb.lightingservice"] as
    | { transition_light_state?: Partial<BulbState> }
    | undefined;

  if (svc?.transition_light_state) {
    const t = svc.transition_light_state;
    if (t.on_off !== undefined) state.on_off = t.on_off;
    if (t.hue !== undefined) state.hue = t.hue;
    if (t.saturation !== undefined) state.saturation = t.saturation;
    if (t.color_temp !== undefined) state.color_temp = t.color_temp;
    if (t.brightness !== undefined) state.brightness = t.brightness;

    send(server, {
      "smartlife.iot.smartbulb.lightingservice": {
        transition_light_state: { ...state, err_code: 0 },
      },
    }, rinfo);
    return;
  }

  console.warn("[mock] unhandled command:", JSON.stringify(cmd));
});

server.bind(PORT, () => {
  console.log(`Mock LB130 bulb listening on UDP port ${PORT}`);
  console.log('Point config.json "bulb" at 127.0.0.1 to use it');
});
