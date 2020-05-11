
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Walk(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    //this.sprite = g_sprite_cycles[0][0];;
    this.scale  = 0.1;
    //this._scale = 0.2;
    this.speed = 0;
    this.radius = 5;
};

Walk.prototype = new Entity();

Walk.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Walk.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Walk.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Walk.prototype.KEY_THRUST  = 'W'.charCodeAt(0);
Walk.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Walk.prototype.KEY_FIRE   = 'N'.charCodeAt(0);

// Initial, inheritable, default values
Walk.prototype.rotation;
Walk.prototype.cx = 50;
Walk.prototype.cy = 50;
Walk.prototype.numSubSteps = 1;    
Walk.prototype.speed = 0;    
Walk.prototype.angle = 0;
Walk.prototype.moveAngle = Math.PI*1.5;
Walk.prototype.offsetX = 0;
Walk.prototype.offsetY = 0;
Walk.prototype.left = true;
Walk.prototype.spriteCell = 0;
Walk.prototype.sprite;
Walk.prototype.animationLag = 5;
Walk.prototype.spriteMode = 1;
Walk.prototype.closeTOCar = false;
Walk.prototype.count = 0;
var cx;
var cy;

Walk.prototype.update = function (du) {
    

    spatialManager.unregister(this);

    if(!g_walkMode && this.closeTOCar === true){
        entityManager.yoinkNearestCar(this.cx, this.cy);
        return entityManager.KILL_ME_NOW;
    }
    
    else if(g_walkMode || this.closeTOCar === false){
        if(!g_walkMode){

            if(this.count === 0){
                var ent = entityManager._findNearestCar(this.cx,this.cy);
                var index = entityManager._findNearestCar(this.cx,this.cy).theIndex; 
                cx = entityManager._findNearestCar(this.cx,this.cy).cx;
                cy = entityManager._findNearestCar(this.cx,this.cy).cy;
                
                this.count++;
                
                var temp = Math.atan2(cy-this.cy, cx-this.cx);
                //this.rotation = temp + 1.3988;
                this.rotation = temp +90*Math.PI/180;
                console.log("rotation find: ", this.rotation);
            }
            console.log("rotation now: " , this.rotation);

            var dist;
            if(!g_walkMode){
                //distSq: function(x1, y1, x2, y2) 
                dist = util.distSq(this.cx, this.cy, cx, cy);
                //console.log("Dist: " , dist, cx,cy);
                if(dist < this.sprite.width*4){
                    this.closeTOCar === true;
                    entityManager.yoinkNearestCar(this.cx, this.cy);
                     return entityManager.KILL_ME_NOW;
                }
            }
            this.speed = 5.5;
        }

        if (this._isDeadNow) return;
            //this.spritesss.scale = 0.25;
            // Handle firing
        
            /*
        var entity = this.findHitEntity();
        if (entity) {
            return this.kill();
        }
    */

        var steps = this.numSubSteps;
        var dStep = du / steps;
        for (var i = 0; i < steps; ++i) {
            this.computeSubStep(dStep);
        }
        this.maybeFire(ctx);
        
        this.scale = 0.25;
        g_offsetX = this.cx-g_canvas.width/2;
        g_offsetY = this.cy-g_canvas.height/2;
        this.spriteUpdate();
    }
   
    if(!this._isDeadNow){
        spatialManager.register(this);
    }

};

Walk.prototype.maybeFire = function (ctx) {

    if (eatKey(this.KEY_FIRE)) {
        console.log("fire", this.cx, this.cy, this.rotation);
        entityManager.fire(this.cx, this.cy, this.rotation);
    }
};

Walk.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
};


Walk.prototype.render = function (ctx) {

    if(g_walkMode || this.closeTOCar === false){
        g_offsetX = this.cx-g_canvas.width/2;
        g_offsetY = this.cy-g_canvas.height/2;
        // this.sprite.drawCentredAt(ctx, this.cx , this.cy, this.moveAngle,1);
        this.sprite.drawCentredAt(
            ctx, this.cx, this.cy, this.rotation, 0.2, this.left
            );
    }
};

Walk.prototype.run = function(ctx, du){
    if(this.speed >= 1){
        this.speed *= 0.77; 
    }
    else if(this.speed <= -0.9){
        this.speed *= 0.7; 
    } 
    else if(this.speed > 0){
        this.speed =  this.speed/2; 
    }  
    else if(this.speed < 0){
        this.speed = this.speed/2; 
    }
    if(this.speed >= -0.2 && this.speed < 0.2){
        this.speed = 0;
    }
    if(this.speed === 0){
        this.spriteCell = 0;
    }
}


Walk.prototype.computeSubStep = function (du) {
    
    this.updateRotation(du);
    this.computeThrustMag();
    this.run(ctx,du);    

    this.angle += this.moveAngle * Math.PI / 180;
    this.cx += this.speed * Math.sin(this.rotation);
    this.cy -= this.speed * Math.cos(this.rotation);
};


var NOMINAL_ROTATE_RATE = 0.075;
Walk.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
        this.moveAngle -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
        this.moveAngle += NOMINAL_ROTATE_RATE * du;
    }
};


var NOMINAL_THRUST = +3.5;
var NOMINAL_RETRO  = -2;

Walk.prototype.computeThrustMag = function () {
   
    if (keys[this.KEY_THRUST]) {
        this.speed = NOMINAL_THRUST;
    }
    if (keys[this.KEY_RETRO]) {
        this.speed = NOMINAL_RETRO;
    }
    return this.speed;
};


Walk.prototype.inWorld = function () {

    if(this.cx < this.sprite.width/2*this.scale*0.5){
        this.cx = this.sprite.width/2*this.scale*0.5; 
    }
    if(this.cx > g_canvas.width- this.sprite.width/2*this.scale*0.5){
        this.cx = g_canvas.width - this.sprite.width/2*this.scale*0.5; 
    }
    if(this.cy <  this.sprite.width/2*this.scale*0.5){
        this.cy =  this.sprite.width/2*this.scale*0.5;
    }
    if(this.cy > g_canvas.height- this.sprite.width/2*this.scale*0.5){
        this.cy = g_canvas.height- this.sprite.width/2*this.scale*0.5;
    }
}


Walk.prototype.spriteUpdate = function () {

   // console.log(this.animationLag,this.spriteCell,this.spriteMode);

    this.sprite = g_sprite_cycles[this.spriteMode][this.spriteCell];

    //Manage the speed - better way of doing this ?
    if(this.animationLag > 0) {
        this.animationLag--;
    }
    else {
        //Go to next frame of sprite animation after each passage of given duration
        //console.log(this.spriteCell);
        this.spriteCell++;
        this.animationLag = 4;

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
