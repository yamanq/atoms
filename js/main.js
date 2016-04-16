function getJSON() {		 
	xhr.open("GET","./resources/static/info.json", true);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        info = JSON.parse(xhr.responseText);
	    }
	}
	xhr.send(null);
}

function update() {
	var cookie = document.cookie;
	var cookieArray = cookie.split(";");

	// For all settings, append into object format

	for(var i = 0; i < cookieArray.length; i++) {
		var set = cookieArray[i].split("=");
		settings[set[0].replace(" ","")] = set[1];
	}

	// Below are settings applied based 
	var dispTheme = settings["displayTheme"];
	changeTheme(settings["theme"]);
	tableTheme(dispTheme);
	legendChange(dispTheme);
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
    for(var i = 0;i < 118;i++) {
    	ele = document.createElement("p");
    	text = document.createTextNode(i+1); // i+1 to offset 0
    	ele.appendChild(text);
    	cells[info["location"][i]].appendChild(ele);
    	text = document.createTextNode(info["shorthand"][i]);
    	cells[info["location"][i]].appendChild(text);
    	cells[info["location"][i]].className = cells[info["location"][i]].className +" atom"; // Adds class to prevent hover animation on blank cells
    }
}

function createGradientLegend() {
	// Create Table element
	var tbl = document.createElement('table');
	
	// Adds Class for styling
	tbl.className = "legend";

	// Gets theme then makes vars for hexes so that repeated table access not necessary
	var theme = settings["displayTheme"];

	// Filter out non-gradient layouts
	if (colorChart[theme].length > 2) {
		//keyLegend();
		return;
	}

	var color1 = colorChart[theme][0];
	var color2 = colorChart[theme][1];


	// Creates a gradient of 101 values wide (j) for good transition
    var tr = tbl.insertRow();
    for(var j = 0; j <= 1; j += 0.01) {
        var td = tr.insertCell();
        td.className = "legendcell";
        td.id
        td.style.backgroundColor = gradientColor(color1, color2 , j);
    }

    // Adds table to key area
    get("legendholder").appendChild(tbl);
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

var reader = new FileReader();
var xhr = new XMLHttpRequest();

if(document.cookie == "") { // Set defaults if no cookie
	document.cookie = "theme=light";
	document.cookie = "displayTheme=category;";
	document.cookie = "elecConf=abr;";
	document.cookie = "unit=K;"
}

getJSON();

setTimeout(function mainFunc() {
	createTable();
	update();
	makeSettings();
	tableDesc();
	createGradientLegend();
}, 600);	