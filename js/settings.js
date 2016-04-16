function changeTheme(type) {
	var theme = {
		"pulltab": {'light': '#B3DAFF','dark': '#F33333'},
		"sidebar": {'light':'#E6F5FF','dark':'#FF5858'} 
	};

	// Changes background image
	get("body").style.backgroundImage = "url('./resources/static/" + type +".png')";

	// Changes interface element colors
	for(var i = 0; i < get("pulltab").length; i++) {
		get("pulltab")[i].style.backgroundColor = theme["pulltab"][type];
		get("sidebar")[i].style.backgroundColor = theme["sidebar"][type];
	}
}

function tableTheme(theme) {
	for(var i = 0;i < 118;i++) {
		// Changes background color of each cell
		if (document.getElementsByClassName("periodictable").length != 0) {
			document.getElementsByClassName("periodictable")[info["location"][i]].style.backgroundColor = getColor(theme, i);
		}
	}
}

function legendChange(theme) {
	var color1 = colorChart[theme][0];
	var color2 = colorChart[theme][1];
	for(var j = 0; j <= 99; j ++) {
		if (document.getElementsByClassName("legend").length != 0) {
			document.getElementsByClassName("legendcell")[j].style.backgroundColor = gradientColor(color1, color2 , j/100);
		}
		
    }
}