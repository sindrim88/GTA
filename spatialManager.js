/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    var id = this._nextSpatialID;
    this._nextSpatialID += 1;
    return id;
},

reset : function (){
    this._nextSpatialID = 1;
    this._entities.length = 0;
},


register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    var radius = entity.getRadius();
    entity['posX'] = pos['posX'];
    entity['posY'] = pos['posY'];
    entity['spatialID'] = spatialID;
    entity['radius'] = radius;
    this._entities.push(entity);
},
/*
unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    for (var i = 0; i<this._entities.length; i += 1) {
        var e = this._entities[i]
        if (e.spatialID === spatialID) {
            this._entities.splice(i, 1);
            return;
        }
    }
},
*/
unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
},

findEntityInRange: function(posX, posY, radius) {
    /*
    var entity;
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var insideRange = util.distSq(posX, posY, e.posX, e.posY) < util.square(e.radius + radius)
        if (insideRange) {
            entity = e;
        }
    }
    return entity;
    */
},

findEntityInRangeCars: function(Player) {
    var halfwidth = 10;
    var entity, pos, posX, posY, radius;
    var cars = entityManager.getCars();

    for (var i = 0; i<cars.length; i += 1) {
        var e = cars[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = 15;
        //console.log(Player.cx,Player.cy);
        var insideRange = util.distSq(Player.cx, Player.cy, e.posX, e.posY) < util.square(e.radius + halfwidth);
        if (insideRange && (i != g_currentCar)) {
            entity = e;
        }
    }
    return entity;
},



//find the pedestrians that are hit by bullets
findEntityHitFromBullet: function(Wire){

    var halfwidth = Wire.getRadius()/2;
    var entity, pos, posX, posY, radius;
    var pedestrians = entityManager.getPedestrians();

    for (var i = 0; i<pedestrians.length; i += 1) {
        var e = pedestrians[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();
        var insideRange = util.distSq(Wire.cx, Wire.cy, e.posX, e.posY) < util.square(e.radius + halfwidth);
        if (insideRange) {
            entity = e;
        }
    }
    return entity;

},


findEntityHitAndRun : function(Player){
    var halfwidth = 15;
    var entity, pos, posX, posY, radius;
    var pedestrians = entityManager.getPedestrians();

    for (var i = 0; i < pedestrians.length; i += 1) {
        var e = pedestrians[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();
        var insideRange = util.distSq(Player.cx, Player.cy, e.posX, e.posY) < util.square(e.radius + halfwidth);
        if (insideRange) {
            entity = e;
        }
    }
    return entity;
},





render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
