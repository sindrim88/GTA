// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Skidmark(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    //this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Skidmark.prototype = new Entity();


Skidmark.prototype.cx = 0;
Skidmark.prototype.cy = 0;
Skidmark.prototype.rotation = 0;

// Convert times from milliseconds to "nominal" time units.
Skidmark.prototype.lifeSpan = 1500 / NOMINAL_UPDATE_INTERVAL;



Skidmark.prototype.update = function (du) {
 // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;


    // TODO: YOUR STUFF HERE! --- (Re-)Register
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Skidmark.prototype.render = function (du) {

    var fadeThresh = Skidmark.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    //console.log("skidmark");

    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.rect(this.cx-3, this.cy-3,1,4);
    ctx.rect(this.cx+3, this.cy+3,1,4);

    ctx.rect(this.cx-3, this.cy+3,4,1);
    //ctx.rect(this.cx+3, this.cy-3,4,1);

    ctx.stroke();
    ctx.closePath();
   // ctx.globalAlpha = 1;
};