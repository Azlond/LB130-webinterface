/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
 * hex codes for color temperature
 * calculated by using the algorithm from http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
 */
const colorTempToHex = {
    2500: '#FF9F46',
    2600: '#FFA34F',
    2700: '#FFA757',
    2800: '#FFAA5F',
    2900: '#FFAE67',
    3000: '#FFB16E',
    3100: '#FFB475',
    3200: '#FFB87B',
    3300: '#FFBB81',
    3400: '#FFBE87',
    3500: '#FFC18D',
    3600: '#FFC392',
    3700: '#FFC697',
    3800: '#FFC99D',
    3900: '#FFCBA1',
    4000: '#FFCEA6',
    4100: '#FFD0AB',
    4200: '#FFD3AF',
    4300: '#FFD5B3',
    4400: '#FFD7B7',
    4500: '#FFDABB',
    4600: '#FFDCBF',
    4700: '#FFDEC3',
    4800: '#FFE0C7',
    4900: '#FFE2CA',
    5000: '#FFE4CE',
    5100: '#FFE6D1',
    5200: '#FFE8D5',
    5300: '#FFEAD8',
    5400: '#FFECDB',
    5500: '#FFEDDE',
    5600: '#FFEFE1',
    5700: '#FFF1E4',
    5800: '#FFF3E7',
    5900: '#FFF4EA',
    6000: '#FFF6ED',
    6100: '#FFF8F0',
    6200: '#FFF9F2',
    6300: '#FFFBF5',
    6400: '#FFFDF8',
    6500: '#FFFEFA',
    6600: '#FFFFFF',
    6700: '#FEF9FF',
    6800: '#FAF6FF',
    6900: '#F6F4FF',
    7000: '#F3F2FF',
    7100: '#F0F0FF',
    7200: '#EDEFFF',
    7300: '#EAEDFF',
    7400: '#E8ECFF',
    7500: '#E6EBFF',
    7600: '#E4EAFF',
    7700: '#E2E9FF',
    7800: '#E0E8FF',
    7900: '#DFE7FF',
    8000: '#DDE6FF',
    8100: '#DCE5FF',
    8200: '#DAE4FF',
    8300: '#D9E3FF',
    8400: '#D8E3FF',
    8500: '#D7E2FF',
    8600: '#D6E1FF',
    8700: '#D5E1FF',
    8800: '#D4E0FF',
    8900: '#D3DFFF',
    9000: '#D2DFFF'
};

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
        this.powerButton.addEventListener('click', () => {
            this.sendXHR('power', 'get', '/light/power');
            setTimeout(this.updateGuiRequest(), 1000);
        });

        /*Brightness */
        this.brightnessLight = document.getElementById('whiteLightBrightnessSVG').contentDocument.getElementById('innerBulb');
        this.brightnessSlider = document.getElementById('brightnessSlider');
        /*adjust the color of the brightnessLight, change value in the box, send update to hardware */
        this.brightnessSlider.addEventListener('input', () => {
            this.brightnessLight.style.fill = `rgba(255, 255, 0, ${this.brightnessSlider.value / 100})`;
            document.getElementById('brightnessBox').value = `${this.brightnessSlider.value}%`;
            this.updateWhiteLight();
        });
        this.brightnessBox = document.getElementById('brightnessBox');

        /* Color Temperature*/
        this.colorTempLight = document.getElementById('whiteLightColorTempSVG').contentDocument.getElementById('innerBulb');
        this.colorTempSlider = document.getElementById('colorTempSlider');
        /*adjust color of the colorTempLight, change value in the box, send update to hardware */
        this.colorTempSlider.addEventListener('input', () => {
            this.colorTempLight.style.fill = colorTempToHex[this.colorTempSlider.value];
            document.getElementById('colorTempBox').value = this.colorTempSlider.value;
            this.updateWhiteLight();
        });
        this.colorTempBox = document.getElementById('colorTempBox');

        this.colorLight = document.getElementById('colorLightSVG').contentDocument.getElementById('innerBulb');

        this.whiteLightButton = document.getElementById('whiteLightButton');
        this.whiteLightButton.addEventListener('click', () => {
            this.showTab('whiteLightContainer');
        });
        this.colorLightButton = document.getElementById('colorLightButton');
        this.colorLightButton.addEventListener('click', () => {
            this.showTab('colorLightContainer');
        });
        this.initColorPicker();
        this.updateGuiRequest();
        this.refresh();
    }

    /**
     * @description handle server response
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {String} event
     * @param {String/json} response
     * @memberof Light
     */
    asyncHandler(event, response) {
        let r;
        try {
            r = JSON.parse(response);
        } catch (e) {
            console.error(response);
            throw new Error(e);
        }
        switch (event) {
            case 'gui':
                this.updateGui(r.light_state);
                break;
            case 'power':
                this.updateGuiRequest();
                break;
        }
    }

    /**
     * @description enabled / disable elements
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {String} state
     * @memberof Light
     */
    enableDisableElements(state) {
        if (state === 'enable') {
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
     * @description convert hex to rgb
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {String} hex
     * @returns {Object}
     * @memberof Light
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
     * @description Update the UI every 10 seconds
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    refresh() {
        setTimeout(() => {
            this.updateGuiRequest();
            this.refresh();
        }, 10000);
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
     * @description send XHR request to the server
     * @author Jan Kaiser
     * @date 2018-09-18
     * @param {String} event what needs to be updated in the callback
     * @param {String} type get/post
     * @param {String} path on the server we're requesting
     * @param {Object/null} setup setup of the new light state
     * @memberof Light
     */
    sendXHR(event, type, path, setup) {
        const url = `http://${'192.168.178.39'}:${33999}${path}`;
        /*const config = {
            mode: 'no-cors'
        };
        if (setup) {
            config.method = type;
            config.headers = {
                'Content-Type': 'application/json'
            };
            config.body = setup;
        }
        fetch(url, config)
            .then(resp => resp.json())
            .then(data => this.asyncHandler(event, data))
            .catch(e => { throw new Error(e) });
    */
        const req = new XMLHttpRequest();
        req.open(type, url);
        req.addEventListener('readystatechange', () => {
            if (req.readyState === 4) { // done
                this.asyncHandler(event, req.response);
            }
        });
        if (type === 'post') {
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(setup));
        } else {
            req.send();
        }
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
    updateColorLight() {
        const hsv = this.RGBtoHSV(parseInt(document.getElementById('rVal').value, 10), parseInt(document.getElementById('gVal').value, 10), parseInt(document.getElementById('bVal').value, 10));
        const packet = {
            mode: 'normal',
            hue: Math.round(hsv.h * 360),
            saturation: Math.round(hsv.s * 100),
            color_temp: 0,
            brightness: Math.round(hsv.v * 100)
        };
        this.sendXHR('setLight', 'post', '/light/mode', packet);
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
            this.enableDisableElements('disable');
        } else {
            this.enableDisableElements('enable');
        }

        /* update the gui for the temperature light*/
        colorTemp = colorTemp || 2500;
        /* if color light is currently set, LB130 returns 0. Using value for 2500 to initialize it to _something_ */
        this.colorTempBox.value = colorTemp;
        this.colorTempSlider.value = colorTemp;
        this.colorTempLight.style.fill = colorTempToHex[colorTemp];

        /* update the gui for the brightness light*/
        const brightness = (response.brightness !== undefined) ? response.brightness : response.dft_on_state.brightness;
        this.brightnessBox.value = brightness;
        this.brightnessSlider.value = brightness;
        this.brightnessLight.style.fill = `rgba(255, 255, 0, ${brightness / 100})`;

        /*update the gui for the color light */
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

    /**
     * @description send an info-request to the light
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    updateGuiRequest() {
        this.sendXHR('gui', 'get', '/light/info');
    }

    /**
     * @description creates the config for the white light
     * @author Jan Kaiser
     * @date 2018-09-18
     * @memberof Light
     */
    updateWhiteLight() {
        const packet = {
            mode: 'normal',
            hue: 0,
            saturation: 0,
            color_temp: this.colorTempSlider.value,
            brightness: this.brightnessSlider.value
        };
        this.sendXHR('setLight', 'post', '/light/mode', packet);
    }
}

window.onload = () => {
    (() => new Light())();
};


/***/ })
/******/ ]);