function getColor(theme, atomNum) {
    if(theme == "category") {
        var color = colorChart[theme][info[theme][atomNum]];    
    } else if(theme == "melting" || theme == "boiling") { 
        if(info[theme]["K"][atomNum] == null) { // if value is null
            color = "#41484D";
        } else {
            // Value - Min(all values) / Max(all values) - Min(all values)
            var ratio = (info[theme]["K"][atomNum] - ranges[theme]["K"][0]) / ranges[theme]["K"][2];
            var color = gradientColor(colorChart[theme][0],colorChart[theme][1], ratio); // high, low, ratio
        }   
    } else {
        if(info[theme][atomNum] == null) { // if value is null
            color = "#41484D";
        } else {
            // Value - Min(all values) / Max(all values) - Min(all values)
            var ratio = (info[theme][atomNum] - ranges[theme][0]) / ranges[theme][2];
            var color = gradientColor(colorChart[theme][0],colorChart[theme][1], ratio); 
        }
    }

    return color;
}

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

function deleteElem (id) {
    var element = document.getElementById(id);
    elem.parentNode.removeChild(element);
    
}

function deleteCookie(setting) {
    // Sets expiration date to past date, deleting cookie automatically
    document.cookie = setting+"=; expires=Thu, 01 Jan 2000 00:00:00 GMT";
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