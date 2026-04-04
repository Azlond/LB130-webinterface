import { getColorHex, HSVtoRGB, RGBtoHSV, rgbToHex } from "./colorUtils";
import type { LightState } from "tplink-lightbulb";

interface ModeResponse {
  "smartlife.iot.smartbulb.lightingservice": {
    transition_light_state: LightState;
  };
}

interface DomRefs {
  powerButton: HTMLButtonElement;
  brightnessLight: HTMLElement;
  brightnessSlider: HTMLInputElement;
  brightnessBox: HTMLInputElement;
  colorTempLight: HTMLElement;
  colorTempSlider: HTMLInputElement;
  colorTempBox: HTMLInputElement;
  colorLight: HTMLElement;
  rVal: HTMLInputElement;
  gVal: HTMLInputElement;
  bVal: HTMLInputElement;
  rgbVal: HTMLInputElement;
  hexVal: HTMLInputElement;
}

const url = "/api/light";
let tabsHidden = true;
let mouseInCanvas = false;
let sliderActive = false;

function getSvgElement(objectId: string, elementId: string): HTMLElement {
  const obj = document.getElementById(objectId) as HTMLObjectElement | null;
  const el = obj?.contentDocument?.getElementById(elementId);
  if (!el) throw new Error(`#${elementId} not found in ${objectId}`);
  return el;
}

function enableDisableElements(refs: DomRefs, enable: boolean): void {
  refs.powerButton.className = enable ? "powerButtonGreen" : "powerButtonRed";
  refs.powerButton.setAttribute("state", enable ? "on" : "off");
  refs.colorTempSlider.disabled = !enable;
  refs.brightnessSlider.disabled = !enable;
}

function showTab(tabName: string): void {
  mouseInCanvas = false;
  Array.from(document.getElementsByClassName("tab")).forEach((tab) => {
    const el = tab as HTMLElement;
    const active = el.id === tabName;
    el.style.visibility = active ? "visible" : "hidden";
    el.style.height = active ? "" : "0";
    el.style.overflow = active ? "" : "hidden";
    el.style.pointerEvents = active ? "auto" : "none";
  });
}

function updateGui(response: LightState, refs: DomRefs): void {
  let colorTemp = response.color_temp ?? response.dft_on_state?.color_temp ?? 0;

  if (tabsHidden) {
    (document.getElementById("tabs") as HTMLElement).style.display = "flex";
    showTab(colorTemp === 0 ? "colorLightContainer" : "whiteLightContainer");
    tabsHidden = false;
  }

  enableDisableElements(refs, response.on_off !== 0);

  /* if color light is currently set, LB130 returns 0. Using value for 2500 to initialize it to _something_ */
  colorTemp = colorTemp === 0 ? 2500 : colorTemp;
  const brightness = response.brightness ?? response.dft_on_state?.brightness ?? 0;

  if (!sliderActive) {
    refs.colorTempBox.value = String(colorTemp);
    refs.colorTempSlider.value = String(colorTemp);
    refs.brightnessBox.value = `${brightness}%`;
    refs.brightnessSlider.value = String(brightness);
  }
  refs.colorTempLight.style.fill = getColorHex(colorTemp);
  refs.brightnessLight.style.fill = `rgba(255, 255, 0, ${brightness / 100})`;

  if (!mouseInCanvas) {
    const hue = response.hue ?? response.dft_on_state?.hue ?? 0;
    const saturation = response.saturation ?? response.dft_on_state?.saturation ?? 0;
    const rgb = HSVtoRGB(hue / 360, saturation / 100, brightness / 100);
    refs.rVal.value = String(rgb.r);
    refs.gVal.value = String(rgb.g);
    refs.bVal.value = String(rgb.b);
    refs.rgbVal.value = `${rgb.r},${rgb.g},${rgb.b}`;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    refs.hexVal.value = hex;
    refs.colorLight.style.fill = hex;
  }
}

async function updateGuiRequest(refs: DomRefs): Promise<void> {
  try {
    const data = await (await fetch(`${url}/info`)).json();
    updateGui(data.light_state, refs);
  } catch (e: unknown) {
    console.error("Failed to fetch light state:", e);
  }
}

async function updateLight(color: boolean, refs: DomRefs): Promise<void> {
  const hsv = RGBtoHSV(
    parseInt(refs.rVal.value, 10),
    parseInt(refs.gVal.value, 10),
    parseInt(refs.bVal.value, 10),
  );
  const packet = {
    mode: "normal",
    hue: color ? Math.round(hsv.h * 360) : 0,
    saturation: color ? Math.round(hsv.s * 100) : 0,
    color_temp: color ? 0 : Number(refs.colorTempSlider.value),
    brightness: color ? Math.round(hsv.v * 100) : Number(refs.brightnessSlider.value),
  };

  try {
    const data: ModeResponse = await (
      await fetch(`${url}/mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packet),
      })
    ).json();
    updateGui(data["smartlife.iot.smartbulb.lightingservice"].transition_light_state, refs);
  } catch (e: unknown) {
    console.error("Failed to update light:", e);
  }
}

function initColorPicker(refs: DomRefs): void {
  const canvas = document.getElementById("picker") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const image = new Image();
  image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0, image.width, image.height);
  });
  image.src = "/images/colorwheel.png";

  canvas.addEventListener("mouseenter", () => {
    mouseInCanvas = true;
  });
  canvas.addEventListener("mouseleave", () => {
    mouseInCanvas = false;
  });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const pixel = ctx.getImageData(e.clientX - rect.left, e.clientY - rect.top, 1, 1).data;

    refs.rVal.value = String(pixel[0]);
    refs.gVal.value = String(pixel[1]);
    refs.bVal.value = String(pixel[2]);
    refs.rgbVal.value = `${pixel[0]},${pixel[1]},${pixel[2]}`;

    const hex = rgbToHex(pixel[0]!, pixel[1]!, pixel[2]!);
    refs.hexVal.value = hex;
    refs.colorLight.style.fill = hex;
  });
  canvas.addEventListener("click", () => {
    if (refs.powerButton.getAttribute("state") === "on") {
      updateLight(true, refs);
    }
  });
}

window.addEventListener("load", () => {
  const refs: DomRefs = {
    powerButton: document.getElementById("powerButton") as HTMLButtonElement,
    brightnessLight: getSvgElement("whiteLightBrightnessSVG", "innerBulb"),
    brightnessSlider: document.getElementById("brightnessSlider") as HTMLInputElement,
    brightnessBox: document.getElementById("brightnessBox") as HTMLInputElement,
    colorTempLight: getSvgElement("whiteLightColorTempSVG", "innerBulb"),
    colorTempSlider: document.getElementById("colorTempSlider") as HTMLInputElement,
    colorTempBox: document.getElementById("colorTempBox") as HTMLInputElement,
    colorLight: getSvgElement("colorLightSVG", "innerBulb"),
    rVal: document.getElementById("rVal") as HTMLInputElement,
    gVal: document.getElementById("gVal") as HTMLInputElement,
    bVal: document.getElementById("bVal") as HTMLInputElement,
    rgbVal: document.getElementById("rgbVal") as HTMLInputElement,
    hexVal: document.getElementById("hexVal") as HTMLInputElement,
  };

  const refresh = () => updateGuiRequest(refs);

  refs.powerButton.addEventListener("click", async () => {
    await fetch(`${url}/power`);
    refresh();
  });

  for (const slider of [refs.brightnessSlider, refs.colorTempSlider]) {
    slider.addEventListener("pointerdown", () => {
      sliderActive = true;
    });
    slider.addEventListener("pointerup", () => {
      sliderActive = false;
    });
  }

  let brightnessTimer: ReturnType<typeof setTimeout> | undefined;
  refs.brightnessSlider.addEventListener("input", () => {
    refs.brightnessLight.style.fill = `rgba(255, 255, 0, ${Number(refs.brightnessSlider.value) / 100})`;
    refs.brightnessBox.value = `${refs.brightnessSlider.value}%`;
    clearTimeout(brightnessTimer);
    brightnessTimer = setTimeout(() => updateLight(false, refs), 250);
  });

  let colorTempTimer: ReturnType<typeof setTimeout> | undefined;
  refs.colorTempSlider.addEventListener("input", () => {
    refs.colorTempLight.style.fill = getColorHex(Number(refs.colorTempSlider.value));
    refs.colorTempBox.value = refs.colorTempSlider.value;
    clearTimeout(colorTempTimer);
    colorTempTimer = setTimeout(() => updateLight(false, refs), 250);
  });

  document
    .getElementById("whiteLightButton")!
    .addEventListener("click", () => showTab("whiteLightContainer"));
  document
    .getElementById("colorLightButton")!
    .addEventListener("click", () => showTab("colorLightContainer"));

  initColorPicker(refs);
  refresh();
  setInterval(refresh, 10000);
});
