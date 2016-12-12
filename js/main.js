
//
// Atoms - molecular interactions simulator
// Copyright (C) 2016  Yaman Qalieh and Kenneth Jao

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

function getJSON() {
	xhr.open("GET","./resources/static/info.json", true);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        info = JSON.parse(xhr.responseText);
	    }
	};
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
	  keyChange(dispTheme);
}

var reader = new FileReader();
var xhr = new XMLHttpRequest();

if(document.cookie === "") { // Set defaults if no cookie
	document.cookie = "theme=light";
	document.cookie = "displayTheme=category;";
	document.cookie = "elecConf=abr;";
	document.cookie = "unit=K;"
}

getJSON();

setTimeout(function mainFunc() {
	getRanges();
	createTable();
	update();
	makeSettings();
	tableDesc();
	keyLegend();
	createGradientLegend();
}, 600);	
