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

function keyLegend() {
 	// Get theme
 	var theme = settings["displayTheme"];
 	var index = choices[1].indexOf(theme);
 	// Create Table
 	var tbl = document.createElement('table');
 	// id for CSS
 	tbl.id = "keylegend";

 	for (var i = 0; i < Object.keys(keyColors[index]).length; i++) {
 		var tr = tbl.insertRow();
 		var keycolor = tr.insertCell();
 		keycolor.className = "keycolor";
 		keycolor.style.backgroundColor = keyColors[index][Object.keys(keyColors[index])[i]];

 		var keyname = tr.insertCell();
 		keyvalue = document.createTextNode(Object.keys(keyColors[index])[i]);
 		keyname.appendChild(keyvalue);
 		keyname.className = "keyvalue";

 	};
 	get("key").appendChild(tbl);
}

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
	if (units[index] != "") {
			var end = choicesDisplay[1][index] + " (" + units[index] + ")";
		} else {
			var end = choicesDisplay[1][index];
		}
	title.innerHTML = end;
	get("titleholder").appendChild(title);

}

function makeSettings() {
	for(var i = 0; i < options.length;i++) {
		var parent = get("option")[i]; 
		var text = document.createElement("p");
		// Create text of current settings choice for this option 
		text.appendChild(document.createTextNode(choicesDisplay[i][choices[i].indexOf(settings[parent.id])]))
		text.className = "selection";

		parent.appendChild(text);
		var holder = document.createElement("div"); //Dropdown choice holder div
		holder.className = "dropdown";
		parent.appendChild(holder);

		// On mouse functions
		parent.onclick = function() {
			// Make visible
			var k = this;
			this.childNodes[1].style.display = "inline";
			// Needs delay in between to execute transition properly, do not remove. 
			setTimeout(function(){k.childNodes[1].style.opacity = "1";},1);
		}
		parent.onmouseleave = function() {
			// Make invisible
			var k = this;
			this.childNodes[1].style.opacity = "0";
			setTimeout(function(){k.childNodes[1].display = "none";},300); //Time for opacity change
		}
		holder.onmouseleave = function() {
			// Make invisible
			var k = this;
			this.style.opacity = "0";
			setTimeout(function(){k.style.display = "none";},300); //Time for opacity change
		}

		for(var j = 0;j < choices[i].length;j++) { // For all choices, append div for choice selection
			var p = document.createElement("p");
			p.className = i.toString() + j.toString(); 
			p.appendChild(document.createTextNode(choicesDisplay[i][j]))
			holder.appendChild(p);

			p.onclick = function(event) {
				event.stopPropagation(); // Parent onclick doesn't occur when child gets clicked
				var value = this.innerHTML;
				var k = this;
				var setting = this.parentNode.parentNode.id;
				var textDiv = this.parentNode.parentNode.childNodes[0].childNodes[0];
				// Only if different value
				if(value !== textDiv.nodeValue) {
					this.parentNode.style.opacity = "0";
					setTimeout(function(){k.parentNode.style.display = "none";},300);
					// Text transition: opacity 0
					console.log("hi");
					textDiv.parentNode.style.color = themeChart["font"][settings["theme"]].replace(")",",0)").replace("b","ba");
					// Update settings through cookie
					deleteCookie(setting);
					document.cookie = setting+"="+choices[parseInt(this.className[0])][parseInt(this.className[1])];
					// Text transition: opacity 1
					setTimeout(function() {
						textDiv.nodeValue = value;
						textDiv.parentNode.style.color = themeChart["font"][settings["theme"]].replace(")",",1)").replace("b","ba");
						update();
					}, 650)
					
				}
			}
		}
	}
}