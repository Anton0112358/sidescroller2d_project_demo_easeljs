"use strict";


var easel_example = (function namespace(){

	var lg = function(message1, message2){ console.log(message1); console.log(message2);}

	var stage, w, h, loader; 

	var some_image, sky;

	var keys = {};

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
			{src: "ground2.png", id: "ground2"} 
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

				
		stage.addChild(some_image, sky); // order of drawing determines "z-index", so sky is now covering some_image, but
		stage.setChildIndex(sky, 0); // you can change order of drawing. sky is now drawn first (index of some_image was shifted)

		//createjs.Ticker.timingMode = createjs.Ticker.RAF; // TODO: what the hell is RAF?
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", tick);

	};


	var keydown = function (event) { // called on each keydown event, keeps track of keys currently pressed
		keys[event.keyCode] = true;
	}

	var keyup = function (event) { // same as keydown, but opposite
		delete keys[event.keyCode];
	}

	var tick = function (event)
	{
		var base_speed = event.delta/1000 * 100; // 10 pixels per second

		var arrowUp = function(){};
		var arrowDown = function(){};
		var arrowLeft = function(){
			if(some_image.x > 15)
			{
				some_image.x -= base_speed * 10;
			}
		};
		var arrowRight = function(){

			if(some_image.x < (3/4) * w) // if didn't reach 3/4 of visible screen
			{
				some_image.x += base_speed * 10; // move
			}else{
				var tile = level_queue[0];
				tile.x -= base_speed * 10; // move screen and generate terrain
			}


			
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

		render_level_queue();
		stage.update(event);	
	};


	return 	{
			setup: setup
			};
			


}());

