// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},


// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

carMode: function (newScale, i,codes){

    var scaleDiff = 0;
    var Konst = 0.015;
    //console.log(this._categories[i],entityManager._players[0].speed);
   
                    
        newScale = 1-(entityManager._players[0].speed * Konst);
        scaleDiff = (1-newScale)*600;

        if(entityManager._players[0].speed >= 11 ){
            newScale = 0.835;
            scaleDiff = ((1-newScale) * 600);
        }
        codes[0] = newScale;
        codes[1] = scaleDiff;
        console.log(codes);
        return codes;
        //console.log(this.newScale,scaleDiff);
                 /*   
        ctx.save();

        //ctx.translate(-entityManager._players[0].offsetX*this.newScale/3,-entityManager._players[0].offsetY*this.newScale/3);
        //Eða: ....
        ctx.translate(-entityManager._players[0].offsetX*newScale+scaleDiff,-entityManager._players[0].offsetY*newScale+scaleDiff);
        ctx.scale(newScale,newScale);
        //entityManager.aCategory[i].render(ctx);
        ctx.restore();
        */
},

walkMode: function(){

},

gameBox : function(){




}
};
