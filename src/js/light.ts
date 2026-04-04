import colorTempToHex from "./ColorTempHex";
import type { LightState } from "tplink-lightbulb";

interface ModeResponse {
  "smartlife.iot.smartbulb.lightingservice": {
    transition_light_state: LightState;
  };
}

declare global {
  interface Window {
    light: Light;
  }
}

class Light {
  private tabsHidden: boolean = true;
  private mouseInCanvas: boolean = false;
  private url: string = "/api/light";

  private powerButton: HTMLButtonElement;
  private brightnessLight: HTMLElement;
  private brightnessSlider: HTMLInputElement;
  private brightnessBox: HTMLInputElement;
  private colorTempLight: HTMLElement;
  private colorTempSlider: HTMLInputElement;
  private colorTempBox: HTMLInputElement;
  private colorLight: HTMLElement;

  constructor() {
    this.powerButton = document.getElementById("powerButton") as HTMLButtonElement;
    /* send a power signal to the server*/
    this.powerButton.addEventListener("click", async () => {
      await fetch(`${this.url}/power`);
      this.updateGuiRequest();
    });

    /*Brightness */
    this.brightnessLight = (
      document.getElementById("whiteLightBrightnessSVG") as HTMLObjectElement
    ).contentDocument!.getElementById("innerBulb") as HTMLElement;
    this.brightnessSlider = document.getElementById("brightnessSlider") as HTMLInputElement;
    this.brightnessBox = document.getElementById("brightnessBox") as HTMLInputElement;
    let brightnessSliderTimeOut: ReturnType<typeof setTimeout> | null = null;
    /*adjust the color of the brightnessLight, change value in the box, send update to hardware */
    this.brightnessSlider.addEventListener("input", () => {
      this.brightnessLight.style.fill = `rgba(255, 255, 0, ${Number(this.brightnessSlider.value) / 100})`;
      this.brightnessBox.value = `${this.brightnessSlider.value}%`;

      /*Using timeout to reduce amount of network requests*/
      clearTimeout(brightnessSliderTimeOut ?? undefined);
      brightnessSliderTimeOut = setTimeout(() => {
        this.updateLight(false);
      }, 250);
    });

    /* Color Temperature*/
    this.colorTempLight = (
      document.getElementById("whiteLightColorTempSVG") as HTMLObjectElement
    ).contentDocument!.getElementById("innerBulb") as HTMLElement;
    this.colorTempSlider = document.getElementById("colorTempSlider") as HTMLInputElement;
    this.colorTempBox = document.getElementById("colorTempBox") as HTMLInputElement;
    let colorTempSliderTimeOut: ReturnType<typeof setTimeout> | null = null;
    /*adjust color of the colorTempLight, change value in the box, send update to hardware */
    this.colorTempSlider.addEventListener("input", () => {
      this.colorTempLight.style.fill = colorTempToHex[Number(this.colorTempSlider.value) as keyof typeof colorTempToHex];
      this.colorTempBox.value = this.colorTempSlider.value;

      /*Using timeout to reduce amount of network requests*/
      clearTimeout(colorTempSliderTimeOut ?? undefined);
      colorTempSliderTimeOut = setTimeout(() => {
        this.updateLight();
      }, 250);
    });

    this.colorLight = (
      document.getElementById("colorLightSVG") as HTMLObjectElement
    ).contentDocument!.getElementById("innerBulb") as HTMLElement;

    const whiteLightButton = document.getElementById("whiteLightButton") as HTMLButtonElement;
    whiteLightButton.addEventListener("click", () => {
      this.showTab("whiteLightContainer");
    });
    const colorLightButton = document.getElementById("colorLightButton") as HTMLButtonElement;
    colorLightButton.addEventListener("click", () => {
      this.showTab("colorLightContainer");
    });

    this.initColorPicker();
    this.updateGuiRequest();
    setInterval(() => {
      this.updateGuiRequest();
    }, 10000);
  }

  private enableDisableElements(enable: boolean): void {
    if (enable) {
      /*enable elements */
      this.powerButton.className = "powerButtonGreen";
      this.powerButton.setAttribute("state", "on");
      this.colorTempSlider.disabled = false;
      this.brightnessSlider.disabled = false;
    } else {
      /*disable elements */
      this.powerButton.className = "powerButtonRed";
      this.powerButton.setAttribute("state", "off");
      this.colorTempSlider.disabled = true;
      this.brightnessSlider.disabled = true;
    }
  }

  private HSVtoRGB(h: number, s: number, v: number): { r: number; g: number; b: number } {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  private initColorPicker(): void {
    const canvas = document.getElementById("picker") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const hexVal = document.getElementById("hexVal") as HTMLInputElement;
    const image = new Image();
    image.addEventListener("load", () => {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    });

    image.src = "/images/colorwheel.png";

    canvas.addEventListener("mouseenter", () => {
      this.mouseInCanvas = true;
    });
    canvas.addEventListener("mouseleave", () => {
      this.mouseInCanvas = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pixel = ctx.getImageData(x, y, 1, 1).data;

      const pixelColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      this.colorLight.setAttribute("style", `backgroundColor: ${pixelColor}`);

      (document.getElementById("rVal") as HTMLInputElement).value = String(pixel[0]);
      (document.getElementById("gVal") as HTMLInputElement).value = String(pixel[1]);
      (document.getElementById("bVal") as HTMLInputElement).value = String(pixel[2]);
      (document.getElementById("rgbVal") as HTMLInputElement).value = `${pixel[0]},${pixel[1]},${pixel[2]}`;

      const dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
      const hexValue = `#${`0000${dColor.toString(16)}`.slice(-6)}`;
      hexVal.value = hexValue;
      this.colorLight.style.fill = hexValue;
    });
    canvas.addEventListener("click", () => {
      if (document.getElementById("powerButton")!.getAttribute("state") === "on") {
        this.updateLight(true);
      }
    });
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private RGBtoHSV(r: number, g: number, b: number): { h: number; s: number; v: number } {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max / 255;
    let h = max === 0 ? 0 : d / max;

    switch (max) {
      case min: h = 0; break;
      case r: h = (g - b + d * (g < b ? 6 : 0)) / (6 * d); break;
      case g: h = (b - r + d * 2) / (6 * d); break;
      case b: h = (r - g + d * 4) / (6 * d); break;
    }

    return { h, s, v };
  }

  private showTab(tabName: string): void {
    const tabs = document.getElementsByClassName("tab");
    Object.values(tabs).forEach((tab) => {
      tab.setAttribute("style", tab.id === tabName ? "display: inline-flex" : "display: none;");
    });
  }

  private async updateLight(color?: boolean): Promise<void> {
    const hsv = this.RGBtoHSV(
      parseInt((document.getElementById("rVal") as HTMLInputElement).value, 10),
      parseInt((document.getElementById("gVal") as HTMLInputElement).value, 10),
      parseInt((document.getElementById("bVal") as HTMLInputElement).value, 10),
    );
    const packet = {
      mode: "normal",
      hue: color ? Math.round(hsv.h * 360) : 0,
      saturation: color ? Math.round(hsv.s * 100) : 0,
      color_temp: color ? 0 : Number(this.colorTempSlider.value),
      brightness: color ? Math.round(hsv.v * 100) : Number(this.brightnessSlider.value),
    };

    const data: ModeResponse = await (
      await fetch(`${this.url}/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packet),
      })
    ).json();
    this.updateGui(data["smartlife.iot.smartbulb.lightingservice"].transition_light_state);
  }

  private updateGui(response: LightState): void {
    let colorTemp = response.color_temp ?? response.dft_on_state!.color_temp;

    /*After initial load, remove the loading screen and display the tabs */
    if (this.tabsHidden) {
      (document.getElementById("tabs") as HTMLElement).style.display = "flex";
      this.showTab(colorTemp === 0 ? "colorLightContainer" : "whiteLightContainer");
      this.tabsHidden = false;
    }

    this.enableDisableElements(response.on_off !== 0);

    /* update the gui for the temperature light*/
    colorTemp = colorTemp || 2500;
    /* if color light is currently set, LB130 returns 0. Using value for 2500 to initialize it to _something_ */
    this.colorTempBox.value = String(colorTemp);
    this.colorTempSlider.value = String(colorTemp);
    this.colorTempLight.style.fill = colorTempToHex[colorTemp as keyof typeof colorTempToHex];

    /* update the gui for the brightness light*/
    const brightness = response.brightness ?? response.dft_on_state!.brightness;
    this.brightnessBox.value = `${brightness}%`;
    this.brightnessSlider.value = String(brightness);
    this.brightnessLight.style.fill = `rgba(255, 255, 0, ${brightness / 100})`;

    /*update the gui for the color light only when the mouse is not inside the canvas*/
    if (!this.mouseInCanvas) {
      const hue = response.hue ?? response.dft_on_state!.hue;
      const saturation = response.saturation ?? response.dft_on_state!.saturation;
      const rgb = this.HSVtoRGB(hue / 360, saturation / 100, brightness / 100);
      (document.getElementById("rVal") as HTMLInputElement).value = String(rgb.r);
      (document.getElementById("gVal") as HTMLInputElement).value = String(rgb.g);
      (document.getElementById("bVal") as HTMLInputElement).value = String(rgb.b);
      (document.getElementById("rgbVal") as HTMLInputElement).value = `${rgb.r},${rgb.g},${rgb.b}`;
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      (document.getElementById("hexVal") as HTMLInputElement).value = hex;
      this.colorLight.style.fill = hex;
    }
  }

  async updateGuiRequest(): Promise<void> {
    const data = await (await fetch(`${this.url}/info`)).json();
    this.updateGui(data.light_state);
  }
}

window.addEventListener("load", () => {
  window.light = new Light();
});
