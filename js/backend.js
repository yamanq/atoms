function changeColor(hex, amt) {

	hex = hex.slice(1);
    var num = parseInt(hex,16);
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 	
 	var final = (g | (b << 8) | (r << 16)).toString(16);

 	// Adds preceeding zeros
 	while (final.length < 6) {final = "0" + final};
    return "#" + final;
}

function gradientColor(hex1, hex2, ratio) {

	// Splits hex1 into 3 pieces (2 char each)
	var hex1 = hex1.replace("#", "").match(/.{1,2}/g);
	// Converts each one into int

	for (var i = 0; i <= 2; i++) {
		hex1[i] = parseInt(hex1[i], 16);
	}

	// Does above process for hex2
	var hex2 = hex2.replace("#", "").match(/.{1,2}/g);
	for (var i = 0; i <= 2; i++) {
		hex2[i] = parseInt(hex2[i], 16);
	}

	// Creates end table for finished hex parts
	var donetable = [];
	// Averages each of the three parts between hex1 and hex2
	for (var i = 0; i <= 2; i++) {
		// Weighted average to get exact gradient necessary and not average
		// Round to prevent weird hex decimal shenanigans
		var val = Math.round((ratio) * hex1[i] + (1 - ratio) * hex2[i]);
		val = val.toString(16);

		// Adds 0 to solve math automatically removing preceeding zeroes
		if (val.length === 1) {
			val = "0" + val;
		}
		donetable[i] = val;
	}

	// Rejoins hex and adds #
	done = "#" + donetable.join("");

	return done;
}

function get(name) {
	// Condensed format for document.getX
	var elements = [];
	if(document.getElementsByClassName(name).length > 0) {
		elements = document.getElementsByClassName(name);
	} 
	else if(document.getElementsByTagName(name).length > 0) {
		for(var a = 0; a < document.getElementsByTagName(name).length; a++) {
			elements.push(document.getElementsByTagName(name)[a]);
		}
	}
	else if(document.getElementById(name) != null) {
		elements.push(document.getElementById(name));
	}
	
	if(elements.length == 1) {
		return elements[0];
	} else { return elements; } 
}

function deleteCookie(setting) {
	// Sets expiration date to past date, deleting cookie automatically
	document.cookie = setting+"=; expires=Thu, 01 Jan 2000 00:00:00 GMT";
}

function createTable() {
    var tbl = document.createElement('table');
    tbl.style.border = "1px hidden";
    tbl.className = "normal";

    // Creates table width j, height i
    for(var i = 0; i < 7; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 18; j++) {
            td = tr.insertCell();
            td.className = "periodictable";
        }
    }
   	get("sidebar")[0].appendChild(tbl);

   	// Repeat of process above for Lanthanides and Actinides
   	tbl = document.createElement('table');
    tbl.className = "extension";
    for(var i = 0; i < 2; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 15; j++) {
            var td = tr.insertCell();
            td.className = "periodictable";
        }
    }
   	get("sidebar")[0].appendChild(tbl);

   	// Creates text for the periodic table
    cells = get("td");
    for(var i = 0;i < elementCount;i++) {
    	ele = document.createElement("p");
    	text = document.createTextNode(i+1); // i+1 to offset 0
    	ele.appendChild(text);
    	cells[info["location"][i]].appendChild(ele);
    	text = document.createTextNode(info["shorthand"][i]);
    	cells[info["location"][i]].appendChild(text);
    	cells[info["location"][i]].className = cells[info["location"][i]].className +" atom"; // Adds class to prevent hover animation on blank cells
    }
}

/* function keyLegend(theme) {
 	// Create Table
 	var tbl = document.createElement('table');
 	// Class for CSS
 	tbl.className = "key";
 	// Get theme
 	var theme = settings["displayTheme"]; 
}*/

function createGradientLegend() {

	var units = [""," pm"," g/mol", " kJ/mol"," kJ/mol", " eV", "", " g/mL", "",""];

	// Create Table element
	var tbl = document.createElement('table');
	
	// Adds Class for styling
	tbl.className = "legend";

	// Gets theme then makes vars for hexes so that repeated table access not necessary
	var theme = settings["displayTheme"];
	var index = choices[1].indexOf(theme);
	var unit = settings["unit"];

	// Filter out non-gradient layouts
	if (colorChart[theme].length === 2) {
		var color1 = colorChart[theme][0];
		var color2 = colorChart[theme][1];
	}


	// Creates a gradient of 101 values wide (j) for good transition
    var tr = tbl.insertRow();
    for(var j = 0; j <= 1; j += 0.01) {
        var td = tr.insertCell();
        td.className = "legendcell";
        if (colorChart[theme].length === 2) { 
        	td.style.backgroundColor = gradientColor(color1, color2 , j);
        }
    }

    // Adds table to key area
    get("legendholder").appendChild(tbl);

    // Create Key

    var min = document.createElement("p");
    min.className = "legendrangeval minlegend";
    var max = document.createElement("p");
    max.className = "legendrangeval maxlegend"

    if (colorChart[theme].length != 2) {
    	var minval = document.createTextNode("");
    	var maxval = document.createTextNode("");

	} else if (theme === "melting" || theme === "boiling") {
		if (unit === "K") {
			var extra = " " + unit;
		} else {
			var extra = " °" + unit;
	    }
	    var minval = document.createTextNode(ranges[theme][unit][0] + extra);
	    var maxval = document.createTextNode(ranges[theme][unit][1] + extra); 


	} else {
		var minval = document.createTextNode(ranges[theme][0] + " " + units[index]);
		var maxval = document.createTextNode(ranges[theme][1] + " " + units[index]);

	}
	    min.appendChild(minval);
	    max.appendChild(maxval);

	    get("legendholder").appendChild(min);
	    get("legendholder").appendChild(max);

	// Create Title

	var title = document.createElement("h1");
	title.className = "tabletitle";
	title.innerHTML = choicesDisplay[1][index] + " (" + units[index] + ")";
	get("titleholder").appendChild(title);

}

function getRanges() {
	// Format of ranges is [Min, Max, Range]
	for(var i = 1; i < choices[1].length; i++) { // Possible data types are options except for category
		var option = choices[1][i]; 
		if(i == 7 || i == 8) {
			ranges[option] = {};
			for(var j = 0; j < 3; j++) { // Units for temperatures
				var unit = choices[3][j];
				var min = Math.min.apply(null,info[option][unit]);
				var max = Math.max.apply(null,info[option][unit]);
				var range = max - min;
				ranges[option][unit] = [min,max,range];
			}		
		} else {
			var min = Math.min.apply(null,info[option]);
			var max = Math.max.apply(null,info[option]);
			var range = max - min;
			ranges[option] = [min,max,range];
		}			
	}
}