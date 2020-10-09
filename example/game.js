
	(function(sadako, game) {
		window.onload = function() {
			sadako.init();
			
			// sadako.setupDialog("#dialog-output", "#dialog-title", ["#dialog", "#dialog-overlay"]);
			
			// sadako.dom("#banner-status").innerHTML = "Sadako Testing Ground";
			
			sadako.startGame();
		};
	}(window.sadako, window.game = window.game || {}));
