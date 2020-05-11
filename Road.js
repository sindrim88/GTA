"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Road(descr) {
    
    this.setup(descr);
    this.sprite = g_sprites.road1; 
};


// Initial, inheritable, default values
Road.prototype.radius = 2;
Road.prototype.cx = 2;
Road.prototype.cy = 2;
Road.prototype.rotation = 2;

Road.prototype = new Entity()

Road.prototype.update = function (du) {
 
};

Road.prototype.render = function (ctx) {
    //console.log(this.sprite.width);

    this.sprite = g_sprites.grass;
    this.sprite.drawAt(ctx, 0,0);
    this.sprite.drawAt(ctx, 512,0);
    this.sprite.drawAt(ctx, 1024,0);
    this.sprite.drawAt(ctx, 1536,0);
    this.sprite.drawAt(ctx, 2048,0);
    


    this.sprite.drawAt(ctx, 2550,0);
   

    this.sprite = g_sprites.road1; 
    this.sprite.drawAt(ctx, this.cx, this.cy);



    this.sprite.drawAt(ctx,625,50);
    this.sprite.drawAt(ctx, 844,50);
    this.sprite.drawAt(ctx, 1063,50);
    this.sprite.drawAt(ctx, 1282,50);
    
    this.sprite.drawAt(ctx, 1501,50);
    this.sprite.drawAt(ctx, 1720,50);
    this.sprite.drawAt(ctx, 1929,50);
    this.sprite.drawAt(ctx, 2150,50);
    this.sprite.drawAt(ctx, 2371,50);
    this.sprite.drawAt(ctx, 2592,50);

    this.sprite = g_sprites.road2;
    this.sprite.drawAt(ctx, 2813,50);

    this.sprite = g_sprites.road3;
    this.sprite.drawAt(ctx, 2845,270);
    this.sprite.drawAt(ctx, 2845,492);
    this.sprite.drawAt(ctx, 2845,614);
    this.sprite.drawAt(ctx, 2845,836);
    this.sprite.drawAt(ctx, 2845,1058);
    this.sprite.drawAt(ctx, 2845,1280);
    this.sprite.drawAt(ctx, 2845,1502);
    this.sprite.drawAt(ctx, 2845,1724);
    this.sprite.drawAt(ctx, 2845,1946);
    this.sprite.drawAt(ctx, 2845,2168);
    this.sprite.drawAt(ctx, 2845,2390);
    //this.sprite.drawAt(ctx, 2845,2612);



    this.sprite = g_sprites.road4;
    this.sprite.drawAt(ctx, 2811,2612);

    this.sprite = g_sprites.road1; 
    this.sprite.drawAt(ctx,625,2682);
    this.sprite.drawAt(ctx, 844,2682);
    this.sprite.drawAt(ctx, 1063,2682);
    this.sprite.drawAt(ctx, 1282,2682);
    
    this.sprite.drawAt(ctx, 1501,2682);
    this.sprite.drawAt(ctx, 1720,2682);
    this.sprite.drawAt(ctx, 1929,2682);
    this.sprite.drawAt(ctx, 2150,2682);
    this.sprite.drawAt(ctx, 2371,2682);
    this.sprite.drawAt(ctx, 2592,2682);

};
