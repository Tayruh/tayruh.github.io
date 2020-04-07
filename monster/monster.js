
(function(sadako, game) {
	
	game.showInventory = function() {
		// Opens the dialog with the inventory settings.
		sadako.showDialog("Inventory", "#inventory");
	};
	
	game.showItem = function(name, page) {
		// Displays the page associated with the item. If an 'inventory'
		// label is inside the page, it'll jump to that instead.
		sadako.dom("#dialog-title").innerHTML = name;
		if ((page + ".inventory") in sadako.labels) sadako.doLink(page + ".inventory");
		else sadako.doLink("#" + page);
	};
	
	game.displayInventory = function() {
		// Writes the inventory out of the page after setting the dialog
		// window title to 'Inventory'.
		sadako.dom("#dialog-title").innerHTML = "Inventory";
		return game.listInventory();
	};
	
	game.listInventory = function() {
		// Makes a bullet list of all items in the 'items' array.
		var a, item;
		var text = "<div id='inventory' class='story-text'><ul>";
		
		for (a = 0; a < sadako.var.items.length; ++a) {
			text += "<li><span class='listed-object'>";
			item = game.items[sadako.var.items[a]];
			text += sadako.processScript(sadako.format('[:& game.showItem("{0}", "{1}") @: {2}:]', item[0], sadako.var.items[a], item[0]));
			text += "</li></span>";
		}
		if (sadako.var.items.length < 1) text = "<span class='inventory-empty'>Empty</span>";
		
		text += "</ul></div>";
		return text;
	};
	
	game.bookmark = function(label) {
		// Saves the page or label to 'bookmark' for future referencing.
		if (label === undefined) label = sadako.token.page_embed + sadako.page;
		else if (label.charAt(0) !== sadako.token.page_embed) {
			if (label.indexOf(".") === -1) label = sadako.page + "." + label;
			if (label.charAt(0) !== sadako.token.label_embed) label = sadako.token.label_embed + label;
		}
		sadako.var.bookmark = label;
	};
	
	game.useBookmark = function() {
		// Jump to the bookark.
		sadako.doLink(sadako.var.bookmark);
	};
	
	game.openSaveMenu = function() {
		// Opens the save/load menu dialog.
		sadako.showDialog("Save / Load", sadako.dom("#save-menu").innerHTML);
	};
	
	game.setRoom = function(title) {
		// Displays the DIV with the room title and a subtitle below it if
		// given. Also sets the bookmark to the current page.
		game.bookmark();
		sadako.var.room = sadako.page;
		if (!title && "room") title = sadako.tags[sadako.page].room;
		game.setTitle(title);
		var text = "";
		text += '<div id="room-title">' + title + '</div>';
		sadako.write(text);
	};
	
	game.setTitle = function(title) {
		sadako.var.title = title;
		sadako.dom("#banner-status").innerHTML = title;
	};
	
	game.clearTitle = function() {
		sadako.var.room = null;
		game.setTitle("");
	};
	
	game.move = function(list_name, item) {
		// Adds an item to a list. If item is already in a list, it'll
		// remove it from that list.
		if (item in sadako.var.has_item && sadako.var.has_item) sadako.remove(sadako.var[sadako.var.has_item[item]], item);
		if (list_name !== null) sadako.add(sadako.var[list_name], item);
		sadako.var.has_item[item] = list_name;
	};
	
	game.listContents = function(list, nothing, write_links) {
		// Not used in this demo, but it will list all items inside an
		// array, and print them sentence-like list with links that lead to
		// the item's page. The value in 'nothing' will be displayed if the
		// list is empty.
		if (!list.length) return nothing;
		var a, item;
		var items = [];
		for (a = 0; a < list.length; ++a) {
			item = game.items[list[a]];
			if (write_links) items.push(item[1] + (item[1].length ? " " : "") + sadako.writeLink(item[2], 'sadako.doLink("#' + list[a] + '")'));
			else items.push(item[1] + (item[1].length ? " " : "") + item[2]); 
		}
		if (items.length === 1) return items[0];
		if (items.length === 2) return items.join(" and ");
		var last = items.pop();
		return items.join(", ") + ", and " + last;
	};
	
	game.listCharDetails = function(char) {
		sadako.doLink(char + ".notebook");
		sadako.overwrite(["<b>" + sadako.var.chars_known[char] + "</b><hr> ~:class:notebook"].concat(sadako.lines), [["Back ~:c:system", 'sadako.doLink("notebook.characters")']]);
	};
	
	game.listCharacters = function() {
		var chars = sadako.var.chars_known; 
		
		if (sadako.isEmpty(chars)) return "<span class='inventory-empty'>No information yet</span>";
		
		var a;
		var text = "";
		for (a in chars) {
			text += sadako.format("<li>[:& game.listCharDetails('{0}') @: {1}:]</li>", a, chars[a]);
		}
		return "<ul>" + sadako.processScript(text) + "</ul>";
	};
	
	game.setCharInfo = function(char, name) {
		sadako.var.chars_known[char] = name;
	};
	
	game.listTaskDetails = function(task) {
		var items = sadako.var.active_tasks[task];
		var tasks = game.tasks[task];
		
		var text = "";
		
		var a;
		for (a in items) {
			if (items[a] === "hidden") continue;
			if (items[a] === "complete") text += '<li><span class="completed">' + tasks.tasks[a] + '</span></li>';
			else text += "<li>" + tasks.tasks[a] + "</li>";
		}
		
		var lines = [
			"<b>" + tasks.name + "</b><hr> ~:class:notebook", 
			"<ol>" + text + "</ol> ~:class:notebook"
		];
		
		sadako.overwrite(lines, [["Back ~:c:system", 'sadako.doLink("notebook.tasks")']]);
	};
	
	game.listTasks = function() {
		var tasks = sadako.var.active_tasks;
		
		if (sadako.isEmpty(tasks)) return "<span class='inventory-empty'>No active tasks</span>";
		
		var text = "";
		
		var a, task, line;
		for (a in tasks) {
			task = game.tasks[a];
			if (game.isCompleted(a)) line = "<span class='completed'>" + task.name + "</span>";
			else line = sadako.format('[:& game.listTaskDetails("{0}") @: {1}:]', a, task.name);
			text += '<li>' + sadako.processScript(line) + "</li>";
		}
		
		return "<ol>" + text + "</ol>";
	};
	
	game.addTask = function(task, completed) {
		var parts = task.split(".");
		
		if (!(parts[0] in game.tasks) || !(parts[1] in game.tasks[parts[0]].tasks)) {
			console.log("Error: '" + task + "' is not a valid task.");
			return;
		}
		
		if (!(parts[0] in sadako.var.active_tasks)) sadako.var.active_tasks[parts[0]] = {};
		sadako.var.active_tasks[parts[0]][parts[1]] = (completed === undefined) ? "active" : "complete";
	};
	
	game.endTask = function(task) { game.addTask(task, "complete"); };
	
	game.removeTask = function(task) {
		var parts = task.split(".");
		if (!(parts[0] in sadako.var.active_tasks)) return;
		sadako.var.active_tasks[parts[0]][parts[1]] = "hidden";
	};
	
	game.completeTask = function(task) {
		game.addTask(task, "active");
	};
	
	game.getTaskState = function(task) {
		// true: active, false: completed, null: undefined
		
		var parts = task.split(".");
		if (!(parts[0] in sadako.var.active_tasks)) return null;
		if (!(parts[1] in sadako.var.active_tasks[parts[0]])) return null;
		return sadako.var.active_tasks[parts[0]][parts[1]]; 
	};
	
	game.isActive = function(task) {
		if (game.getTaskState(task) === "active") return true;
		return false;
	};
	
	game.isCompleted = function(task) {
		if (task.indexOf(".") === -1) {
			var a;
			if (!(task in sadako.var.active_tasks)) return false;
			for (a in game.tasks[task].tasks) {
				if (!(a in sadako.var.active_tasks[task]) || sadako.var.active_tasks[task][a] === "active") return false;
			}
			return true;
		}
		if (game.getTaskState(task) === "complete") return true;
		return false;
	};

	window.onload = function() {
		// Initializes Sadako.
		sadako.init();
		
		game.debug = false;
		
		// Add items array to saved variables to be used with inventory.
		sadako.var.items = [];
		
		// Not used in the demo, but 'has_item' tracks which array an item
		// is currently in.
		sadako.var.has_item = {};
		
		// Define items for the game.
		game.items = {};
		game.items.notebook = ["Notebook", "the", "notebook"];
		game.items.master_keys = ["Master Keys", "the", "master keys"];
		
		sadako.var.chars_known = {};
		
		sadako.var.active_tasks = {};
		sadako.var.completed_tasks = [];
		
		game.tasks = {
			"main_1": {
				name: "The story begins..",
				tasks: {
					"find_vanessa": "Vanessa can help you. You should find her."
				}
			},
			"main_2": {
				name: "Greet the tenants",
				tasks: {
					"find_tenants": "You should find the other tenants.",
					"find_finola": "You should find Finola.",
					"find_seoyun": "You should find Seoyun.",
					"find_sera": "You should find Sera.",
					"find_daemon": "You should find Daemon."
				}
			},
			"main_3": {
				name: "Moving in",
				tasks: {
					"unpack": "You should unpack your luggage in your rooms upstairs."
				}
			}
		};
		
		//sadako.addScene("erin_following", '%.office.foyer_cont');
		
		// Declares the macros. This can be used with the (: :) tag.
		sadako.macros.move = game.move;
		sadako.macros.setRoom = game.setRoom;
		sadako.macros.setTitle = game.setTitle;
		sadako.macros.clearTitle = game.clearTitle;
		sadako.macros.bookmark = game.bookmark;
		sadako.macros.useBookmark = game.useBookmark;
		sadako.macros.closeDialog = function() { sadako.closeDialog(true); };
		sadako.macros.addTask = game.addTask;
		sadako.macros.removeTask = game.removeTask;
		sadako.macros.setCharInfo = game.setCharInfo;
		sadako.macros.endTask = game.endTask;
		
		sadako.scripts.finola_name = function() {
			var link = "%finola.intro";
			if (sadako.label_seen["finola.intro_talk"]) return sadako.writeLink("Finola", link);
			else return "a " + sadako.writeLink(((sadako.label_seen["finola.intro"]) ? "miniature girl" : "small creature"), link) + " with butterfly wings";
		};
		
		// You can set how many rewinds you want to allow. Set 0 for none.
		// sadako.history_limit = 1;
		
		// You can enable autosave and autoload.
		sadako.autosave_enabled = true;
		
		// You can adjust the text delay speed.
		// sadako.text_delay = 0;
		
		// Sadako has a 'before' and 'after' objects that contain functions
		// to be called before and after each page is displayed. It looks
		// for a member named the same as the page (for example
		// 'sadako.before.living_room'). 'ALL' is run for all pages.
		
		sadako.before.ALL = function() {
			if (sadako.isPageTop() && "room" in sadako.tags[sadako.page]) {
				if ((sadako.var.room != sadako.page) && sadako.var.erin_following) sadako.write("Erin follows you.");
				game.setRoom();
			}
			else sadako.dom("#banner-status").innerHTML = sadako.var.title;
		};
		
		sadako.after.ALL = function() {
			// sadako.tags is the object contains the tags defined for each
			// page. Percent check is a utility function that returns true a
			// percentage of the time (the following returns true 20% of the
			// time).
			if (sadako.isPageTop() && ("room" in sadako.tags[sadako.page]) && sadako.var.erin_following) {
				// sadako.write() is how you add new lines to the output.
				// You can either pass a single line, or an array of lines
				// and they will all be added.
				sadako.write("[: %erin.following @: Erin:] is standing here beside you.");
			}
		};
		
		// Sets up the dialog window by passing it the HTML element IDs.
		// First param is the text output, second is the title of the window
		// (if it has one), and third is an array of all items to show/hide
		// when showDialog() and closeDialog() are called.
		sadako.setupDialog("#dialog-output", "#dialog-title", ["#dialog", "#overlay"]);
		
		game.clearTitle();
		
		// Begin the game starting with the 'init' page.
		sadako.startGame();
	};

}(window.sadako, window.game = window.game || {}));
