
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
		else if (sadako.isToken(label, sadako.token.page_embed) === false) {
			if (label.indexOf(".") === -1) label = sadako.page + "." + label;
			if (sadako.isToken(label, sadako.token.label_embed) === false) label = sadako.token.label_embed + label;
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
		game.setTitle(title);
		sadako.write('<div id="room-title">' + title + '</div>');
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

	window.onbeforeunload = function () {
		sadako.clear();
		sadako.scrollToTop();
	}

	window.onload = function() {
		sadako.init();
		
		game.debug = false;
		sadako.autosave_enabled = true;

		sadako.var.items = [];
		sadako.var.has_item = {};
		sadako.var.inventory = {};
		game.items = {};

		sadako.macros.move = game.move;
		sadako.macros.bookmark = game.bookmark;

		game.items.cloak = ["Cloak", "the", "cloak"];

		sadako.doPageTagAction = function(tag, value) {
			if (tag === "room" && sadako.isPageTop()) game.setRoom(value);
			else sadako.dom("#banner-status").innerHTML = sadako.var.title;
		}

		sadako.setupDialog("#dialog-output", "#dialog-title", ["#dialog", "#dialog-overlay"]);
			
		game.clearTitle();
		
		sadako.startGame();
	};

}(window.sadako, window.game = window.game || {}));
