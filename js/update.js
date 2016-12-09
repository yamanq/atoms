function changeTheme(type) {
    // Changes background image
    get("body").style.backgroundImage = "url('/resources/static/" + type + ".png')";
    get("body").style.color = themeChart.font[type];
    // Changes interface element colors
    var i;
    for (i = 0; i < get("pulltab").length; i++) {
        get("pulltab")[i].style.backgroundColor = themeChart.pulltab[type];
        get("pulltab")[i].style.color = themeChart.font[type].replace(")", ",0)");
        get("pulltab")[i].onmouseover = function() {
            this.style.color = themeChart.font[type].replace(")", ",1)").replace("b", "ba");
        };
        get("pulltab")[i].onmouseleave = function() {
            this.style.color = themeChart.font[type].replace(")", ",0)").replace("b", "ba");
        };
        get("sidebar")[i].style.backgroundColor = themeChart.sidebar[type];
    }

    for (i = 0; i < get("selection").length; i++) {
        get("selection")[i].style.color = themeChart.font[type];
    }

    for(var x = 0; x < atoms.length; x++) {
        var currentatom = atoms[x];

        // Redo Colors
        var bgColor = getColor(settings.displayTheme, currentatom.general.index);

        currentatom.graphics.clear();
        currentatom.graphics.beginFill("0x" + bgColor.substring(1));
        currentatom.graphics.lineStyle(10, "0x" + changeColor(bgColor, 20).substring(1), 1);
        currentatom.graphics.drawCircle(0, 0, 90);

        currentatom.eyegraphics.clear();
        currentatom.eyegraphics.beginFill("0x" + changeColor(bgColor, -20).substring(1));
        currentatom.eyegraphics.lineStyle(3, "0xffffff");
        currentatom.eyegraphics.drawEllipse(15, -12, 8, 20);
        currentatom.eyegraphics.drawEllipse(-15, -12, 8, 20);

        //TODO Remake Maxwell-Boltzman
    }
}

function tableTheme(theme) {
    for (var i = 0; i < elementCount; i++) {
        // Changes background color of each cell
        if (document.getElementsByClassName("periodictable").length !== 0) {
            var index = get("periodictable")[info.location[i]];
            index.style.backgroundColor = getColor(theme, i);

            if (theme == "category") {
                index.childNodes[2].childNodes[0].nodeValue = "";
            } else if (theme == "melting" || theme == "boiling") {
                temperatureValue = convertUnit(info[theme][i], settings.unit);
                if (temperatureValue !== null) {
                    index.childNodes[2].childNodes[0].nodeValue = temperatureValue + "°";
                }

            } else {
                index.childNodes[2].childNodes[0].nodeValue = info[theme][i];
            }
        }
    }
    try {
        lastElement.click();
    } catch (err) {} // Last selection still selected when changing themes
}

function keyChange(theme) {
    if (document.getElementById("keylegend") !== null) {
        var rowlength = 3;

        document.getElementsByClassName("key")[0].removeChild(document.getElementById("keylegend"));

        var index = choices[1].indexOf(theme);
        // Create Table
        var tbl = document.createElement('table');
        // id for CSS
        tbl.id = "keylegend";
        if (theme == "category") {
            tbl.style.top = "10%";
            tbl.style.left = "16.5%";
        }
        for (var i = 0; i < Object.keys(keyColors[index]).length; i += rowlength) {
            var tr = tbl.insertRow();
            for (var x = 0; x < rowlength; x++) {
                if ((i + x) < Object.keys(keyColors[index]).length) {
                    var keycolor = tr.insertCell();
                    keycolor.className = "keycolor";
                    keycolor.style.backgroundColor = keyColors[index][Object.keys(keyColors[index])[i + x]];

                    var keyname = tr.insertCell();
                    keyvalue = document.createTextNode(Object.keys(keyColors[index])[i + x]);
                    keyname.appendChild(keyvalue);
                    keyname.className = "keyvalue";
                }
            }

        }
        get("key").appendChild(tbl);
    }
}

function legendChange(theme) {
    var units = ["", " pm", " g/mol", " kJ/mol", " kJ/mol", " eV", " g/mL", "", ""];

    // Title
    if (get("tabletitle").length !== 0) {
        var index = choices[1].indexOf(theme);
        var end;
        if (units[index] !== "") {
            end = choicesDisplay[1][index] + " (" + units[index] + " )";
        } else {
            end = choicesDisplay[1][index];
        }
        get("tabletitle").innerHTML = end;
    }

    if (colorChart[theme].length != 2) {
        get("legendholder").style.display = "none";
    } else {
        var newmin;
        var newmax;
        get("legendholder").style.display = "";
        var color1 = colorChart[theme][0];
        var color2 = colorChart[theme][1];

        if (theme === "melting" || theme === "boiling") {
            var unit = settings.unit;
            newmin = ranges[theme][0];
            newmax = ranges[theme][1];

            if (unit != "K") {
                newmin = convertUnit(newmin, unit);
                newmax = convertUnit(newmax, unit);
                unit = "°" + unit;
            }
            newmin = newmin + " " + unit;
            newmax = newmax + " " + unit;


        } else {
            newmin = ranges[theme][0] + " " + units[index];
            newmax = ranges[theme][1] + " " + units[index];
        }

        // if (get("legend").length !== 0) {

            get("legendholder").style.background = "linear-gradient(to right, " + color2 + "," + color1 + ")";

            get("minlegend").innerHTML = newmin;
            get("maxlegend").innerHTML = newmax;
        // }
    }
}
