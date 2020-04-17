
(function(sadako, game) {
	game.doCharacter = function(items) {
		var pos, img;
		var char = items[0];
		var img_pos = items[1];
		
		if (!sadako.var.chars[char]) sadako.var.chars[char] = {};
		else {
			pos = sadako.var.chars[char].pos;
			img = sadako.var.chars[char].img;
		}
		
		if (img_pos === "hide") {
			sadako.addClass("pos" + pos, "hide");
			return;
		}
		
		var html;
		if ("color" in game.chars[char]) html = sadako.format("<span style='color:{0}'>{1}</span>", game.chars[char].color, game.chars[char].name);
		game.name_shown = html || game.chars[char].name;
		
		if (!img_pos) return;
		
		if (img_pos) {
			var temp = img_pos.split(",");
			img = temp[0];
			sadako.var.chars[char].img = img;
			
			if (temp.length > 1) {
				pos = temp[1];
				sadako.var.chars[char].pos = pos;
			}
		}
		
		sadako.dom("pos" + pos).src = "vn_img/" + game.chars[char].images[img];
		if (sadako.hasClass("pos" + pos, "hide")) sadako.fadeIn("pos" + pos);
	}
	
	
	sadako.doLineTag = function(text, tag) {
		var items = tag.split(":");
		
		if (items[0] === "bg") sadako.dom("bg").src = "vn_img/" + game.bgs[items[1]];
		else if (items[0] in (sadako.list("mion", "rena"))) game.doCharacter(items);
		
		return text;
	};
	
	
	sadako.displayOutput = function(id) {
		if (!sadako.display_lines.length) return;
								
		if (sadako.display_choices.length) {
			sadako.display_lines = sadako.display_lines.concat(sadako.stylizeChoices());
			sadako.display_choices = [];
		}
		
		game.name_shown = "";
		
		var delay = 0;
		var line = sadako.display_lines.shift();
		
		var a, temp;
		for (a = 0; a < line.tags.length; ++a) {
			if ((temp = sadako.isToken(line.tags[a], "delay:"))) {
				delay = parseInt(temp);
				continue;
			}
			
			line.text = sadako.doLineTag(line.text, line.tags[a]);
		}
		
		sadako.add(line.classes, "hide");
		if (!game.name_shown.length) sadako.addClass("name", "hide");
		else {
			sadako.dom("name").innerHTML = game.name_shown;
			if (sadako.hasClass("name", "hide")) sadako.fadeIn("name");
		}
		
		if (!line.text.length) {
			sadako.displayOutput(id);
			return;
		}
		
		if (!sadako.has(line.tags, "choice")) sadako.clear();
		
		sadako.displayLine(id, line, delay);
		
		if (sadako.display_lines.length && sadako.has(sadako.display_lines[0].tags, "choice")) sadako.displayOutput(id);
	};
	
	
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
	
	
	window.onload = function() {
		sadako.init();
		
		game.name_shown = "";
		sadako.var.chars = {};
		
		game.bgs = {
			"path": "bg/ie1.png"
		};
		
		game.chars = {
			"mion": {
				"name": "Mion",
				"color": "#47c490",
				"images": {
					"default": "mion/me2_def_a1_0.png",
					"wink": "mion/me2_wink_a1_2.png",
					"surprised": "mion/me2_odoroki_a1_1.png",
					"disappointed": "mion/me2_tohoho_a1_1.png"
				}
			},
			"rena": {
				"name": "Rena",
				"color": "#f19c4e",
				"images": {
					"laugh": "rena/re2a_warai_a1_1.png",
					"sad": "rena/re2b_komaru_b1_0.png"
				}
			}
		};

		sadako.startGame();
	};

}(window.sadako, window.game = window.game || {}));
