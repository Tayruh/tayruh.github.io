sadako.story = {"go":{"0":[{"t":"return","k":"=","l":"go.return"},{"t":"[Back]","k":"\\+","l":"go.go_return"},{"t":"back","k":"=","l":"go.back"},{"t":"[Back]","k":"\\+","l":"go.go_back"},{"t":"inventory","k":"=","l":"go.inventory"},{"t":"[Back]","k":"\\+","l":"go.go_inv"}],"labels":{"return":["go","0",0],"go_return":["go","0",1],"back":["go","0",2],"go_back":["go","0",3],"inventory":["go","0",4],"go_inv":["go","0",5]},"0.1":[{"t":">> #$:room"}],"0.3":[{"t":">> $:bookmark"}],"0.5":[{"t":">> #inventory"}],"tags":{}},"start":{"0":[{"t":"[:&\n$.message = 0;\n$.cloak_worn = true;\n&.add($.items, \"cloak\");\n:]"},{"t":"Hurrying through the rainswept November night, you're glad to see the bright lights of the Opera House. It's surprising that there aren't more people about but, hey, what do you expect in a cheap demo game..."},{"t":"<i>This demo is based on <a class=\"link\" target=\"_blank\" href=\"http://www.firthworks.com/roger/cloak/\">Cloak of Darkness</a> by Roger Firth.</i>"},{"t":"[Start]","k":"\\+","l":"start.a"}],"labels":{"a":["start","0",3]},"0.3":[{"t":">> #foyer"}],"tags":{}},"inventory":{"0":[{"t":"[:= game.listInventory():]"}],"tags":{}},"foyer":{"0":[{"t":"[:& _.foyer = (&.has($.items, \"cloak\")) ? \"darkness\" : \"foyer_bar\":]"},{"t":"You are standing in a spacious hall, splendidly decorated in red and gold, with glittering chandeliers overhead. The entrance from the street is to the [:% north:], and there are doorways [:#= _.foyer @: south:] and [:cloakroom @: west:]."},{"t":"[Entrance]","k":"\\+","l":"foyer.ent","c":"%.foyer.north"},{"t":"[Foyer Bar]","k":"\\+","l":"foyer.bar","c":"#.foyer_bar"},{"t":"[Cloakroom]","k":"\\+","l":"foyer.clk","c":"#.cloakroom"},{"t":"<< end","k":"\\-"},{"t":"north","k":"=","l":"foyer.north"},{"t":"You've only just arrived, and besides, the weather outside seems to be getting worse."},{"t":">>= go.return","k":"\\+"}],"labels":{"ent":["foyer","0",2],"bar":["foyer","0",3],"clk":["foyer","0",4],"north":["foyer","0",6]},"0.2":[{"t":">> north"}],"0.3":[{"t":">># _:foyer"}],"0.4":[{"t":">> #cloakroom"}],"tags":{"room":"Foyer"}},"cloakroom":{"0":[{"t":"The walls of this small room were clearly once lined with [:% hooks:], though now only one remains. The exit is a door to the [:foyer @: east:]."},{"t":"[:& $.hooks = false:]"},{"t":"[Foyer]","k":"\\+","l":"cloakroom.fyr"},{"t":"hooks","k":"=","l":"cloakroom.hooks"},{"t":"(:bookmark \"cloakroom.hooks\":)"},{"t":"[:& $.hooks = true:]"},{"t":"It's just a small brass hook, <>"},{"t":"{:&.has($.items, \"cloak\")::screwed to the wall.::with a [:% cloak.take @: cloak:] hanging on it.:}"},{"t":">>= go.return","k":"\\+"}],"labels":{"fyr":["cloakroom","0",2],"hooks":["cloakroom","0",3]},"0.2":[{"t":">> #foyer"}],"tags":{"room":"Cloakroom"}},"cloak":{"0":[{"t":">> examine"},{"t":"<< end"},{"t":"desc","k":"=","l":"cloak.desc"},{"t":"A handsome cloak, of velvet trimmed with satin, and slightly spattered with raindrops. Its blackness is so deep that it almost seems to suck light from the room."},{"t":"<<"},{"t":"examine","k":"=","l":"cloak.examine"},{"t":">> desc"},{"t":"[Wear]","k":"\\+","c":"!$.cloak_worn"},{"t":"[Remove]","k":"\\+","c":"$.cloak_worn"},{"t":"[Hang]","k":"\\+","c":"$.room === \"cloakroom\""},{"t":"[Drop]","k":"\\+","c":"$.room !== \"cloakroom\""},{"t":"","k":"\\-"},{"t":">>= go.inventory","k":"\\+"},{"t":"take","k":"=","l":"cloak.take"},{"t":">> desc"},{"t":"[Take Cloak]","k":"\\+","c":"!&.has($.items, \"cloak\")"},{"t":">>= go.back","k":"\\+"}],"labels":{"desc":["cloak","0",2],"examine":["cloak","0",5],"take":["cloak","0",13]},"0.7":[{"t":"You put on the cloak."},{"t":"[:& $.cloak_worn = true:]"}],"0.8":[{"t":"You remove the cloak."},{"t":"[:& $.cloak_worn = false:]"}],"0.9":[{"t":"You put the velvet cloak on the small brass hook."},{"t":"[:&\n$.cloak_worn = false;\n&.remove($.items, \"cloak\");\n&.onDialogClose = function() { if ($.hooks) &.doLink('cloakroom.hooks'); }\n:]"},{"t":"[Back]","k":"\\+"}],"0.9.2":[{"t":"[:*!:]"},{"t":">> $:bookmark"}],"0.10":[{"t":"This isn't the best place to leave a smart cloak lying around."}],"0.15":[{"t":"[:& &.add($.items, \"cloak\"):]"},{"t":"You remove the cloak from the hook."},{"t":">>= go.back","k":"\\+"}],"tags":{}},"darkness":{"0":[{"t":"It is pitch dark, and you can't see a thing."},{"t":"[North]","k":"\\+","l":"darkness.n"},{"t":"[South]","k":"\\+","l":"darkness.s"},{"t":"[East]","k":"\\+","l":"darkness.e"},{"t":"[West]","k":"\\+","l":"darkness.w"},{"t":"","k":"\\-"},{"t":"In the dark? You could easily disturb something!","c":"$.message === 0"},{"t":"Blundering around in the dark isn't a good idea!","c":"$.message >= 1"},{"t":"[:& $.message += 1:]"},{"t":">>= go.return","k":"\\+"}],"labels":{"n":["darkness","0",1],"s":["darkness","0",2],"e":["darkness","0",3],"w":["darkness","0",4]},"0.1":[{"t":">> #foyer"}],"tags":{"room":"Darkness"}},"foyer_bar":{"0":[{"t":"The bar, much rougher than you'd have guessed after the opulence of the foyer to the [:foyer @: north:], is completely empty. There seems to be some sort of [:% message:] scrawled in the sawdust on the floor."},{"t":"[Foyer]","k":"\\+","l":"foyer_bar.fyr"},{"t":"message","k":"=","l":"foyer_bar.message"},{"t":"if ($.message < 2)","k":"~"},{"t":"else ","k":"~"}],"labels":{"fyr":["foyer_bar","0",1],"message":["foyer_bar","0",2]},"0.1":[{"t":">> #foyer"}],"0.3":[{"t":"The message, neatly marked in the sawdust, reads..."},{"t":"*** You Won! ***"}],"0.4":[{"t":"The message has been carelessly trampled, making it difficult to read. You can just distinguish the words..."},{"t":"*** You Lost! ***"}],"tags":{"room":"Foyer Bar"}},"story_data":{"depths":{"go.0.1":["go","0",2],"go.0.3":["go","0",4],"foyer.0.2":["foyer","0",5],"foyer.0.3":["foyer","0",5],"foyer.0.4":["foyer","0",5],"cloakroom.0.2":["cloakroom","0",3],"cloak.0.7":["cloak","0",11],"cloak.0.8":["cloak","0",11],"cloak.0.9":["cloak","0",11],"cloak.0.10":["cloak","0",11],"cloak.0.12":["cloak","0",13],"darkness.0.1":["darkness","0",5],"darkness.0.2":["darkness","0",5],"darkness.0.3":["darkness","0",5],"darkness.0.4":["darkness","0",5],"foyer_bar.0.1":["foyer_bar","0",2]},"version":"0.10.16"}};