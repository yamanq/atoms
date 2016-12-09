atoms = [];

renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
    transparent: true,
    antialias: true
});
superstage = new PIXI.Container();

get("body").appendChild(renderer.view);

var count = 0;
var pass = true;

// Standard Normal variate using Box-Muller transform.
function randn_bm(length) {
    // Subtraction to flip [0, 1) to (0, 1].
    var u = 1 - Math.random();
    var v = 1 - Math.random();
    length = length / 2;
    var done = length + (length / 5) * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    if (done < 0 || done > (length * 2)) {
        return randn_bm(2 * length);
    } else {
        return done;
    }
}

function createAtom(index) {
    atoms.push({
        stage: undefined,
        graphics: undefined,
        electrongraphics: undefined,
        electronText: undefined,
        eyegraphics: undefined,
        general: {
            index: index,
            random: 5 * Math.random()
        }
    });

    currentatom = atoms[atoms.length - 1];
    currentatom.stage = new PIXI.Container();
    currentatom.stage.interactive = true;
    currentatom.stage.buttonMode = true;
    currentatom.stage.anchor = 0.5;
    currentatom.stage
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    currentatom.graphics = new PIXI.Graphics();

    var xcenter = randn_bm(window.innerWidth);
    var ycenter = randn_bm(window.innerHeight);

    currentatom.stage.position.x = xcenter;
    currentatom.stage.position.y = ycenter;

    currentatom.electrongraphics = new PIXI.Graphics();
    currentatom.eyegraphics = new PIXI.Graphics();
    currentatom.electronText = new PIXI.Text("", {
        font: "300% Oswald"
    });
    currentatom.electronText.position.x = -10;
    currentatom.electronText.position.y = -130;

    currentatom.stage.addChild(currentatom.graphics);
    currentatom.stage.addChild(currentatom.electrongraphics);
    currentatom.stage.addChild(currentatom.eyegraphics);
    currentatom.stage.addChild(currentatom.electronText);

    var bgColor = getColor(settings.displayTheme, index);
    currentatom.electronText.text = info.shorthand[index];
    currentatom.graphics.beginFill("0x" + bgColor.substring(1));
    currentatom.graphics.lineStyle(10, "0x" + changeColor(bgColor, 20).substring(1), 1);
    currentatom.graphics.drawCircle(0, 0, 90);

    currentatom.eyegraphics.beginFill("0x" + changeColor(bgColor, -20).substring(1));
    currentatom.eyegraphics.lineStyle(3, "0xffffff");
    currentatom.eyegraphics.drawEllipse(15, -12, 8, 20);
    currentatom.eyegraphics.drawEllipse(-15, -12, 8, 20);

    currentatom.electrongraphics.beginFill(0xffffff);
    var numEl = info.valeElec[index];
    for (var elnum = 0; elnum < numEl; elnum++) {
        currentatom.electrongraphics.drawCircle(110 * Math.cos((2 * Math.PI * elnum) / numEl),
            110 * Math.sin((2 * Math.PI * elnum) / numEl),
            13);
    }
    superstage.addChild(currentatom.stage);

    if (pass) mainAnimate();
    return true;
}

function mainAnimate() {
    pass = false;
    for (var i = 0; i < atoms.length; i++) {
        var currentatom = atoms[i];

        currentatom.electrongraphics.rotation = count + currentatom.general.random;
        currentatom.eyegraphics.position.y = currentatom.electrongraphics.position.y + 5 * Math.sin(count * 0.5);
    }
    count += 0.05;
    renderer.render(superstage);
    requestAnimationFrame(mainAnimate);
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.75;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function getColor(theme, atomNum) {
    var color;
    var ratio;
    if (theme == "category") {
        color = colorChart[theme][info[theme][atomNum]];
    } else {
        if (info[theme][atomNum] === null) { // if value is null
            color = "#41484D";
        } else {
            // Value - Min(all values) / Max(all values) - Min(all values)
            ratio = (info[theme][atomNum] - ranges[theme][0]) / ranges[theme][2];
            color = gradientColor(colorChart[theme][0], colorChart[theme][1], ratio);
        }
    }

    return color;
}

function convertUnit(Kval, unit) {
    if (unit === "C") {
        return +(Kval - 273.15).toFixed(2);
    } else if (unit === "F") {
        return +((1.8 * Kval) - 459.67).toFixed(2);
    } else {
        return Kval;
    }
}

function changeColor(hex, amt) {

    hex = hex.slice(1);
    var num = parseInt(hex, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    var final = (g | (b << 8) | (r << 16)).toString(16);

    // Adds preceeding zeros
    while (final.length < 6) {
        final = "0" + final;
    }
    return "#" + final;
}

function gradientColor(hex1, hex2, ratio) {
    // Creates end table for finished hex parts
    var donetable = [];

    // Splits hex1 into 3 pieces (2 char each)
    hex1 = hex1.replace("#", "").match(/.{1,2}/g);
    hex2 = hex2.replace("#", "").match(/.{1,2}/g);
    // Converts each one into int

    for (var i = 0; i <= 2; i++) {
        hex1[i] = parseInt(hex1[i], 16);
        hex2[i] = parseInt(hex2[i], 16);

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
    classname = document.getElementsByClassName(name);
    tagname = document.getElementsByTagName(name);
    idname = document.getElementById(name);
    if (classname.length > 0) elements = elements.concat(classname);
    else if (tagname.length > 0) elements = elements.concat(tagname);
    else if (idname !== null) elements.push(document.getElementById(name));

    elements = elements[0];
    if (elements === undefined) {
        return [];
    } else if (elements.length == 1) {
        return elements[0];
    } else {
        return elements;
    }
}

function deleteElem(id) {
    var element = document.getElementById(id);
    elem.parentNode.removeChild(element);
}

function deleteCookie(setting) {
    // Sets expiration date to past date, deleting cookie automatically
    document.cookie = setting + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT";
}

function getRanges() {
    // Format of ranges is [Min, Max, Range]
    for (var i = 1; i < choices[1].length; i++) { // Possible data types are options except for category
        var option = choices[1][i];
        var min = Math.min.apply(null, info[option]);
        var max = Math.max.apply(null, info[option]);
        var range = max - min;
        ranges[option] = [min, max, range];
    }
}

function balanceEquation(reactant, product) {
    // TODO NOT working
    // TODO shorten code
    var compounds = [];
    var vary = [];
    var matrix = [];
    var freeMatrix = [];
    var finalMatrix = [];

    // Create array from inputs.
    formulaStr = reactant + "+" + product;
    compounds = formulaStr.replace(/\s/g, "").split("+");

    // Create element matrix list.
    for (var i = 0; i < compounds.length; i++) {
        var counter = 0;
        var indexes = [];

        currString = compounds[i];
        compounds[i] = [compounds[i]];

        while (counter < currString.length) {
            if (currString[counter] == currString[counter].toUpperCase() && isNaN(currString[counter])) {
                indexes.push(counter);
            }
            counter += 1;
        }

        indexes.push(currString.length);

        for (var j = 0; j < indexes.length - 1; j++) {
            element = currString.substring(indexes[j], indexes[j + 1]);
            elementNoNum = element.replace(/[0-9]/g, "");

            if (vary.indexOf(elementNoNum) == -1 && elementNoNum != '(' && elementNoNum != ')') {
                vary.push(elementNoNum);
            }

            if (element.search(/[0-9]/g) != -1) {
                compounds[i].push([elementNoNum, parseInt(element.replace(/\D/g, ""))]);
            } else {
                compounds[i].push([elementNoNum, 1]);
            }
        }
    }

    //Parenthesis handling.
    for (var r = 0; r < compounds.length; r++) {
        var s = 1;
        while (s < compounds[r].length) {
            if (compounds[r][s][0] == "(") {
                var count = 1;
                var v = s;

                while (count > 0) {
                    v++;
                    if (compounds[r][v][0] == "(") count++;
                    if (compounds[r][v][0] == ")") count--;
                }

                var curr = compounds[r];
                var times = curr[v][1];
                var before = curr.splice(0, s);
                var mid = curr.splice(1, v - 1 - before.length);

                var ae = 0;
                var open = 0;

                while (ae < curr.length) {
                    if (curr[ae][0] == "(") {
                        open++;
                        if (open == 1) curr.splice(ae, ae + 1);
                    } else if (curr[ae][0] == ")") {
                        open--;
                        if (open === 0) curr.splice(ae, ae + 1);
                        break;
                    } else {
                        ae++;
                    }
                }
                var after = curr;
                for (var ab = 0; ab < mid.length; ab++) {
                    if (times > 1) {
                        mid[ab][1] *= times;
                        before.push(mid[ab]);
                    } else {
                        before.push(mid[ab]);
                    }
                }
                if (after !== 0) {
                    for (var ac = 0; ac < after.length; ac++) {
                        before.push(after[ac]);
                    }
                }
                compounds[r] = before;
                s = 0;
            }
            s++;
        }
    }

    // Create matrix.
    for (var x = 0; x < vary.length; x++) {
        matrix[x] = [];
        for (var y = 0; y < compounds.length; y++) {
            var pushed = false;
            for (var z = 1; z < compounds[y].length; z++) {
                if (compounds[y][z][0] == vary[x]) {
                    matrix[x].push(compounds[y][z][1]);
                    pushed = true;
                    break;
                }
            }
            if (!pushed) {
                matrix[x].push(0);
            }
        }
    }

    // Get Reduced Row Echelon Form.
    var lead = 0;
    var rows = matrix.length;
    var columns = matrix[0].length;

    for (var a = 0; a < rows; a++) {
        var breakOut = false;
        if (columns <= lead) {
            break;
        }
        var e = a;
        while (matrix[e][lead] === 0) {
            e++;
            if (rows == e) {
                e = a;
                lead++;
                if (columns == lead) {
                    breakOut = true;
                    break;
                }
            }
        }

        if (breakOut) break;

        var tmp = matrix[e];
        matrix[e] = matrix[a];
        matrix[a] = tmp;

        var val = matrix[a][lead];
        for (var b = 0; b < columns; b++) {
            matrix[a][b] /= val;
        }

        for (var c = 0; c < rows; c++) {
            if (c == a) continue;
            val = matrix[c][lead];
            for (var d = 0; d < columns; d++) {
                matrix[c][d] -= val * matrix[a][d];
            }
        }
        lead++;
    }

    // Remove redundant lines.
    for (var r = 0; r < matrix.length; r++) {
        var splice = true;
        for (var q = 0; q < matrix[0].length; q++) {
            if (matrix[r][q] === 0 && splice === false) {
                splice = true;
            } else {
                splice = false;
            }
        }
        if (splice) {
            matrix.splice(r, r + 1);
            r = 0;
        }
    }

    // Extract free matrix.
    var rank = matrix.length;
    for (var m = 0; m < rank; m++) {
        freeMatrix[m] = [];
        for (var n = rank; n < matrix[0].length; n++) {
            freeMatrix[m].push(-1 * matrix[m][n]);
        }
    }

    // Adding identity matrix.
    for (var e = 0; e < compounds.length - freeMatrix.length; e++) {
        freeMatrix.push([]);
        for (var f = 0; f < compounds.length - rank; f++) {
            if ((f / 2) == parseInt(f / 2)) {
                freeMatrix[e + rank].push(1);
            } else {
                freeMatrix[e + rank].push(0);
            }
        }
    }

    // Adding and converting into 1 column/row.
    for (var o = 0; o < freeMatrix.length; o++) {
        var value = 0;
        for (var p = 0; p < freeMatrix[0].length; p++) {
            value += freeMatrix[o][p];
        }
        finalMatrix.push(value);
    }

    // Multiply all to integers.
    var mul = 1;
    var testMul = 1;

    for (var g = 0; g < finalMatrix.length; g++) {
        var testInt = finalMatrix[g] * testMul;
        while (testInt != parseInt(testInt)) {
            testMul += 1;
            testInt = finalMatrix[g] * testMul;
        }
        if (testMul < mul) {
            mul = testMul;
        }
    }

    for (var h = 0; h < finalMatrix.length; h++) {
        finalMatrix[h] *= testMul;
    }

    // Get GCD.
    var gcd;

    for (var u = 0; u < finalMatrix.length - 1; u++) {
        gcd = getGCD(finalMatrix[u], finalMatrix[u + 1]);

    }

    // Get final answers.
    for (var w = 0; w < finalMatrix.length; w++) {
        finalMatrix[w] /= gcd;
        finalMatrix[w] = Math.abs(finalMatrix[w]);
        if (finalMatrix[w] != 1) {
            finalMatrix[w] += compounds[w][0];
        } else {
            finalMatrix[w] = compounds[w][0];
        }
    }

    return finalMatrix;
}

function getGCD(a, b) {
    if (!b) return a;
    return getGCD(b, a % b);
}
