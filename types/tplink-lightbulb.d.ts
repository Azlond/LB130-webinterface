declare module "tplink-lightbulb" {
  import { EventEmitter } from "events";

  export interface LightState {
    on_off: number;
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

  interface ScanEmitter extends EventEmitter {
    stop(): void;
  }

  class Bulb {
    constructor(ip: string);
    info(): Promise<{ light_state: LightState; [key: string]: unknown }>;
    power(on: boolean): Promise<unknown>;
    send(msg: Record<string, unknown>): Promise<unknown>;
    static scan(micType?: string): ScanEmitter;
  }

  export default Bulb;
}
