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

function balanceEquation(reactant, product) {
    var compounds = [];
    var vary = [];
    var matrix = [];
    var freeMatrix = [];
    var finalMatrix = [];

    // Create array from inputs.
    formulaStr = reactant + "+" + product;
    compounds = formulaStr.replace(/\s/g,"").split("+");

    // Create element matrix.
    for(var i = 0; i < compounds.length; i++) {
        var counter = 0;
        var indexes = [];

        currString = compounds[i];
        compounds[i] = [compounds[i]];
        
        while(counter < currString.length) {
            if(currString[counter] == currString[counter].toUpperCase() && isNaN(currString[counter])) {
                indexes.push(counter);  
            }
            counter += 1;
        }

        indexes.push(currString.length);
        
        for(var j = 0; j < indexes.length-1; j++) {
            element = currString.substring(indexes[j],indexes[j+1]);
            elementNoNum = element.replace(/[0-9]/g,"");

            if(vary.indexOf(elementNoNum) == -1) {
                vary.push(elementNoNum);
            }

            if(element.search(/[0-9]/g) != -1) {
                compounds[i].push([elementNoNum,parseInt(element.replace(/\D/g,""))]);
            } else {
                compounds[i].push([elementNoNum,1]);
            }
        }      
    }
       
    for(var x = 0; x < vary.length; x++) {
        matrix[x] = [];
        for(var y = 0; y < compounds.length; y++) {
            var pushed = false;
            for(var z = 1; z < compounds[y].length; z++) {
                if(compounds[y][z][0] == vary[x]) {
                    matrix[x].push(compounds[y][z][1]);
                    pushed = true;
                    break;
                }
            }
            if(!pushed) {
                matrix[x].push(0);
            }
        }
    }

    // Get Reduced Row Echelon Form.
    var lead = 0;
    var rows = matrix.length;
    var columns = matrix[0].length;
            
    for(var a = 0; a < rows; a++) {
        var breakOut = false;
        if(columns <= lead) {
            break;
        }
        var e = a;
        while(matrix[e][lead] === 0) {
            e++;
            if(rows == e) {
                e = a;
                lead++;
                if(columns == lead) {
                    breakOut = true;
                    break;
                }
            }
        }
        
        if(breakOut) break;
        
        var tmp = matrix[e];
        matrix[e] = matrix[a];
        matrix[a] = tmp;

        var val = matrix[a][lead];
        for(var b = 0; b < columns; b++) {
            matrix[a][b] /= val;
        }
        
        for(var c = 0; c < rows; c++) {
            if (c == a) continue;
            val = matrix[c][lead];
            for(var d = 0; d < columns; d++) {
                matrix[c][d] -= val * matrix[a][d];
            }
        }
        lead++;
    }

    // Extract free matrix.
    var rank = matrix.length;
    for(var m = 0; m < rank; m++) {
        freeMatrix[m] = [];
        for(var n = rank; n < matrix[0].length; n++) {
            freeMatrix[m].push(-1*matrix[m][n]);
        }
    }
    
    // Adding identity matrix.
    for(var e = 0; e < compounds.length-freeMatrix.length; e++) {
        freeMatrix.push([]);
        for(var f = 0; f < compounds.length-rank; f++) {
            if((f/2) == parseInt(f/2)) {
                freeMatrix[e+rank].push(1);
            } else {
                freeMatrix[e+rank].push(0);
            }
        }
    }

    // Adding and converting into 1 column/row.
    for(var o = 0; o < freeMatrix.length; o++) {
        var value = 0;
        for(var p = 0; p< freeMatrix[0].length; p++) {
            value += freeMatrix[o][p];
        }
        finalMatrix.push(value);
    }

    // Multiply all to integers.
    var mul = 1;
    var testMul = 1;
    
    for(var g = 0; g < finalMatrix.length; g++) {
        var testInt = finalMatrix[g] * testMul;
        while(testInt != parseInt(testInt)) {
            testMul += 1;
            testInt = finalMatrix[g] * testMul;
        }
        if(testMul < mul) {
            mul = testMul;
        }
    }
    
    for(var h = 0; h < finalMatrix.length; h++) {
        finalMatrix[h] *= testMul;
    }

    // Get GCD.
    var gcd = finalMatrix[0];
    
    for(var u = 0; u < finalMatrix.length-2; u++) {
        gcd = getGCD(gcd, finalMatrix[u+1]); 
    }
    
    // Get final answers.
    for(var w = 0; w < finalMatrix.length; w++) {
        finalMatrix[w] /= gcd;
        finalMatrix[w] = Math.abs(finalMatrix[w]);
        if(finalMatrix[w] != 1) {
            finalMatrix[w] += compounds[w][0]; 
        } else {
            finalMatrix[w] = compounds[w][0];
        }
    }
    
    return finalMatrix;
}

function getGCD(a,b) {
    if(!b) return a;
    return getGCD(b, a % b);
}