/*******USER VARIABLES***********/

var hostname = "";
var port = ; //use same port as in server.js



/********************************/



/*state variable for initialization*/
var tabsHidden = true;

var powerButton;

/*Color Temperature*/
var colorTempSlider;
var colorTempBox;
var colorTempBulb;

/*Brightness*/
var brightnessSlider;
var brightnessBox;
var brightnessBulb;

var colorBulb;

var whiteLightButton;
var colorLightButton;

/*var saveWhiteLightButton;
var saveColorLightButton;*/

/*
 * hex codes for color temperature
 * calculated by using the algorithm from http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
 */
var colorTempToHex = {
	2500: "#FF9F46",
	2600: "#FFA34F",
	2700: "#FFA757",
	2800: "#FFAA5F",
	2900: "#FFAE67",
	3000: "#FFB16E",
	3100: "#FFB475",
	3200: "#FFB87B",
	3300: "#FFBB81",
	3400: "#FFBE87",
	3500: "#FFC18D",
	3600: "#FFC392",
	3700: "#FFC697",
	3800: "#FFC99D",
	3900: "#FFCBA1",
	4000: "#FFCEA6",
	4100: "#FFD0AB",
	4200: "#FFD3AF",
	4300: "#FFD5B3",
	4400: "#FFD7B7",
	4500: "#FFDABB",
	4600: "#FFDCBF",
	4700: "#FFDEC3",
	4800: "#FFE0C7",
	4900: "#FFE2CA",
	5000: "#FFE4CE",
	5100: "#FFE6D1",
	5200: "#FFE8D5",
	5300: "#FFEAD8",
	5400: "#FFECDB",
	5500: "#FFEDDE",
	5600: "#FFEFE1",
	5700: "#FFF1E4",
	5800: "#FFF3E7",
	5900: "#FFF4EA",
	6000: "#FFF6ED",
	6100: "#FFF8F0",
	6200: "#FFF9F2",
	6300: "#FFFBF5",
	6400: "#FFFDF8",
	6500: "#FFFEFA",
	6600: "#FFFFFF",
	6700: "#FEF9FF",
	6800: "#FAF6FF",
	6900: "#F6F4FF",
	7000: "#F3F2FF",
	7100: "#F0F0FF",
	7200: "#EDEFFF",
	7300: "#EAEDFF",
	7400: "#E8ECFF",
	7500: "#E6EBFF",
	7600: "#E4EAFF",
	7700: "#E2E9FF",
	7800: "#E0E8FF",
	7900: "#DFE7FF",
	8000: "#DDE6FF",
	8100: "#DCE5FF",
	8200: "#DAE4FF",
	8300: "#D9E3FF",
	8400: "#D8E3FF",
	8500: "#D7E2FF",
	8600: "#D6E1FF",
	8700: "#D5E1FF",
	8800: "#D4E0FF",
	8900: "#D3DFFF",
	9000: "#D2DFFF"
}





window.onload = function () {
	initVariables(); //initialize needed variables
	initEventListeners(); //initialize eventListeners
	updateGuiRequest(); //initialize the gui elements states
}

/*initialize all variables needed for operation*/
function initVariables() {
	powerButton = document.getElementById("powerButton");
	brightnessBulb = document.getElementById("bright-bulb-svg");
	brightnessSlider = document.getElementById("brightnessSlider");
	brightnessBox = document.getElementById("brightnessBox");

	colorTempBulb = document.getElementById("temp-bulb-svg");
	colorTempSlider = document.getElementById("colorTempSlider");
	colorTempBox = document.getElementById("colorTempBox");

	colorBulb = document.getElementById("color-bulb-svg");

	whiteLightButton = document.getElementById("whiteLightButton");
	colorLightButton = document.getElementById("colorLightButton");

	/*saveWhiteLightButton = document.getElementById("saveWhiteLightButton");
	saveColorLightButton = document.getElementById("saveColorLightButton");*/
}
/*initialize all eventListeners needed for operation*/
function initEventListeners() {
	/*send a power signal to the server*/
	powerButton.addEventListener('click', function () {
		sendXHR("power", "get", "/light/power");
		setTimeout(updateGuiRequest(), 1000);
	});
	/*adjust the color of the brightnessBulb, change value in the box, send update to bulb*/
	brightnessSlider.addEventListener("input", function () {
		brightnessBulb.style.fill = "rgba(255, 255, 0, " + (this.value / 100) + ")";
		document.getElementById("brightnessBox").value = this.value + "%";
		updateWhiteLight();
	});
	/*adjust color of the colorTempBulb, change value in the box, send update to bulb*/
	colorTempSlider.addEventListener("input", function () {
		colorTempBulb.style.fill = colorTempToHex[this.value];
		document.getElementById("colorTempBox").value = this.value;
		updateWhiteLight();
	});

	/*change tab on button click*/
	whiteLightButton.addEventListener("click", function () {
		showTab('whiteLightContainer');
	});
	colorLightButton.addEventListener("click", function () {
		showTab('colorLightContainer');
	});

	/*send info to bulb about white light*/
	/*	saveWhiteLightButton.addEventListener("click", function () {
			var packet = {
				"mode": "normal",
				"hue": 0,
				"saturation": 0,
				"color_temp": colorTempSlider.value,
				"brightness": brightnessSlider.value
			};
			sendXHR("setLight", "post", "/light/mode", packet);
		});*/
	/*send info to bulb about color light*/
	/*saveColorLightButton.addEventListener("click", function () {
		var hsv = RGBtoHSV(parseInt(document.getElementById("rVal").value), parseInt(document.getElementById("gVal").value), parseInt(document.getElementById("bVal").value));
		var packet = {
			"mode": "normal",
			"hue": Math.round(hsv.h * 360),
			"saturation": Math.round(hsv.s * 100),
			"color_temp": 0,
			"brightness": Math.round(hsv.v * 100)
		};
		sendXHR("setLight", "post", "/light/mode", packet);
	});*/
}

function updateColorLight() {
	var hsv = RGBtoHSV(parseInt(document.getElementById("rVal").value), parseInt(document.getElementById("gVal").value), parseInt(document.getElementById("bVal").value));
	var packet = {
		"mode": "normal",
		"hue": Math.round(hsv.h * 360),
		"saturation": Math.round(hsv.s * 100),
		"color_temp": 0,
		"brightness": Math.round(hsv.v * 100)
	};
	sendXHR("setLight", "post", "/light/mode", packet);
}

function updateWhiteLight() {
	var packet = {
		"mode": "normal",
		"hue": 0,
		"saturation": 0,
		"color_temp": colorTempSlider.value,
		"brightness": brightnessSlider.value
	};
	sendXHR("setLight", "post", "/light/mode", packet);
}

/*send XHR request to the server*/
function sendXHR(event, type, path, packet) {
	var req = new XMLHttpRequest();
	url = "http://" + hostname + ":" + port + path;
	req.open(type, url);
	req.addEventListener('readystatechange', function () {
		if (req.readyState === 4) { // done
			asyncHandler(event, req.response);
		}
	});
	if (type === "post") {
		req.setRequestHeader("Content-Type", "application/json");
		req.send(JSON.stringify(packet));
	} else {
		req.send();
	}
}

/*handle server response*/
function asyncHandler(event, response) {
	try {
		response = JSON.parse(response);
	} catch (e) {
		console.log(e);
		console.log(response);
	}
	switch (event) {
		case "gui":
			updateGui(response.light_state);
			break;
		case "power":
			updateGuiRequest();
			break;
		case "setLight":
			//updateGui(response); //no longer needed if we don't have a save button
			break;
	}
}

/*update the gui whenever a server response is received*/
function updateGui(response) {

	var color_temp = (response.color_temp === undefined) ? response.dft_on_state.color_temp : response.color_temp;

	/*After initial load, remove the loading screen and display the tabs*/
	if (tabsHidden) {
		document.getElementById("tabs").style.display = "flex";
		if (color_temp === 0) {
			showTab('colorLightContainer');
		} else {
			showTab('whiteLightContainer');
		}
		tabsHidden = false;
	}

	/*enabled/disable elements based on bulb state*/
	if (response.on_off == 0) {
		enableDisableElements("disable");
	} else {
		enableDisableElements("enable");
	}

	/*update the gui for the temperature bulb*/
	color_temp = (color_temp === 0) ? 2500 : color_temp;
	/* if color light is currently set, the bulb returns 0. Using value for 2500 to initialize it to _something_ */
	colorTempBox.value = color_temp;
	colorTempSlider.value = color_temp;
	colorTempBulb.style.fill = colorTempToHex[color_temp];

	/*update the gui for the brightness bulb*/
	var brightness = (response.brightness === undefined) ? response.dft_on_state.brightness : response.brightness;
	brightnessBox.value = brightness;
	brightnessSlider.value = brightness;
	brightnessBulb.style.fill = "rgba(255, 255, 0, " + (brightness / 100) + ")";

	/*update the gui for the color bulb*/
	var hue = (response.hue === undefined) ? response.dft_on_state.hue : response.hue;
	var saturation = (response.saturation === undefined) ? response.dft_on_state.saturation : response.saturation;
	var rgb = HSVtoRGB(hue / 360, saturation / 100, brightness / 100);
	document.getElementById("rVal").value = rgb.r;
	document.getElementById("gVal").value = rgb.g;
	document.getElementById("bVal").value = rgb.b
	document.getElementById("rgbVal").value = rgb.r + "," + rgb.g + "," + rgb.b;
	var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
	document.getElementById("hexVal").value = hex;
	colorBulb.style.fill = hex;
}

/*send an info-request to the bulb*/
function updateGuiRequest() {
	sendXHR("gui", "get", "/light/info");
}
/*display a specific tab*/
function showTab(tabName) {
	var tabs = document.getElementsByClassName("tab");
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].style.display = "none";
	}
	document.getElementById(tabName).style.display = "inline-flex";
}

/* accepts parameters
 * h, s, v
 * This code expects 0 <= h, s, v <= 1, if you're using degrees or radians, remember to divide them out.
 *
 * The returned 0 <= r, g, b <= 255 are rounded to the nearest Integer. If you don't want this behaviour remove
 * the Math.rounds from the returned object.
 */
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			r = v, g = t, b = p;
			break;
		case 1:
			r = q, g = v, b = p;
			break;
		case 2:
			r = p, g = v, b = t;
			break;
		case 3:
			r = p, g = q, b = v;
			break;
		case 4:
			r = t, g = p, b = v;
			break;
		case 5:
			r = v, g = p, b = q;
			break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}



/* accepts parameters
 * r, g, b
 * This code will output 0 <= h, s, v <= 1, but this time takes any 0 <= r, g, b <= 255 (does not need to be an integer)
 */
function RGBtoHSV(r, g, b) {
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		d = max - min,
		h = (max === 0 ? 0 : d / max),
		s = (max === 0 ? 0 : d / max),
		v = max / 255;
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
		h: h,
		s: s,
		v: v
	};
}

/*Convert rgb to a hex value*/
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
/*convert hex to rgb*/
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/*enabled / disable elements*/
function enableDisableElements(state) {
	if (state === "enable") {
		/*enable elements*/
		powerButton.className = "powerButtonGreen";
		powerButton.setAttribute("state", "on");
		/*	document.getElementById("saveWhiteLightButton").className = "saveButton";
			document.getElementById("saveWhiteLightButton").disabled = false;
			document.getElementById("saveColorLightButton").className = "saveButton";
			document.getElementById("saveColorLightButton").disabled = false;*/

		colorTempSlider.disabled = false;
		brightnessSlider.disabled = false;
		bCanPreview = true;

	} else {
		/*disable elements*/
		powerButton.className = "powerButtonRed";
		powerButton.setAttribute("state", "off");
		/*	document.getElementById("saveWhiteLightButton").className = "disabledSaveButton";
			document.getElementById("saveWhiteLightButton").disabled = true;
			document.getElementById("saveColorLightButton").className = "disabledSaveButton";
			document.getElementById("saveColorLightButton").disabled = true;*/

		colorTempSlider.disabled = true;
		brightnessSlider.disabled = true;
		bCanPreview = false;

	}
}
