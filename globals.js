// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_carMode = false;
var g_walkMode = true;
var g_offsetX = 0;
var g_offsetY = 0;
var g_scale = 1;
var g_scaleDiff = 0;
var starPlayerRotation = 0;
var findCarAngle = 0;



// checks if walking character has been made in Player, stupid name
var g_prevSpeed = 0;

// Stores the index of the car that is being played.
var g_currentCar = 3;  



// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;
