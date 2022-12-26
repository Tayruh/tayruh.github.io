function random(min, max) {
    var getRandom = function() {
        if (global.crypto === undefined) return Math.random();

        var byte_array = new Uint32Array(10);
        global.crypto.getRandomValues(byte_array);
        
        return byte_array[0]/(0xffffffff + 1);
    };

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(getRandom() * (max - min + 1)) + min;
};

function rollDice(dice, keep, drop, ignore, counts) {
    var a, b, roll;
    var die = [];

    die[0] = 0;
    
    for (a = 0; a < dice.length; ++a) {
        if (/^f/i.test(dice[a])) {
            roll = random(-1, 1);
            die.unshift(roll);
            continue;
        }

        roll = random(1, dice[a]);

        if (ignore.indexOf(roll) !== -1) continue;

        for (b = 0; b < die.length; ++b) {
            if (roll > die[b]) {
                die.splice(b, 0, roll);
                break;
            }
        }
    }

    die.pop(); // remove 0 entry

    if (drop !== null) {
        if (drop[0] === "H") die.splice(0, drop[1]);
        else if (drop[0] === "L") die.splice(0 - drop[1], drop[1]);
    }

    if (keep !== null) {
        if (keep[0] === "H") die.splice(keep[1]);
        else if (keep[0] === "L") die.splice(0, keep[1]);
    }

    var total = 0;
    for (a = 0; a < die.length; ++a) {
        if (!counts.length) total += die[a];
        else if (counts.indexOf(die[a]) !== -1) total += 1;
    }

    return total;
};

function probabilities(dice1, dice2) {
    var dupeDice = function(dice) {
        if (dice === undefined) return [];

        var a, b, val, match;
        var duped = [];

        for (a = 0; a < dice.length; ++a) {
            if (dice[a] === undefined) continue;

            val = dice[a].toString();
            if ((match = val.match(/^([0-9]+)d(f|[0-9]+)/i)) === null) {
                duped.push(dice[a]);
                continue
            }

            for (b = 0; b < parseInt(match[1]); ++b) {
                if (/^f/i.test(match[2])) duped.push("F");
                else duped.push(parseInt(match[2]));
            }
        }

        return duped;
    };

    var getCompare = function(dice) {
        if (!dice.length) return ">";

        var a, val, match;
        for (a = 0; a < dice.length; ++a) {
            val = dice[a].toString();
            
            if ((match = val.match(/^([><!=]+)/)) === null) continue;
            dice.splice(a, 1);
            return match[1];
        }

        return ">";
    };

    var getKeep = function(dice) {
        if (!dice.length) return null;

        var a, val, match;
        for (a = 0; a < dice.length; ++a) {
            val = dice[a].toString();
            
            if ((match = val.match(/^k([hl])([0-9]*)/i)) === null) continue;
            dice.splice(a, 1);
            return [match[1].toUpperCase(), match[2] || 1];
        }

        return null;
    };

    var getDrop = function(dice) {
        if (!dice.length) return null;

        var a, val, match;
        for (a = 0; a < dice.length; ++a) {
            val = dice[a].toString();
            if ((match = val.match(/^d([hl])([0-9]*)/i)) === null) continue;
            dice.splice(a, 1);
            return [match[1].toUpperCase(), match[2] || 1];
        }

        return null;
    };

    var getIgnore = function(dice) {
        if (!dice.length) return [];

        var val, match;
        var a = 0;
        var ignores = [];

        do {
            val = dice[a].toString();
            
            match = val.match(/^i([0-9]+)/i);
            if (match !== null) {
                dice.splice(a, 1);
                ignores.push(parseInt(match[1]));
            }
            else a += 1;
        }
        while (a < dice.length);

        return ignores;
    };

    var getMod = function(dice) {
        if (!dice.length) return null;

        var val, match;
        var a = 0;
        var mod = 0;

        do {
            val = dice[a].toString();
            
            match = val.match(/^([+-][0-9]+)/i);
            if (match !== null) {
                dice.splice(a, 1);
                mod += parseInt(match[1]);
            }
            else a += 1;
        }
        while (a < dice.length);

        return mod;
    };

    var getCount = function(dice) {
        if (!dice.length) return [];

        var a, val, match, low, high;
        var counts = [];
        for (a = 0; a < dice.length; ++a) {
            val = dice[a].toString();
            
            if ((match = val.match(/^c([0-9]+)(?:-([0-9]+))?/i)) === null) continue;
            dice.splice(a, 1);
            low = parseInt(match[1]);
            high = (parseInt(match[2]) || low);
            
            for (; low <= high; ++low) {
                counts.push(low);
            }
            break;
        }

        return counts;
    };

    var getProb = function(dice) {
        if (!dice.length) return null;

        var a, val, match;
        for (a = 0; a < dice.length; ++a) {
            val = dice[a].toString();
            
            if ((match = val.match(/^(at (?:least|most))/i)) === null) continue;
            dice.splice(a, 1);
            return match[1].toLowerCase();
        }

        return null;
    };

    var sortList = function(list) {
        var a, key;
        var sorted = [];

        for (key in list) {
            for (a = 0; a < sorted.length; ++a) {
                if (!sorted.length || parseInt(key) < sorted[a][0]) break;
            }
            sorted.splice(a, 0, [key, list[key]]);
        }

        return sorted;
    };
    
    var count = 10000000;
    // var count = 10;
    
    var a, result, result2;
    var output = [];
    var success = 0;

    dice1 = dupeDice(dice1);
    dice2 = dupeDice(dice2);
    
    var compare = getCompare(dice2);
    var keep = getKeep(dice1);
    var keep2 = getKeep(dice2);
    var drop = getDrop(dice1);
    var drop2 = getDrop(dice2);
    var ignore = getIgnore(dice1);
    var ignore2 = getIgnore(dice2);
    var mod = getMod(dice1);
    var mod2 = getMod(dice2);
    var counts = getCount(dice1);
    var counts2 = getCount(dice2);
    var probs = getProb(dice1);
    var probs2 = getProb(dice2);

    var tallies = {};
    var tallies2 = {};
    var total = 0;
    var total2 = 0;

    for (a = 0; a < count; ++a) {
        if (!dice1.length) result = mod;
        else {
            result = rollDice(dice1, keep, drop, ignore, counts) + (mod || 0);
            if (!(result in tallies)) tallies[result] = 1;
            else tallies[result] += 1;
            total += result;
        }

        // compare
        if (dice2 !== undefined) {
            if (!dice2.length) result2 = mod2;
            else {
                result2 = rollDice(dice2, keep2, drop2, ignore2, counts2) + (mod2 || 0);
                if (!(result2 in tallies2)) tallies2[result2] = 1;
                else tallies2[result2] += 1;
                total2 += result2;
            }

            if (eval(result + compare + result2)) success += 1;
        }
    }

    tallies = sortList(tallies);

    var prob, display;
    var prob_inc = 0;
    if (dice1.length) {
        output.push("\nAverage: " + (total / count).toFixed(2) + "\n--------");
        for (a = 0; a < tallies.length; ++a) {
            prob = tallies[a][1] / count * 100;
            if (probs === "at most") {
                prob_inc += prob;
                display = prob_inc;
            }
            else if (probs === "at least") {
                display = 100 - prob_inc;
                prob_inc += prob;
            }
            else display = prob;
            output.push(tallies[a][0].padStart(3) + ": " + display.toFixed(2).padStart(6) + " " + "-".repeat(display.toFixed(0)));
        }
    }

    // compare results
    if (dice2.length) {
        prob_inc = 0;
        tallies2 = sortList(tallies2);

        output.push("\nAverage: " + (total2 / count).toFixed(2) + "\n--------");
        for (a = 0; a < tallies2.length; ++a) {
            prob = tallies2[a][1] / count * 100;
            if (probs2 === "at most") {
                prob_inc += prob;
                display = prob_inc;
            }
            else if (probs2 === "at least") {
                display = 100 - prob_inc;
                prob_inc += prob;
            }
            else display = prob;
            output.push(tallies2[a][0].padStart(3) + ": " + display.toFixed(2).padStart(6) + " " + "-".repeat(display.toFixed(0)));
        }
    }

    if (dice2.length || mod2 !== null) output.push("\nSuccess: " + (success / count * 100).toFixed(2));

    console.log(output.join("\n"));
};

/*
    arguments take two arrays. array elements consist of the following:
    1 through 100: size of dice to roll. 6 becomes a d6, etc. F can be used for Fate dice.
    XdX: where "3d6" rolls three d6s.  As above, 4dF represents typical Fate dice.
    khX or klX: where X represents the number of  highest or lowest dice to keep.
    iX: where X is the value to exclude from roll results. This can be specified multiple times.
    +X or -X: where X represents the value to add/subtract from the total after it's rolled.
    dh and dl: drop highest or lowest roll.
    dhX or dlX: where X represnts the number of highest or lowest dice to drop. 
    cX or cX-Y: counts success equal to X or X through Y.
    > or < or >= or <= or !=: the setting represents how the first and second sets of dice are compared. this setting is only in the second set. default is >
    at least: shows chance of rolling at least the number
    at most: shows chance of rolling at most the number
*/

// chronicles of darkness
// probabilities(["5d10", "c7-10"], ["+3"])

// Fate
// probabilities(["4dF", "+2"], [">=", "4dF"])

// cortex
probabilities(
    [4, 6, 6, 10, 12, , "kh2", "i1"],
    ["3d6", "kh2", "i1"]
);

// powered by the atom
// probabilities(["2d6", "at least"])

// gurps
// probabilities(["3d6", "at least"])