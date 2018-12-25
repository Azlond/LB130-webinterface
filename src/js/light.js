import colorTempToHex from './ColorTempHex';

/**
 * @description LB130-Lightbulb Class
 * @author Jan Kaiser
 * @date 2018-09-18
 * @export
 * @class Light
 */
class Light {
    /**
     * Creates an instance of Light.
     * @description initializes variables
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    constructor() {
        this.tabsHidden = true; //state variable for initialization

        this.powerButton = document.getElementById('powerButton');
        /* send a power signal to the server*/
        this.powerButton.addEventListener('click', async () => {
            await fetch(`${this.url}/light/power`);
            this.updateGuiRequest();
        });

        /*Brightness */
        this.brightnessLight = document.getElementById('whiteLightBrightnessSVG').contentDocument.getElementById('innerBulb');
        this.brightnessSlider = document.getElementById('brightnessSlider');
        this.brightnessBox = document.getElementById('brightnessBox');
        let brightnessSliderTimeOut = null;
        /*adjust the color of the brightnessLight, change value in the box, send update to hardware */
        this.brightnessSlider.addEventListener('input', () => {
            this.brightnessLight.style.fill = `rgba(255, 255, 0, ${this.brightnessSlider.value / 100})`;
            this.brightnessBox.value = `${this.brightnessSlider.value}%`;

            /*Using timeout to reduce amount of network requests*/
            clearTimeout(brightnessSliderTimeOut);
            brightnessSliderTimeOut = setTimeout(() => {
                this.updateWhiteLight();
            }, 250);
        });

        /* Color Temperature*/
        this.colorTempLight = document.getElementById('whiteLightColorTempSVG').contentDocument.getElementById('innerBulb');
        this.colorTempSlider = document.getElementById('colorTempSlider');
        this.colorTempBox = document.getElementById('colorTempBox');
        let colorTempSliderTimeOut = null;
        /*adjust color of the colorTempLight, change value in the box, send update to hardware */
        this.colorTempSlider.addEventListener('input', () => {
            this.colorTempLight.style.fill = colorTempToHex[this.colorTempSlider.value];
            this.colorTempBox.value = this.colorTempSlider.value;

            /*Using timeout to reduce amount of network requests*/
            clearTimeout(colorTempSliderTimeOut);
            colorTempSliderTimeOut = setTimeout(() => {
                this.updateWhiteLight();
            }, 250);
        });

        this.colorLight = document.getElementById('colorLightSVG').contentDocument.getElementById('innerBulb');

        this.whiteLightButton = document.getElementById('whiteLightButton');
        this.whiteLightButton.addEventListener('click', () => {
            this.showTab('whiteLightContainer');
        });
        this.colorLightButton = document.getElementById('colorLightButton');
        this.colorLightButton.addEventListener('click', () => {
            this.showTab('colorLightContainer');
        });

        this.url = `http://${__HOST__}:${__PORT__}`;

        this.initColorPicker();
        this.updateGuiRequest();
        setInterval(() => {
            this.updateGuiRequest();
        }, 10000);
    }

    /**
     * @description enabled / disable elements
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {boolean} enable
     * @memberof Light
     */
    enableDisableElements(enable) {
        if (enable) {
            /*enable elements */
            this.powerButton.className = 'powerButtonGreen';
            this.powerButton.setAttribute('state', 'on');
            this.colorTempSlider.disabled = false;
            this.brightnessSlider.disabled = false;
        } else {
            /*disable elements */
            this.powerButton.className = 'powerButtonRed';
            this.powerButton.setAttribute('state', 'off');
            this.colorTempSlider.disabled = true;
            this.brightnessSlider.disabled = true;
        }
    }

    /**
     * @description This code expects 0 <= h, s, v <= 1, if you're using degrees or radians, remember to divide them out.
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {Number} h
     * @param {Number} s
     * @param {Number} v
     * @returns {Object} The returned 0 <= r, g, b <= 255 are rounded to the nearest Integer. If you don't want this behaviour remove the Math.rounds from the returned object.
     * @memberof Light
     */
    HSVtoRGB(h, s, v) {
        let r; let g; let b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * @description initializes the canvas element and the color picker for the colored light
     * @author Jan Kaiser
     * @date 2018-12-24
     * @memberof Light
     */
    initColorPicker() {
        const canvas = document.getElementById('picker');
        const ctx = canvas.getContext('2d');
        const hexVal = document.getElementById('hexVal');
        // drawing active image
        const image = new Image();
        image.onload = () => {
            ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
        };

        // select desired colorwheel
        image.src = 'images/colorwheel.png';

        canvas.addEventListener('mouseenter', (e) => {
            this.mouseInCanvas = true;
        });
        canvas.addEventListener('mouseleave', (e) => {
            this.mouseInCanvas = false;
        });
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const pixel = ctx.getImageData(x, y, 1, 1).data;

            // update preview color
            const pixelColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            this.colorLight.setAttribute('style', `backgroundColor: ${pixelColor}`);

            // update controls
            [document.getElementById('rVal').value, document.getElementById('gVal').value, document.getElementById('bVal').value] = pixel;
            document.getElementById('rgbVal').value = `${pixel[0]},${pixel[1]},${pixel[2]}`;

            const dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
            const hexValue = `#${(`0000${dColor.toString(16)}`).substr(-6)}`;
            hexVal.value = hexValue;
            this.colorLight.style.fill = hexValue;
        });
        canvas.addEventListener('click', (e) => {
            if (document.getElementById('powerButton').getAttribute('state') === 'on') {
                this.updateColorLight();
            }
        });
    }

    /**
     * @description Convert rgb to a hex value
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {Numer} r
     * @param {Number} g
     * @param {Number} b
     * @returns {String} Hex-value
     * @memberof Light
     */
    rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    /**
     * @description This code will output 0 <= h, s, v <= 1, but this time takes any 0 <= r, g, b <= 255 (does not need to be an integer)
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @returns Object
     * @memberof Light
     */
    RGBtoHSV(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        const s = (max === 0 ? 0 : d / max);
        const v = max / 255;
        let h = (max === 0 ? 0 : d / max);

        switch (max) {
            case min:
                h = 0;
                break;
            case r:
                h = (g - b) + d * (g < b ? 6 : 0);
                h /= 6 * d;
                break;
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }

        return {
            h,
            s,
            v
        };
    }

    /**
     * @description display a specific tab
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {String} tabName name of the tab to display
     * @memberof Light
     */
    showTab(tabName) {
        const tabs = document.getElementsByClassName('tab');
        Object.values(tabs).forEach((tab) => {
            if (tab.id === tabName) {
                tab.setAttribute('style', 'display: inline-flex');
            } else {
                tab.setAttribute('style', 'display: none;');
            }
        });
    }

    /**
     * @description creates the config to update the color light
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    async updateColorLight() {
        const hsv = this.RGBtoHSV(parseInt(document.getElementById('rVal').value, 10), parseInt(document.getElementById('gVal').value, 10), parseInt(document.getElementById('bVal').value, 10));
        const packet = {
            mode: 'normal',
            hue: Math.round(hsv.h * 360),
            saturation: Math.round(hsv.s * 100),
            color_temp: 0,
            brightness: Math.round(hsv.v * 100)
        };

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(packet)
        };
        const data = await (await fetch(`${this.url}/light/mode`, config)).json();
        this.updateGui(data['smartlife.iot.smartbulb.lightingservice'].transition_light_state);
    }

    /**
     * @description update the gui whenever a server response is received
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {Object} response
     * @memberof Light
     */
    updateGui(response) {
        let colorTemp = (response.color_temp !== undefined) ? response.color_temp : response.dft_on_state.color_temp;

        /*After initial load, remove the loading screen and display the tabs */
        if (this.tabsHidden) {
            document.getElementById('tabs').style.display = 'flex';
            if (colorTemp === 0) {
                this.showTab('colorLightContainer');
            } else {
                this.showTab('whiteLightContainer');
            }
            this.tabsHidden = false;
        }

        /* enabled/disable elements based on light state*/
        if (response.on_off === 0) {
            this.enableDisableElements(false);
        } else {
            this.enableDisableElements(true);
        }

        /* update the gui for the temperature light*/
        colorTemp = colorTemp || 2500;
        /* if color light is currently set, LB130 returns 0. Using value for 2500 to initialize it to _something_ */
        this.colorTempBox.value = colorTemp;
        this.colorTempSlider.value = colorTemp;
        this.colorTempLight.style.fill = colorTempToHex[colorTemp];

        /* update the gui for the brightness light*/
        const brightness = (response.brightness !== undefined) ? response.brightness : response.dft_on_state.brightness;
        this.brightnessBox.value = `${brightness}%`;
        this.brightnessSlider.value = brightness;
        this.brightnessLight.style.fill = `rgba(255, 255, 0, ${brightness / 100})`;

        /*update the gui for the color light only when the mouse is not inside the canvas*/
        if (!this.mouseInCanvas) {
            const hue = (response.hue !== undefined) ? response.hue : response.dft_on_state.hue;
            const saturation = (response.saturation !== undefined) ? response.saturation : response.dft_on_state.saturation;
            const rgb = this.HSVtoRGB(hue / 360, saturation / 100, brightness / 100);
            document.getElementById('rVal').value = rgb.r;
            document.getElementById('gVal').value = rgb.g;
            document.getElementById('bVal').value = rgb.b;
            document.getElementById('rgbVal').value = `${rgb.r},${rgb.g},${rgb.b}`;
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            document.getElementById('hexVal').value = hex;
            this.colorLight.style.fill = hex;
        }
    }

    /**
     * @description send an info-request to the light
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    async updateGuiRequest() {
        const data = await (await fetch(`${this.url}/light/info`)).json();
        this.updateGui(data.light_state);
    }

    /**
     * @description creates the config for the white light
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    async updateWhiteLight() {
        const packet = {
            mode: 'normal',
            hue: 0,
            saturation: 0,
            color_temp: this.colorTempSlider.value,
            brightness: this.brightnessSlider.value
        };

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(packet)
        };
        const data = await (await fetch(`${this.url}/light/mode`, config)).json();
        this.updateGui(data['smartlife.iot.smartbulb.lightingservice'].transition_light_state);
    }
}

window.onload = () => {
    window.light = new Light();
};
