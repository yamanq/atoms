function changeTheme(type) {
	// Changes background image
	get("body").style.backgroundImage = "url('./resources/static/" + type +".png')";

	// Changes interface element colors
	for(var i = 0; i < get("pulltab").length; i++) {
		get("pulltab")[i].style.backgroundColor = themeChart["pulltab"][type];
		get("pulltab")[i].style.color = themeChart["font"][settings["theme"]].replace(")",",0)");
		get("pulltab")[i].onmouseover = function() {
			this.style.color = themeChart["font"][settings["theme"]].replace(")",",1)").replace("b","ba");
		}
		get("pulltab")[i].onmouseleave = function() {
			this.style.color = themeChart["font"][settings["theme"]].replace(")",",0)").replace("b","ba");
		}
		get("sidebar")[i].style.backgroundColor = themeChart["sidebar"][type];
		get("body").style.color = themeChart["font"][type];
	}
}

function tableTheme(theme) {
	for(var i = 0;i < elementCount;i++) {
		// Changes background color of each cell
		if (document.getElementsByClassName("periodictable").length != 0) {
			document.getElementsByClassName("periodictable")[info["location"][i]].style.backgroundColor = getColor(theme, i);
		}
	}
	try {lastElement.click();} catch(err){}
}

function legendChange(theme) {
	var units = [""," pm"," g/mol", " kJ/mol"," kJ/mol", " eV", "", " g/mL", "",""];

	// Title
	if (document.getElementsByClassName("tabletitle").length != 0) {
		var index = choices[1].indexOf(theme);
		if (units[index] != "") {
			var end = choicesDisplay[1][index] + " (" + units[index] + ")";
		} else {
			var end = choicesDisplay[1][index];
		}
		document.getElementsByClassName("tabletitle")[0].innerHTML = end;
	}

	if (colorChart[theme].length != 2) {
		document.getElementsByClassName("legendholder")[0].style.display = "none";
	} else {
		document.getElementsByClassName("legendholder")[0].style.display = "";
		var color1 = colorChart[theme][0];
		var color2 = colorChart[theme][1];

		if (theme === "melting" && "boiling") {
			var unit = settings["unit"];
			var newmin = ranges[theme][unit][0];
			var newmax = ranges[theme][unit][1];

			if (unit != "K") {
				unit = "°" + unit;
			}
			newmin = newmin + " " + unit;
			newmax = newmax + " " + unit;


		} else {
			var newmin = ranges[theme][0] + " " + units[index];
			var newmax = ranges[theme][1] + " " + units[index];
		}

		if (document.getElementsByClassName("legend").length != 0) {

			for(var j = 0; j <= 99; j ++) {
					document.getElementsByClassName("legendcell")[j].style.backgroundColor = gradientColor(color1, color2 , j/100);
			}

			document.getElementsByClassName("minlegend")[0].innerHTML = newmin;
			document.getElementsByClassName("maxlegend")[0].innerHTML = newmax;
		}
	}
}