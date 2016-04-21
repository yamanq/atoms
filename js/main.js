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
	getRanges();
	createTable();
	update();
	makeSettings();
	tableDesc();
	keyLegend();
	createGradientLegend();
}, 600);	