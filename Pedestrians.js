"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Pedestrians(descr) {
    
    this.setup(descr);
    this.radius = 15; 
};

Pedestrians.prototype = new Entity()

// Initial, inheritable, default values

Pedestrians.prototype.cx = 2;
Pedestrians.prototype.cy = 2;
Pedestrians.prototype.rotation = 1.5;
Pedestrians.prototype.count = 0;
Pedestrians.prototype.random;
Pedestrians.prototype.xVel = 0.7;
Pedestrians.prototype.yVel = 0.7;
Pedestrians.prototype.speed = 1;
Pedestrians.prototype.angle = 0;
Pedestrians.prototype.left = true;
Pedestrians.prototype.spriteCell = 0;
Pedestrians.prototype.sprite;
Pedestrians.prototype.animationLag = 5;
Pedestrians.prototype.spriteMode = 1;
//Pedestrians.prototype.PedDeath = false;





Pedestrians.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return -1;
    }

	this.walkCycle(du);
    this.spriteUpdate();
    /*
    var entity = this.findHitEntity();
    
    if (entity) {
        return this.kill();
    }
    */

     if(!this._isDeadNow){
         spatialManager.register(this);
    }

};

Pedestrians.prototype.render = function (ctx) {
	this.sprite.drawCentredAt(ctx, this.cx , this.cy, this.rotation, 0.2, this.left);

}


Pedestrians.prototype.spriteUpdate = function () {

    this.sprite = g_sprite_cycles[this.spriteMode][this.spriteCell];

    //Manage the speed - better way of doing this ?
    if(this.animationLag > 0) {
        this.animationLag--;
    }
    else {
        //Go to next frame of sprite animation after each passage of given duration
        //console.log(this.spriteCell);
        this.spriteCell++;
        this.animationLag = 8;

        if (this.spriteCell === g_sprite_cycles[this.spriteMode].length){
            //If sprite is in death animation cycle, kill once he reaches the end of the animation.
            //if(this.spriteMode === 0) return this.kill();
            //Likewise if sprite is in sword slashing animation cycle, return to idle once animation is complete.
            //if(this.spriteMode === 4) this.spriteMode = 1;
            //if(this.shoot) this.shoot = false;
            //Reset to beginning of whatever animation cycle you are in
            this.spriteCell = 0;
        }
    }
};


Pedestrians.prototype.walkCycle =  function (du) {
	//... 

	if(this.cx < 2970 && this.cy < 2970){
		this.rotation = 90*Math.PI/180;
	}
 	if(this.cx >= 2970){
 	 	this.cx = 2971;
 	 	this.rotation = 180*Math.PI/180;
 	}
 	if(this.cy >= 2970 && this.cx >= 2970){
 		this.cy = 2972;
 		this.cx = 2969;
 		this.rotation = 270*Math.PI/180;
 	}
 	if (this.cx <= 50){
 		this.cx = 49;
 		this.rotation = 360*Math.PI/180;
	}
	if(this.cx <= 50 && this.cy <= 70){
 			this.rotation = 90*Math.PI/180;
 			this.cx = 51;
 			this.cy = 71;
 	}
	this.cx += this.speed * Math.sin(this.rotation);
    this.cy -= this.speed * Math.cos(this.rotation);
}
