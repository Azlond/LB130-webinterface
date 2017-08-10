/**
 *
 * HTML5 Color Picker
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 * 
 * Edited by Sintho 2017
 */
//var bCanPreview = true; // can preview

$(function () {


	// create canvas and context objects
	var canvas = document.getElementById('picker');
	var ctx = canvas.getContext('2d');

	// drawing active image
	var image = new Image();
	image.onload = function () {
		ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
	}

	// select desired colorwheel
	image.src = 'images/colorwheel.png';

	$('#picker').mousemove(function (e) { // mouse move handler
		//if (bCanPreview) {
		// get coordinates of current position
		var canvasOffset = $(canvas).offset();
		var canvasX = Math.floor(e.pageX - canvasOffset.left);
		var canvasY = Math.floor(e.pageY - canvasOffset.top);

		// get current pixel
		var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
		var pixel = imageData.data;

		// update preview color
		var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
		$('.preview').css('backgroundColor', pixelColor);

		// update controls
		$('#rVal').val(pixel[0]);
		$('#gVal').val(pixel[1]);
		$('#bVal').val(pixel[2]);
		$('#rgbVal').val(pixel[0] + ',' + pixel[1] + ',' + pixel[2]);

		var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
		$('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));
		document.getElementById("color-bulb-svg").style.fill = $('#hexVal').val();
		$('#hexInput').val($('#hexVal').val());
		//	}
	});
	$('#picker').click(function (e) { // click event handler
		if ($('#powerButton').attr("state") === "on") {
			//if (bCanPreview) {
			updateColorLight();
			//	}
			//bCanPreview = !bCanPreview;
		}
	});

	$('#hexVal').keypress(function (e) {
		var regex = /[0-9]|[a-f]/i;
		if (!regex.test(e.originalEvent.key) && e.originalEvent.charCode != 0) {
			return false;
		}
		setTimeout(function () {
			if ($('#hexVal').val().charAt(0) != "#") {
				$('#hexVal').val("#" + $('#hexVal').val());
				while ($('#hexVal').val().length > 7) {
					$('#hexVal').val($('#hexVal').val().slice(0, -1));
				}
			}
			if ($('#hexVal').val().length === 7) {
				document.getElementById("color-bulb-svg").style.fill = $('#hexVal').val();
				var rgb = hexToRgb($('#hexVal').val());
				$('#rVal').val(rgb.r);
				$('#gVal').val(rgb.g);
				$('#bVal').val(rgb.b);
				$('#rgbVal').val(rgb.r + ',' + rgb.g + ',' + rgb.b);
				updateColorLight();
			}
		}, 50);
	});
});
