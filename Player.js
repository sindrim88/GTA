
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.rememberResets();
    // Default sprite, if not otherwise specified
    this.sprite = g_sprites.car1;
    //this.scale  = 0.5;
    //this.rotation =  Math.PI/180;
    this.speed = 0;
    this.carMode = false;
    this.drivingCar = false;
    this.radius = 30;
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Player.prototype.KEY_THRUST  = 'W'.charCodeAt(0);
Player.prototype.KEY_RETRO  = 'S'.charCodeAt(0);
Player.prototype.KEY_FIRE   = 'N'.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = Math.PI/180;
Player.prototype.cx = 200;
Player.prototype.cy = 200;

Player.prototype.nextX = 200;
Player.prototype.nextY = 200;

Player.prototype.prevX = 200;
Player.prototype.prevY = 200;

Player.prototype.scale = 0.25;
Player.prototype.numSubSteps = 1;    
Player.prototype.speed = 0;    

Player.prototype.moveAngle = Math.PI/2;
Player.prototype.offsetX = 0;
Player.prototype.offsetY = 0;
Player.prototype.count = 0;
Player.prototype.drivingCar = false; 

Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.drag = 0.9;
Player.prototype.angle =  90*Math.PI/180;
Player.prototype.angularVelocity = 0;
Player.prototype.angularDrag  = 0.5;
Player.prototype.power = 1;
Player.prototype.turnSpeed = 0.03;


Player.prototype.Mass = 0.03;

Player.prototype.foreWards = true;


Player.prototype.absX = 0;
Player.prototype.absY = 0;


Player.prototype.update = function (du) {
    
    spatialManager.unregister(this);
    
    //this.carBox(ctx);
    //find the driving car, pretty ugly... hmm how to fix?
    if(g_carMode && g_prevSpeed === 1){
        for (var i = 0; i < entityManager._players.length; i++) {
            g_prevSpeed +=3;

            if(entityManager._players[i].drivingCar === true){
                g_currentCar = i;
            }
        }
    }
    if(this.drivingCar &&  ((this.velX > 0.005 || this.velX < -0.005) && (this.velY < -0.005 || this.velY > 0.005) )){
        var hitEntity = this.findHitEntity();
        hitEntity = spatialManager.findEntityHitAndRun(this);
    
        if (hitEntity){
            var canTakeHit = hitEntity.takeWireHit;
            if (canTakeHit) canTakeHit.call(hitEntity);
            
            hitEntity._isDeadNow = true;
            //return entityManager.KILL_ME_NOW;
        }
        console.log(this.velX, this.velY);
    }

    // switch off to walk mode
    if(!g_carMode && g_prevSpeed === 2){
        g_prevSpeed += 1;
        entityManager.exitAllcars();
        return entityManager.genarateWalk(entityManager._players[g_currentCar].cx, entityManager._players[g_currentCar].cy, entityManager._players[g_currentCar].rotation);
    }
    
    if (this._isDeadNow) return;


        this.computeSubStep(du);
        this.steerCar();
        this.scale();
        this.inWorld();
        this.skidMarks();
        spatialManager.register(this);
};

/*
Player.prototype.takeWireHit = function (hitEntity) {
    
};
*/

Player.prototype.maybeFire = function () {

    if (eatKey(this.KEY_FIRE)) {
        entityManager.fire(this.cx, this.cy, this.rotation);
    }
};

Player.prototype.getRadius = function () {
    //return (this.sprite.width / 2) * 0.9;
    return 20;
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
};

Player.prototype.render = function (ctx) {
    ctx.beginPath();
    ctx.lineWidth=5;
    ctx.rect(2, 2,g_canvas.width,g_canvas.height);
    ctx.stroke();
    ctx.closePath();

    this.sprite.drawCentredAt(ctx, this.cx, this.cy, -this.angle + 270*Math.PI/180, 1);

    /*
     
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "black";
        ctx.rect(newX1,newY1,newX2,newY2);
        ctx.stroke();
        ctx.closePath();
      */

  
        ctx.save();
        ctx.beginPath();
        ctx.translate(-g_offsetX,-g_offsetY);
        
        //ctx.arc(this.cx, this.cy, 20, 0, 2 * Math.PI);
        
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
   


};




Player.prototype.takeWireHit = function (hitEntity) {
    this.kill();
};


Player.prototype.drive = function(ctx, du){
    if(this.speed > 0){
        this.speed *= 0.98; 
    }
    else if(this.speed <= -0.9){
        this.speed *= 0.7; 
    } 
    else if(this.speed < 0){
        this.speed = this.speed/2; 
    }
    if(this.speed >= -0.1 && this.speed < 0.1){
        this.speed = 0;
    }
};


Player.prototype.computeSubStep = function (du) {
    if(this.drivingCar){
        this.computeThrustMag();
        this.updateRotation(du);
       
    }
    //this.drive(ctx,du);    

    // this.angle += this.moveAngle * Math.PI / 180;
    /*
    if(this.speed > 10){
        this.cx += this.speed * Math.sin(this.rotation)+(Math.PI / 180);
        this.cy -= this.speed * Math.cos(this.rotation);
    }
    else{
        this.cx += this.speed * Math.sin(this.rotation);
        this.cy -= this.speed * Math.cos(this.rotation);
    }
    */
};

var NOMINAL_ROTATE_RATE = 0.1;

Player.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT] && g_carMode && this.speed > 1.5 ) {
     
       this.rotation += this.turnSpeed;
        //this.moveAngle -= NOMINAL_ROTATE_RATE * du;
        this.angularVelocity += this.turnSpeed;
    }
    if (keys[this.KEY_RIGHT] && g_carMode && this.speed > 1.5 ) {
        //this.rotation += NOMINAL_ROTATE_RATE * du;
        //this.moveAngle += NOMINAL_ROTATE_RATE * du;
        this.rotation -= this.turnSpeed;

        this.angularVelocity -= this.turnSpeed;
    }
};


var NOMINAL_THRUST = 0;
var NOMINAL_RETRO;

Player.prototype.computeThrustMag = function () {
    
    if (keys[this.KEY_THRUST] && g_carMode) {
        this.velX += Math.sin(this.angle) * this.power;
        this.velY += Math.cos(this.angle) * this.power;
        this.foreWards = true;
        //console.log(this.speed);
    }
    /*
    else{
        this.velX += Math.sin(this.angle) * this.power;
        this.velY += Math.cos(this.angle) * this.power;
    }
    */

    if (keys[this.KEY_RETRO] && g_carMode) {
        this.velX += Math.sin(this.angle) * -0.5;
        this.velY += Math.cos(this.angle) * -0.5;
        this.foreWards = false;
    }
    
};



Player.prototype.inWorld = function () {
    //console.log(this.sprite.width/2*0.25*g_scale);
    if(this.cx < this.sprite.width/2*0.25*g_scale){

        this.cx = this.sprite.width/2*0.25*g_scale; 
    }
    if(this.cx > g_canvas.width - this.sprite.width/2*0.25*g_scale){
        this.cx = g_canvas.width - this.sprite.width/2*0.25*g_scale; 
    }
    if(this.cy <  this.sprite.width/2*0.25*g_scale){
        this.cy =  this.sprite.width/2*0.25*g_scale;
    }
    if(this.cy > g_canvas.height - this.sprite.width/2*0.25*g_scale){
        this.cy = g_canvas.height - this.sprite.width/2*0.25*g_scale;
    }
};



var x = 0;
var y = 0;

Player.prototype.scale = function(){
    
    var Konst = 0.015;
    if(g_carMode && this.drivingCar === true){
                
        g_offsetX = this.cx-g_canvas.width/2;
        g_offsetY = this.cy-g_canvas.height/2;
        
        if(this.speed > 20){
            g_scale = 1-(20 * Konst);
            g_scaleDiff = (1-g_scale)*1500;
        }
        else{
            g_scale = 1-(this.speed * Konst);
            g_scaleDiff = (1-g_scale)*1500;
        }
    }
};

Player.prototype.steerCar = function(){
    this.prevX = this.cx;
    this.prevY = this.cy;

    
    this.cx += this.velX;
    this.cy += this.velY; 
    
    this.velX *= this.drag;
    this.velY *= this.drag;

    if(this.drivingCar){
        var hitEntity = this.findHitEntity();
        hitEntity = spatialManager.findEntityInRangeCars(this);
        
        if (hitEntity){
            console.log("Its a hit");
            this.velX = 0;
            this.velY = 0;
            this.cx = this.prevX;
            this.cy = this.prevY; 
            hitEntity.angularVelocity = this.angularVelocity *= this.angularDrag;
            hitEntity.velX = this.velX/2;
            hitEntity.velY = this.velY/2;
            hitEntity.velX += Math.sin(this.angle) * this.power;
            hitEntity.velY += Math.cos(this.angle) * this.power;
            if(this.foreWards === false){
                this.velX = 0;
                this.velY = 0;
                this.cx = this.prevX;
                this.cy = this.prevY; 
                hitEntity.angularVelocity = this.angularVelocity *= this.angularDrag;
                hitEntity.velX = this.velX/2;
                hitEntity.velY = this.velY/2;
                hitEntity.velX -= Math.sin(this.angle) * this.power;
                hitEntity.velY -= Math.cos(this.angle) * this.power;

            }
             /*
            console.log("Its a hit");
            hitEntity.velX = this.velX/2;
            hitEntity.velX = this.velY/2;
            this.velX = 0;
            this.velY = 0;
            this.cx = this.prevX;
            this.cy = this.prevY; 
            hitEntity.angularVelocity = this.angularVelocity *= this.angularDrag;
            //hitEntity.velX = this.velX/2;
            //hitEntity.velY = this.velY/2;
           
            hitEntity.velX += Math.sin(this.angle) * this.power;
            hitEntity.velY += Math.cos(this.angle) * this.power;
            */
            }
        }
    


    this.absX = Math.abs(this.velX);
    this.absY = Math.abs(this.velY);

    if(this.drivingCar){

        var k = this.velX;
        var temp = Math.abs(k);
        
        x = this.absX*this.absX;
        y = this.absY*this.absY;

        this.speed = Math.sqrt(x + y);
        //console.log(this.velX,this.velY, this.absX,this.absY , this.speed, x, y);
    }

    this.angle += this.angularVelocity;
    this.angularVelocity *= this.angularDrag;

    if(this.drivingCar){
       // console.log(this.angularVelocity);
    }
};

Player.prototype.skidMarks = function (){

    if(this.angularVelocity >= 0.025 && this.drivingCar === true || (this.angularVelocity >= -0.031 && this.angularVelocity <= -0.025 && this.drivingCar === true )){
        entityManager.genarateSkidmark(this.cx,this.cy);
    }
};


var newX1;
var newX2;
var newY1;
var newY2;

//for collision debugging, draw the box around the car
Player.prototype.carBox = function(ctx){

     if(this.drivingCar){

        var x1 = this.cx;
        var y1 = this.cy;
        newX1 = (x1 * Math.cos(this.rotation)) - (x1 * Math.sin(this.rotation));
        newY1 = (y1 * Math.cos(this.rotation)) + (y1 * Math.sin(this.rotation));


        newX2 = ((x1 + this.sprite.width/2) * Math.cos(this.rotation)) - ((x1 + this.sprite.height/2) * Math.sin(this.rotation));
        newY2 = ((y1 + this.sprite.width/2) * Math.cos(this.rotation)) + ((y1 + this.sprite.height/2) * Math.sin(this.rotation));

        console.log(Math.abs(newX1),Math.abs(newX2),Math.abs(newY1),Math.abs(newY2));
        console.log(this.cx, this.cy);


        newX1 = Math.abs(newX1);
        newX2 = Math.abs(newX2);
        newY1 = Math.abs(newY1);
        newY2 = Math.abs(newY2);
    }
}