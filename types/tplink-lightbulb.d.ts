declare module "tplink-lightbulb" {
  import { EventEmitter } from "events";

  export interface LightState {
    on_off: 0 | 1;
    hue?: number;
    saturation?: number;
    color_temp?: number;
    brightness?: number;
    mode?: string;
    dft_on_state?: {
      hue: number;
      saturation: number;
      color_temp: number;
      brightness: number;
      mode?: string;
    };
  }

  export interface DeviceInfo {
    light_state: LightState;
    model?: string;
    alias?: string;
    deviceId?: string;
  }

  interface ScanEmitter extends EventEmitter {
    stop(): void;
  }

  class Bulb {
    constructor(ip: string);
    info(): Promise<DeviceInfo>;
    power(on: boolean): Promise<unknown>;
    send(msg: Record<string, unknown>): Promise<unknown>;
    static scan(micType?: string): ScanEmitter;
  }

  export default Bulb;
}
