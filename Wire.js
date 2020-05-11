
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Wire(descr) {

    this.setup(descr);

    this.sprite =  g_sprites.car1;
    this.scale = 0.05;
    this.left = true;
    this.radius = 5;
};


Wire.prototype = new Entity();

// Initial, inheritable, default values
Wire.prototype.velY = -2;
Wire.prototype.cx = 2;
Wire.prototype.cy = 2;
Wire.prototype.rotation = 2;
Wire.prototype.speed = 22;

Wire.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }
    //this.cy += this.velY*du;
    this.cx += this.speed * Math.sin(this.rotation);
    this.cy -= this.speed * Math.cos(this.rotation);
    // If "wire" crosses top edge of canvas
    
    if (this.cy <= 0 ||  this.cy > g_canvas.height || this.cx < 0 || this.cx > g_canvas.width ) {
        return entityManager.KILL_ME_NOW;
    }
    if(this){
        var hitEntity = this.findHitEntity();
        hitEntity = spatialManager.findEntityHitFromBullet(this);
    
        if (hitEntity){
            var canTakeHit = hitEntity.takeWireHit;
            if (canTakeHit) canTakeHit.call(hitEntity);
            
            hitEntity._isDeadNow = true;
            return entityManager.KILL_ME_NOW;
        }
    }
    

    if(!this._isDeadNow){
         spatialManager.register(this);
    }

};

Wire.prototype.render = function (ctx) {
    //console.log("fire test");
    this.sprite.drawCentredAt(
            ctx, this.cx, this.cy, this.rotation, this.scale, this.left
            );
    /*
    ctx.save();
    ctx.beginPath();
    ctx.translate(-g_offsetX*g_scale+g_scaleDiff,-g_offsetY*g_scale+g_scaleDiff);
    ctx.arc(this.cx, this.cy, 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    */
};



Wire.prototype.takeWireHit = function (hitEntity) {
    this.kill();
};