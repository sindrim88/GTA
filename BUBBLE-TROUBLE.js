
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// INITIALIZE GAME
function init() {

    var ground_y = 500;
    var cx = 300;
    var cy = 300;
    // Returns y coordinate of the edge of the ground, its needed to place the player
    // on top of the ground edge
    var ground_edge = entityManager.generateGround(ground_y, 5);
}

// GATHER INPUTS

function gatherInputs() {
    if (eatKey(KEY_WALKCAR)){
        g_carMode = !g_carMode;
        g_walkMode = !g_walkMode;
        
        if(g_carMode){
            g_prevSpeed = 1;
        }
        else{
            g_prevSpeed = 2;
        }
    }
}

// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;


var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');
var KEY_SPATIAL = keyCode('X');
var KEY_WALKCAR = keyCode('M');



function processDiagnostics() {

    if (eatKey(KEY_HALT)) entityManager.haltBubbles();

    if (eatKey(KEY_RESET)) entityManager.resetBubbles();

    if(eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    entityManager.render(ctx);
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// PRELOAD

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2  : "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        rock   : "https://notendur.hi.is/~pk/308G/images/rock.png",
        
        //first car that I worked on, called that player initially. 
        player : "img/Challenger-GTA1.png",
        // character walking
        walk   : "img/walktest.png",

        //car sprites
        car1 : "img/F-19-GTA1.png",
        car2 : "img/Taxi-GTA1.png",
        car3 : "img/SquadCar-GTA1.png",
        car4 : "img/Impaler.png",
        car5 : "img/Penetrator.png",
        car6 : "img/Counthash.png",
        car7 : "img/Tank.png",
        car8 : "img/Flamer-GTA1.png",


        road : "img/road.png",
        road1 : "img/road1.png",
        road2 : "img/road2.png",
        road3 : "img/road3.png",
        road4 : "img/road4.png",
        grass : "img/grass.png",
        run   : "img/runner.png"
    };
    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};
var g_sprite_cycles;
var g_sprite_setup;


function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.player  = new Sprite(g_images.player);

    g_sprites.walk  = new Sprite(g_images.walk);

    //cars
    g_sprites.car1 = new Sprite(g_images.car1);
    g_sprites.car2 = new Sprite(g_images.car2);
    g_sprites.car3 = new Sprite(g_images.car3);

    g_sprites.car4 = new Sprite(g_images.car4);
    g_sprites.car5 = new Sprite(g_images.car5);
    g_sprites.car6 = new Sprite(g_images.car6);
    g_sprites.car7 = new Sprite(g_images.car7);
    g_sprites.car8 = new Sprite(g_images.car8);

    //gras
    g_sprites.grass = new Sprite(g_images.grass);


    //vega beinn sprite
    g_sprites.road = new Sprite(g_images.road);
    g_sprites.road1 = new Sprite(g_images.road1);


    //vega beyja
    g_sprites.road2 = new Sprite(g_images.road2);

    //Vegur beint niður/upp
    g_sprites.road3 = new Sprite(g_images.road3);
    g_sprites.road4 = new Sprite(g_images.road4);


    g_sprites.bullet = new Sprite(g_images.ship);

    // minka bíla
    g_sprites.player.scale = 0.25;
    g_sprites.car1.scale = 0.25;
    g_sprites.car2.scale = 0.25;
    g_sprites.car3.scale = 0.25;
    g_sprites.car4.scale = 0.25;
    g_sprites.car5.scale = 0.25;
    g_sprites.car6.scale = 0.25;
    g_sprites.car7.scale = 0.25;
    g_sprites.car8.scale = 0.25;



    //Player Animations
    g_sprite_cycles = [ [], [] ];
    var sprite, celWidth, celHeight, numCols, numRows, numCels, image, offsetX, offsetY;

    g_sprite_setup = [];

    g_sprite_setup[0] = {
            celWidth : 150,
            celHeight : 150,
            numCols : 6,
            numRows : 1,
            numCels : 6,
            spriteSheet : g_images.run
        };

     g_sprite_setup[1] = {
            celWidth : 150,
            celHeight : 150,
            numCols : 6,
            numRows : 1,
            numCels : 6,
            spriteSheet : g_images.run
        };


  for(var i = 0; i < g_sprite_setup.length; i++) {

        celWidth  = g_sprite_setup[i].celWidth;
        celHeight = g_sprite_setup[i].celHeight;
         numCols = g_sprite_setup[i].numCols;
         numRows = g_sprite_setup[i].numRows;
         numCels = g_sprite_setup[i].numCels;
         image = g_sprite_setup[i].spriteSheet;
         offsetX = g_sprite_setup[i].offsetX;
         offsetY = g_sprite_setup[i].offsetY;

        for (var row = 0; row < numRows; ++row) {

            for (var col = 0; col < numCols; ++col) {

                sprite = new Sprite(image, col * celWidth, row * celHeight,
                                    celWidth, celHeight, offsetX, offsetY);
                g_sprite_cycles[i].push(sprite);
                g_sprite_cycles[i].splice(numCels);
            }
        }
    }


    //entityManager.init();
   
    //búa til bíla
    entityManager.generatePlayer(100,100,2);
    entityManager.generatePlayer(200,200,3);
    entityManager.generatePlayer(300,300,1.2);
    entityManager.generatePlayer(400,400,3);

    entityManager.generatePlayer(2950,2500,2);
    entityManager.generatePlayer(2950,2600,2);
    entityManager.generatePlayer(2950,400,2);
    entityManager.generatePlayer(2950,1000,0.5);
    entityManager.generatePlayer(2950,700,2);


    // búa til fólk sem hleypur i random attir
    for (var i = 0; i <20; i++) {
        entityManager.genaratePedestrian(500+(50*i),70, i);
    }


    // spawn-a ýmsa bíla
    entityManager._players[0].sprite  = g_sprites.player;
    entityManager._players[1].sprite  = g_sprites.car1;
    entityManager._players[2].sprite  = g_sprites.car2;
    entityManager._players[3].sprite  = g_sprites.car3;
    entityManager._players[4].sprite  = g_sprites.car4;
    entityManager._players[5].sprite  = g_sprites.car5;
    entityManager._players[6].sprite  = g_sprites.car6;
    entityManager._players[7].sprite  = g_sprites.car7;
    entityManager._players[8].sprite  = g_sprites.car8;

    entityManager.genarateRoad(405,50);
 
    entityManager.genarateWalk(25,25,1.5);
};

// These 3 lines would in the future be erased, no sprite preloading done here
//entityManager.init();
//init();
main.init();

requestPreloads();