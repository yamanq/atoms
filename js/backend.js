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