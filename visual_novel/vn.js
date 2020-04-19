
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
		
		game.is_typed = true;
		if (char === "nara") return;
		
		game.name_shown = char;
		
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
		
		sadako.dom("pos" + pos).src = "vn_img/" + game.chars[char].images[img].replace("#", 0);
		if (sadako.hasClass("pos" + pos, "hide")) sadako.fadeIn("pos" + pos);
	}
	
	sadako.doLineTag = function(text, tag) {
		var items = tag.split(":");
		
		if (items[0] === "bg") sadako.dom("bg").src = "vn_img/" + game.bgs[items[1]];
		else if (items[0] in (sadako.list("mion", "rena", "nara"))) game.doCharacter(items);
		
		return text;
	};
	
	
	sadako.displayOutput = function(id) {
		game.complete_line = true;
		
		if (!game.allow_click || !sadako.display_lines.length) return;
		game.allow_click = false;
								
		if (sadako.display_choices.length) {
			sadako.display_lines = sadako.display_lines.concat(sadako.stylizeChoices());
			sadako.display_choices = [];
		}
		
		var a, temp;
		var delay = 0;
		var line = sadako.display_lines.shift();
		
		if (!sadako.has(line.tags, "choice")) game.name_shown = "";
		game.is_typed = false;
		
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
			var html;
			var char = game.chars[game.name_shown];
			if ("color" in char) html = sadako.format("<span style='color:{0}'>{1}</span>", char.color, char.name);

			var name = html || char.name;
			
			sadako.dom("name").innerHTML = name;
			if (sadako.hasClass("name", "hide")) sadako.fadeIn("name");
		}
		
		if (!line.text.length) {
			game.allow_click = true;
			sadako.displayOutput(id);
			return;
		}
		
		if (!sadako.has(line.tags, "choice")) sadako.clear();
		
		game.complete_line = false;
		
		if (game.is_typed) game.typeLine(id, line, delay, 40);
		else {
			game.complete_line = true;
			sadako.displayLine(id, line, delay);
			if (sadako.display_lines.length && sadako.has(sadako.display_lines[0].tags, "choice")) {
				sadako.displayOutput(id);
			}
			game.allow_click = true;
		}
	};
	
	game.typeLine = function(id, line, line_delay, delay) {
		var el = document.createElement('div');
		el.className = line.classes.join(" ");
		
		delay = delay || 0;
		
		if (id) sadako.dom(id).appendChild(el);
		else if (sadako.in_dialog && sadako.dialog_ids.output) sadako.dom(sadako.dialog_ids.output).appendChild(el);
		else sadako.dom(sadako.output_id).appendChild(el);
		
		var index = 0;
		
		var setSpriteFrame = function(index) {
			var img;
			var char = game.name_shown;
			if (game.name_shown.trim().length) {
				img = game.chars[char].images[sadako.var.chars[char].img].replace("#", index);
				sadako.dom("pos" + sadako.var.chars[char].pos).src = "vn_img/" + img;
			}
		}
		
		var is_char = (game.name_shown.trim().length);
		
		var interval;
		
		var speak = function() {
			var setRandomFrame = function() {
				var percent = sadako.random(1, 100);
				if (percent > 60) setSpriteFrame(1);
				else if (percent > 20) setSpriteFrame(2);
				else setSpriteFrame(0);
			}
			
			interval = setInterval(function() {
				setRandomFrame();
			}, 100);
		}
		
		var typeChar = function() {
			var a = line.text.charAt(index);
			
			if (a === "<") a = game.parseMarkup(line.text.substring(index));
			
			index += a.length;
			el.innerHTML += a;
			
			if (game.complete_line) {
				el.innerHTML = line.text;
				index = line.text.length;
			}
			
			if (index === line.text.length) {
				clearInterval(interval);
				game.allow_click = true;
				setSpriteFrame(0);
				if (sadako.display_lines.length && sadako.has(sadako.display_lines[0].tags, "choice")) {
					sadako.displayOutput(id);
				}
				return;
			}
			
			if (a in sadako.list(".", "!")) {
				setSpriteFrame(0);
				clearTimeout(interval);
				setTimeout(function() {
					if (is_char) speak();
					typeChar(el, line); 
				}, delay * 10);
			} else setTimeout(function() { typeChar(el, line); }, delay);
		}
		
		setTimeout(function() {
			if (is_char) speak();
			sadako.removeClass(el, "hide");
			typeChar();
		}, line_delay + delay);
		
		return el;
	}
	
	
	game.parseMarkup = function(text) {
		var openIndex = text.indexOf("<");
		
		if (openIndex === -1) return "";
		
		var firstIndex = openIndex + 1;
		var lastIndex = 0;
		var closeIndex;
		var match = 0;
		var temp = text;
		
		while (openIndex !== -1) {
			openIndex = text.indexOf("<", lastIndex);
			closeIndex = text.indexOf(">", lastIndex);
			lastIndex = openIndex + 1;
			temp = text.substring(openIndex + 1);
			if (sadako.isToken(temp, "br") === false && sadako.isToken(temp, "img") === false) {
				if (temp.charAt(0) === "/") match -= 1;
				else match += 1;
			}
			if (match === 0) break;
			continue;
		}
		
		return text.substring(firstIndex - 1, closeIndex + 1);
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
	
	
	window.onload = function() {
		sadako.init();
		
		game.name_shown = "";
		game.is_typed = false;
		sadako.var.chars = {};
		game.complete_line = false;
		game.allow_click = true;
		game.is_printing = false;
		
		game.bgs = {
			"path": "bg/ie1.png"
		};
		
		game.chars = {
			"mion": {
				"name": "Mion",
				"color": "#47c490",
				"images": {
					"default": "mion/me2_def_a1_#.png",
					"wink": "mion/me2_wink_a1_#.png",
					"surprised": "mion/me2_odoroki_a1_#.png",
					"disappointed": "mion/me2_tohoho_a1_#.png"
				}
			},
			"rena": {
				"name": "Rena",
				"color": "#f19c4e",
				"images": {
					"laugh": "rena/re2a_warai_a1_#.png",
					"sad": "rena/re2b_komaru_b1_#.png"
				}
			}
		};

		sadako.startGame();
	};

}(window.sadako, window.game = window.game || {}));
