
(function(sadako, game) {
	window.onload = function() {
		// Initializes Sadako.
		sadako.init();
		
		sadako.var.mion_pos = 1;
			
		game.images = {
			"bg_path": "bg/ie1.png",
			"mion_default": "mion/me2_def_a1_0.png",
			"mion_wink": "mion/me2_wink_a1_2.png",
			"mion_surprised": "mion/me2_odoroki_a1_1.png",
			"mion_disappointed": "mion/me2_tohoho_a1_1.png",
			"rena_laugh": "rena/re2a_warai_a1_1.png",
			"rena_sad": "rena/re2b_komaru_b1_0.png"
		};
		
		game.colors = {
			"mion": "#47c490",
			"rena": "#f19c4e"
		}
		
		game.name_shown = false;
		
		game.doCharacter = function(char, name, img_pos) {
			var pos = sadako.var[char + "_pos"];
			var img = sadako.var[char + "_img"];
			
			if (img_pos === "hide") {
				sadako.addClass("pos" + pos, "hide");
				return;
			}
			
			var html;
			if (char in game.colors) html = sadako.format("<span style='color:{0}'>{1}</span>", game.colors[char], name);
			sadako.dom("name").innerHTML = html || name;
			
			game.name_shown = true;
			
			if (!img_pos) return;
			
			if (img_pos) {
				var temp = img_pos.split(",");
				img = temp[0];
				sadako.var[char + "_img"] = img;
				
				if (temp.length > 1) {
					pos = temp[1];
					sadako.var[char + "_pos"] = pos;
				}
			}
			
			sadako.dom("pos" + pos).src = "vn_img/" + game.images[char + "_" + img];
			if (sadako.hasClass("pos" + pos, "hide")) sadako.fadeIn("pos" + pos);
		}
		
		sadako.doLineTag = function(text, tag) {
			var items = tag.split(":");
			
			if (items[0] === "bg") sadako.dom("bg").src = "vn_img/" + game.images["bg_" + items[1]];
			else if (items[0] === "mion") game.doCharacter("mion", "Mion", items[1]);
			else if (items[0] === "rena") game.doCharacter("rena", "Rena", items[1]);
			
			return text;
		}
		
		sadako.displayText = function(id) {
			var displayLine = function() {								
				if (!sadako.display_lines.length) return;
				
				var line = sadako.display_lines.shift();
				
				var delay = 0;
				
				
				game.name_shown = false;
				
				var a, temp;
				for (a = 0; a < line.tags.length; ++a) {
					if ((temp = sadako.isToken(line.tags[a], "delay:"))) {
						delay = parseInt(temp);
						continue;
					}
					
					line.text = sadako.doLineTag(line.text, line.tags[a]);
				}
				
				line.classes.push("hide");
				if (!game.name_shown) sadako.addClass("name", "hide");
				else if (sadako.hasClass("name", "hide")) sadako.fadeIn("name");
				
				if (!line.text.length) {
					displayLine();
					return;
				}
				
				if (!sadako.has(line.tags, "choice")) sadako.clear();
				
				var el = document.createElement('div');
				el.className = line.classes.join(" ");
				el.innerHTML = line.text;
				
				if (id) sadako.dom(id).appendChild(el);
				else if (sadako.in_dialog && sadako.dialog_ids.output) sadako.dom(sadako.dialog_ids.output).appendChild(el);
				else sadako.dom(sadako.output_id).appendChild(el);
				
				// Fade in paragraph after a short delay
				setTimeout(function() {
					el.className = sadako.remove(el.className.split(" "), "hide").join(" ");
				}, delay + sadako.text_delay);
				
				if (sadako.display_lines.length && sadako.has(sadako.display_lines[0].tags, "choice")) displayLine();
			}
			
			return function() {
				if (sadako.display_choices.length) {
					sadako.display_lines = sadako.display_lines.concat(sadako.stylizeChoices());
					sadako.display_choices = [];
				}
				
				displayLine()
			}();
		}
		
		sadako.stylizeChoices = function() {
			var text = "";
			
			var a, b, choice;
			for (a = 0; a < sadako.display_choices.length; ++a) {
				choice = sadako.display_choices[a];
				for (b = 0; b < choice.tags.length; ++b) {
					choice.text = sadako.doChoiceTag(choice.text, choice.tags[b]);
				}
				text += sadako.format("<li><span class='{0}'>{1}</span></li>", choice.classes.join(" "), choice.text);
			}
			text = "<ul>" + text + "</ul>";
			return {"text": text, "classes": ["choice"], "tags": ["choice"]};
		};

		sadako.startGame();
	};

}(window.sadako, window.game = window.game || {}));
