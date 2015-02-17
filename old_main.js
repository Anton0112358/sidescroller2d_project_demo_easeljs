"use strict";


var easel_example = (function namespace(){

	var lg = function(message1, message2){ console.log(message1); console.log(message2);}

	var stage, w, h, loader; 

	var some_image, sky, cactus_spritesheet, warrior_cactus, sun;

	var keys = {};

	var marker = true;

	var level_queue = []; // to keep track of randomly generated tiles
	// will use level_queue.push() and level_queue.shift(); to simulate the queue

	
	var setup_events = function ()
	{
		document.onkeydown = keydown;
		document.onkeyup = keyup;
	};

	var set_canvas_size = function () // now used only for setting up stage size.  could be extended
	{
		stage.canvas.width =  $(document).width() - 20;
		stage.canvas.height = 400;

	}

	var render_level_queue = function ()
	{
		var get_cached = function () { return new createjs.Bitmap(loader.getResult(Math.random() < 0.5 ? "ground1" : "ground2"))}
		var slice_index = 0; // used to remove tiles no longer attached to stage from the level_queue

		for(var i = 0; i < level_queue.length; i++)
		{
			var tile = level_queue[i];
			if(tile.x < -100) // if totally offscreen // TODO: set default x to be offscreen intelegently with image width etc
			{
				stage.removeChild(tile); 
				slice_index += 1;
			}
		}

		level_queue = level_queue.slice(slice_index);// remove elements that are no longer on stage

		while (level_queue.length < 40)
		{
			var tile = get_cached();
			level_queue.push(tile);
			stage.addChild(tile);

			// set tile registration point (what you assign coordinates to); set it to the bottom left corner;
				tile.regX = 0;
				tile.regY = tile.image.height;

			tile.y = h; // ground begins at the bottom of the screen;
}

		var next_x = level_queue[0].x;
		for(var i = 0; i < level_queue.length; i++)
		{
			var tile = level_queue[i]; 
			var img_width = tile.image.width;
			tile.x = next_x;

			next_x += img_width; 

		}

		

	}
	
	var setup = function ()// sets up everything
	{ 


		stage = new createjs.Stage("display_canvas"); // main canvas, everything happens there

		set_canvas_size();

		w = stage.canvas.scrollWidth; // canvas width and height for future calculations // scrollWidth gives actual size, while simply width gives something very different
		h = stage.canvas.scrollHeight; //

		var manifest = 	[ // defining resources to be loaded in bulk with preload.js
			{src: "square.jpg", id: "square"},
			{src: "sky.png", id: "sky"}, 
			{src: "ground1.png", id: "ground1"},
			{src: "ground2.png", id: "ground2"},
			{src: "warrior_cactus_spritesheet.png", id: "warrior_cactus"}
			//{src: "spritesheet_grant.png", id: "grant"},
			//{src: "sky.png", id: "sky"},
			//{src: "ground.png", id: "ground"},
			//{src: "hill1.png", id: "hill"},
			//{src: "hill2.png", id: "hill2"}
		];

		loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest, true, "./assets/art/");

				
				
		setup_events();
	};

	var handleComplete = function ()
	{
		sky = new createjs.Shape();
		sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
		//sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRectangle(0, 0, w, h);

		some_image = new createjs.Bitmap(loader.getResult("square")); // some sprite

		some_image.scaleX = 50 / some_image.image.width; // desired width/ actual width

		some_image.regX = 0;
		some_image.regY = some_image.image.height;
		some_image.x = 400; // set position
		some_image.y = 300;

		sun = new createjs.Shape();
		sun.graphics.beginFill("orange").drawRect(0, 0, 50, 50);
		sun.x = w;
		sun.y = 50;





		cactus_spritesheet = new createjs.SpriteSheet({
			"framerate": 2, 
			"images": [loader.getResult("warrior_cactus")],
			"frames": {"regX": 0, "regY": 75, "height": 75, "width": 60, "count": 4},
			"animations": {
				"run_right": [0, 1, "run_right"], // you can pass the 3rd parameter to indicate animation that will be automatically played immediately after
				"run_left": [2, 3, "run_left"]
				}

			});

		warrior_cactus = new createjs.Sprite(cactus_spritesheet, "run_right");

		warrior_cactus.x = 400; // set position
		warrior_cactus.y = 300;

				
		stage.addChild(warrior_cactus, sky, sun); // order of drawing determines "z-index", so sky is now covering warrior_cactus, but
		stage.setChildIndex(sky, 0); // you can change order of drawing. sky is now drawn first (index of warrior_cactus was shifted)
		stage.setChildIndex(sun, 1);

		//createjs.Ticker.timingMode = createjs.Ticker.RAF; // TODO: what the hell is RAF?
		createjs.Ticker.setFPS(20);
		createjs.Ticker.addEventListener("tick", tick);

	};


	var keydown = function (event) { // called on each keydown event, keeps track of keys currently pressed
		keys[event.keyCode] = true;
	}

	var keyup = function (event) { // same as keydown, but opposite
		delete keys[event.keyCode];
	}

	var vertical_velocity = 0;
	var delta_s = 0;
	var movement_modifier = 1;

	var tick = function (event)
	{
		marker = !(marker); // quick and dirty way to determine next frame to play

		var base_speed = event.delta/1000 * 50 * movement_modifier; // 50 pixels per second


		var arrowUp = function(){
			if(warrior_cactus.y == 300) // if touching ground - jump
			{
				vertical_velocity = 700;
				movement_modifier = 0.3
			}

		};
		var arrowDown = function(){};
		var arrowLeft = function(){
			if(warrior_cactus.x > 15)
			{
				warrior_cactus.x -= base_speed * 10;
				warrior_cactus.gotoAndStop(marker ? 2 : 3);
			}
		};
		var arrowRight = function(){

			if(warrior_cactus.x < (5/8) * w) // if didn't reach 3/4 of visible screen
			{
				warrior_cactus.x += base_speed * 10; // move
				
			}else{
				var tile = level_queue[0];
				tile.x -= base_speed * 10; // move screen and generate terrain

				sun.x -= base_speed * 2;
				if(sun.x < -100)
					sun.x = w + 100;
			}

			warrior_cactus.gotoAndStop(marker ? 0 : 1);
			
			//for(var i = 0; i < level_queue.length; i++)
			//{
				//var tile = level_queue[i];
				//tile.x = tile.x + base_speed;

			//}
		};

		if (keys[37]) arrowLeft();
		if (keys[38]) arrowUp();
		if (keys[39]) arrowRight();
		if (keys[40]) arrowDown();

		vertical_velocity -=  event.delta/1000 * 700; //Math.pow(((-1/5)* warrior_cactus.y + 40), 2);  

		delta_s = vertical_velocity * event.delta/1000;



		if ((warrior_cactus.y - delta_s) <= 300)
			warrior_cactus.y -= delta_s; 
		else
			warrior_cactus.y = 300;

		if(warrior_cactus.y == 300)
			movement_modifier = 1;

		render_level_queue();
		stage.update(event);	
	};


	return 	{
			setup: setup
			};
			


}());

