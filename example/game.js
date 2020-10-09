
	(function(sadako, game) {
		window.onload = function() {
			sadako.init();
			
			sadako.startGame();

			sadako.enableKeyboard();
		};
	}(window.sadako, window.game = window.game || {}));
