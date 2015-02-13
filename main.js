
var sidescroller_game = (function namespace(){


	// Models section: >>>
	
	var GameViewModel;

	var PlayerModel;

	var EnemyModel;


	// END Models section <<<

	// Controllers section: >>>
	
	var GameController;

	var PlayerController;

	var EnemyController;

	var KeyboardController;

	// END Controllers section <<<
	

	// Game initiation section: >>>
	
	var load_game = function()
	{
		// Setting up events:
		//
			// ticker: on each tick call GameController.update_all();
		//
			// keyboard input event: on each keyboard event call KeyboardController.handle_keypress();
		//
			// on interrupt event: stop ticker

		// Setting up other stuff:
			// e.g setup canvas size
	};
	
	return 
	{

		run: function(){
			load_game();
		};
	}

})(); 
