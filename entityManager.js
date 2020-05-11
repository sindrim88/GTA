/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_players  : [],
_bullets : [],
_blocks : [],
_balloons : [],
_walk : [],
_roads : [],
_pedestrian :[],
_skidMark : [],
_wire : [],


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,
newScale : 1,
// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._roads, this._skidMark, this._pedestrian, this._players, this._wire, this._blocks, this._balloons, this._walk];
},


init: function() {
},


_findNearestCar : function(posX, posY) {

    // TODO: Implement this

    // NB: Use this technique to let you return "multiple values"
    //     from a function. It's pretty useful!
    //Set the first ship as the losest ship. Then change that later if a closer ship is found.
    var prevCar = util.wrappedDistSq(posX, posY, this._players[0].cx, this._players[0].cy, g_canvas.width, g_canvas.height);
	var distance;
	var closestIndex = 0;
    var cx = 0;
    var cy = 0;
	//Loop through all the cars and compare them to players position
    for(var i = 0; i < this._players.length; i++){
    	
    	//calculate distance from car[i] to walking player. 
    	distance = util.wrappedDistSq(posX, posY, this._players[i].cx, this._players[i].cy, g_canvas.width, g_canvas.height);
    	//console.log(distance);
    	if(distance < prevCar) {
   			prevCar = distance; 
    		closestIndex = i;
    	}
    }

    var closestCar = this._players[closestIndex];

	var closestCX = this._players[closestIndex].cx;
    var closestCY = this._players[closestIndex].cy;

    return {
	theCar : closestCar,   // the object itself
	theIndex: closestIndex,   // the array index where it lives
    cx :closestCX,
    cy :closestCY,
    };
},

yoinkNearestCar : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"
    var index = this._findNearestCar(xPos,yPos).theIndex; 
    //set the nearest ship to the mouse position
 	

 	this._players[index].drivingCar = true;
	console.log(index, this._players[index]);
	g_currentCar = index;
    //this._player[index].cx = xPos;
    //this._players[index].cy = yPos;
},



// make all cars non player driving when player exits one
exitAllcars : function(){
	for (var i = 0; i < this._players.length; i++) {
		//console.log(i);
		this._players[i].drivingCar = false;
	}
},


genarateSkidmark: function(cx, cy) {
    this._categories[1].push(
        new Skidmark({
            cx,
            cy,
        })
    );
},




genaratePedestrian: function(cx, cy, count) {
    this._categories[2].push(
        new Pedestrians({
            cx,
            cy,
            count,
        })
    );
},


genarateWalk: function(cx, cy, rotation) {
    this._categories[6].push(
        new Walk({
            cx,
            cy,
            rotation,
        })
    );
},

genarateRoad: function(cx, cy) {
    this._categories[0].push(
        new Road({
            cx,
            cy,
        })
    );
},



fire: function(cx, cy, rotation) {
    this._categories[4].push(
        new Wire({
            cx,
            cy,
            rotation,
        })
    );
},

//player car
generatePlayer : function(cx, cy, power) {
    var player = new Player();
    this._players.push(new Player({cx, cy, power}))
},

generateGround : function(cy, halfHeight) {
    this._blocks.push(
        new Block({
            cx : g_canvas.width/2,
            cy,
            halfWidth : g_canvas.width/2,
            halfHeight,
        }));

    return cy + halfHeight;
},

generateBalloon : function(cx, cy) {
    this._categories[6].push(
        new Balloon({
            cx,
            cy,
        })
    );
},

resetBubbles: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltBubbles: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},	



getPedestrians : function() {
    return this._categories[2];
},


getCars:function(){
    return this._categories[3];
},



update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }
},



render: function(ctx) {
			
    for (var c = 0; c < this._categories.length; ++c) {
        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; i++) {
                if(g_carMode){
                    ctx.save();
                    ctx.translate(-g_offsetX*g_scale+g_scaleDiff,-g_offsetY*g_scale+g_scaleDiff);
                    ctx.scale(g_scale, g_scale);
                    aCategory[i].render(ctx);
                    ctx.restore();
                }     
                else {
                    ctx.save();
                    ctx.translate(-g_offsetX,-g_offsetY);
                    ctx.scale(1,1);
                    aCategory[i].render(ctx);
                    ctx.restore();
                }
                
            }
        }
    },
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

