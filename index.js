// Global Variables
var settings = {};
var reader = new FileReader();
var xhr = new XMLHttpRequest();
var info;
var options = ["theme","tbTheme","atomTheme","elecConf","unit"];
var choices = [
	["light","dark"],["category"],["category"],["abr","norm"],["K","C","F"]
];
var choicesDisplay = [
	["Light","Dark"],["Category"],["Category"],["Abbreviated","Full"],["Kelvin","Celsius","Fahrenheit"],
];
var colorChart = {
	"category": {"al":'#8EF02B',"ae":"#D77A1D","md":"#387290","nm":"#52BFF6","ha":"#4842E9","ng":"#7B1AE9","tm":"#E5D439",
				 "bm":"#2ADEA8","lh":"#F02BBC","ac":"#D78A8A"}		
};

function getJSON() {		 
	xhr.open("GET","./resources/static/info.json", true);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        info = JSON.parse(xhr.responseText);
	    }
	}
	xhr.send(null);
}

function changeColor(hex, amt) {

    var usePound = false;

    if (hex[0] == "#") {
        hex = hex.slice(1);
        usePound = true;
    }
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
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function gradientColor(hex1, hex2, ratio) {


	// Splits hex1 into 3 pieces (2 char each)
	hex1 = hex1.replace("#", "").match(/.{1,2}/g);
	// Converts each one into int

	for (var i = 0; i <= 2; i++) {
		hex1[i] = parseInt(hex1[i], 16);
	}

	// Does above process for hex2

	hex2 = hex2.replace("#", "").match(/.{1,2}/g);

	for (var i = 0; i <= 2; i++) {
		hex2[i] = parseInt(hex2[i], 16);
	}

	// Creates end table for finished hex parts

	donetable = [];

	// Averages each of the three parts between hex1 and hex2

	for (var i = 0; i <= 2; i++) {

		// Weighted average to get exact gradient necessary and not average
		// Round to prevent weird hex decimal shenanigans
		val = Math.round((ratio) * hex1[i] + (1 - ratio) * hex2[i]);
		donetable[i] = val.toString(16);
	}

	// Rejoins hex and adds #
	done = "#" + donetable.join("");

	return done;
}

function get(name) {
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
	document.cookie = setting+"=; expires=Thu, 01 Jan 2000 00:00:00 GMT";
}

function update() {
	var cookie = document.cookie;
	var cooked = cookie.split(";");

	for(var i = 0; i < cooked.length; i++) {
		var set = cooked[i].split("=");
		settings[set[0].replace(" ","")] = set[1];
	}
	applyChanges();
}

function applyChanges() {
	changeTheme(settings["theme"]);
	tableTheme(settings["tbTheme"]);
}

function createTable() {
    var tbl = document.createElement('table');
    tbl.style.border = "1px hidden";
    tbl.className = "normal";
    for(var i = 0; i < 7; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 18; j++) {
            var td = tr.insertCell();
        }
    }
   	get("sidebar")[0].appendChild(tbl);

   	tbl = document.createElement('table');
    tbl.style.border = "1px hidden";
    tbl.className = "extension";
    for(var i = 0; i < 2; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 15; j++) {
            var td = tr.insertCell();
        }
    }
   	get("sidebar")[0].appendChild(tbl);

    cells = get("td");
    for(var i = 0;i < 118;i++) {
    	ele = document.createElement("p");
    	text = document.createTextNode(i+1);
    	ele.appendChild(text);
    	cells[info["location"][i]].appendChild(ele);
    	text = document.createTextNode(info["shorthand"][i]);
    	cells[info["location"][i]].appendChild(text);
    	cells[info["location"][i]].className = "atom";
    }

}

function changeTheme(type) {
	var theme = {
		"pulltab": {'light': '#B3DAFF','dark': '#F33333'},
		"sidebar": {'light':'#E6F5FF','dark':'#FF5858'} 
	};
	get("body").style.backgroundImage = "url('./resources/static/" + type +".png')";

	for(var i = 0; i < get("pulltab").length; i++) {
		get("pulltab")[i].style.backgroundColor = theme["pulltab"][type];
		get("sidebar")[i].style.backgroundColor = theme["sidebar"][type];
	}
}

function tableTheme(theme) {
	for(var i = 0;i < 118;i++) {
		get("td")[info["location"][i]].style.backgroundColor = colorChart[theme][info[theme][i]];
	}
}

function tableDesc() {
	var p = ["element","atomRadi","moleWeig","ioniEner","elecAffi","elecNega","phase","density","melting","boiling",
		 	 "oxidStat","elecConf"];
	var unit = [""," pm"," g/mol", " kJ/mol"," kJ/mol", " eV", "", " g/mL", "",""];
	var prefix = ["Element Name: ", "Atomic Radius: ", "Molecular Mass: ", "Ionization Energy: ", "Electron Affinity: ",
				  "Electronegativity: ", "Phase/State: ", "Density: ", "Melting Point: ", "Boiling Point: ",
				  "Oxidation State(s): ", "Electron Configuration: "];
	var states = {"g":"Gas","l":"Liquid","s":"Solid","Unknown":"Unknown"};

	var infoBox = document.createElement("div");
	infoBox.className = "infoBox";

	get("elements").appendChild(infoBox);
	var div = document.createElement("div");
	div.className = "info1";
	get("infoBox").appendChild(div);
	var div2 = document.createElement("div");
	div2.className = "info2";
	get("infoBox").appendChild(div2);

	for(var i = 0;i < p.length; i++) {
		elem = document.createElement("p");
		elem.className = "eDesc " + p[i];
		if(i <= 5) {
	 		get("info1").appendChild(elem);
		} else {
			get("info2").appendChild(elem);
		}
	}
	get("info2").appendChild(document.createElement("br"));

	box = document.createElement("div");
	box.className = "preview";
	get("infoBox").appendChild(box);

	for(var i = 0;i < 118;i++) {
		var cell = get("td")[info["location"][i]];

		cell.onclick = function() {
			var index = parseInt(this.childNodes[0].childNodes[0].nodeValue-1);
			for(var i = 0;i < p.length; i++) {
				if(i == 8 || i == 9) {
					if(info[p[i]][settings["unit"]][index] !== null) {
						changeText(p[i],prefix[i] + info[p[i]][settings["unit"]][index] + " " + settings["unit"]);
					} else {
						changeText(p[i],prefix[i] + "Unknown");
					}
				} else {
					if(info[p[i]][index] != null) {
						if(i == 6) {
							changeText(p[i],prefix[i] + states[info[p[i]][index]] + unit[i]);
						} else if(i == 10) {
							var para = get("oxidStat");
							while (para.firstChild) {
    							para.removeChild(para.firstChild);
							}
							var allStates = info[p[i]][index];
							para.appendChild(document.createTextNode(prefix[i]));

							for(var j = 0;j < allStates.length; j++) {
								oxidStat = allStates[j];
								if(allStates[j].includes("b")) {
									oxidStat = allStates[j].substring(1);
									var bold = document.createElement("b");
									bold.appendChild(document.createTextNode(oxidStat));
									para.appendChild(bold);
									para.appendChild(document.createTextNode(", "));
								} else {
									para.appendChild(document.createTextNode(oxidStat));
									para.appendChild(document.createTextNode(", "));
								}
							}
							para.removeChild(para.lastChild);
						} else if(i == 11) {
							var para = get("elecConf"); 
							while (para.firstChild) {
    							para.removeChild(para.firstChild);
							}

							var elecConf = info[p[i]][index].split(".");
							para.appendChild(document.createTextNode(prefix[i]));

							if(settings["elecConf"] == "abr") {
								for(var j = 0;j < elecConf.length-1; j+=2) {
									para.appendChild(document.createTextNode(elecConf[j]));
									var sup = document.createElement("sup");
									sup.appendChild(document.createTextNode(elecConf[j+1]));
									para.appendChild(sup);
								}
							} else if(settings["elecConf"] == "norm"){
								while(elecConf[0].includes("[")) {
									otherConf = info[p[i]][info["shorthand"].indexOf(elecConf[0].substring(1,3))].split(".");
									elecConf[0] = elecConf[0].substring(4);
									for(var j = otherConf.length-1; j >= 0; j--) {
										elecConf.unshift(otherConf[j]);
									}	
								}
								for(var j = 0;j < elecConf.length-1; j+=2) {
									if(j == 20) {
										para.appendChild(document.createElement("br"))
									}
									para.appendChild(document.createTextNode(elecConf[j]));
									var sup = document.createElement("sup");
									sup.appendChild(document.createTextNode(elecConf[j+1]));
									para.appendChild(sup);
								}
							}
						} else {
							changeText(p[i],prefix[i] + info[p[i]][index] + unit[i]);
						}
						
					} else {
						changeText(p[i],prefix[i] + "Unknown");
					}
				}
			}
			try { get("preview").removeChild(get("preview").firstChild); } catch(err){}
			get("preview").appendChild(getAtomDOM(index,get("preview").style.height = window.innerHeight/3.8));
					
		}
	}
}

function changeText(dom,text) {
	var dom = get(dom);
	while (dom.firstChild) {
    	dom.removeChild(dom.firstChild);
	}
	dom.appendChild(document.createTextNode(" "));
	dom.childNodes[0].nodeValue = text;
}

function getAtomDOM(atomNum, size) {
	var holder = document.createElement("div");
	holder.style.position = "relative";
	holder.style.height = size;
	holder.style.width = size;

	var atom = document.createElement("img");
	atom.src = "./resources/reactive/Ring" + info["valeElec"][atomNum] + ".gif";
	atom.style.height = size;
	atom.style.width = size;
	atom.style.position = "absolute";
	atom.style.top = "0";
	atom.style.left = "0";

	var circle = document.createElement("div");
	circle.style.borderRadius = "50%";
	circle.style.height = size*0.8;
	circle.style.width = size*0.8;
	circle.style.margin = "0 auto";
	circle.style.position = "absolute";
	circle.style.top = size*0.1;
	circle.style.left = size*0.1;
	circle.style.backgroundColor = colorChart[settings["atomTheme"]][info[settings["atomTheme"]][atomNum]];

	var sh = document.createElement("p");
	sh.appendChild(document.createTextNode(info["shorthand"][atomNum]));
	sh.className = "sh";

	circle.appendChild(sh);
	
	holder.appendChild(circle)
	holder.appendChild(atom);

	return holder;
}

// Button Clicks

get("pulltab")[0].onclick = function(){open(get("elements"));}
get("pulltab")[1].onclick = function(){open(get("settings"));}
get("fa")[0].onclick = function(){
	get("elements").style.marginLeft = "-150%";
}
get("fa")[1].onclick = function(){
	get("settings").style.marginLeft = "-40%";
}

function open(dom) {
	dom.style.marginLeft = "0%";
}

function makeSettings() {
	for(var i = 0; i<options.length;i++) {
		var parent = get("option")[i];
		var text = document.createElement("p");
		text.appendChild(document.createTextNode(choicesDisplay[i][choices[i].indexOf(settings[parent.id])]))
		parent.appendChild(text);
		var holder = document.createElement("div");
		holder.className = "dropdown";

		parent.appendChild(holder);
		parent.onclick = function() {
			this.childNodes[1].style.opacity = "1";
		}
		holder.onmouseleave = function() {
			this.style.opacity = "0";
		}
		for(var j = 0;j < choices[i].length;j++) {
			var p = document.createElement("p");
			p.className = i.toString() + j.toString();
			p.appendChild(document.createTextNode(choicesDisplay[i][j]))
			holder.appendChild(p);
			p.onclick = function() {
				setting = this.parentNode.parentNode.id;
				this.parentNode.parentNode.childNodes[0].childNodes[0].nodeValue = this.innerHTML;
				this.parentNode.style.opacity = "0"; // Doesn't work, no idea why. Perhaps you can't change style of parent nodes?
				deleteCookie(setting);
				document.cookie = setting+"="+choices[parseInt(this.className[0])][parseInt(this.className[1])];
				update();
			}
		}
	}
}

if(document.cookie == "") {
	document.cookie = "theme=light";
	document.cookie = "tbTheme=category;";
	document.cookie = "atomTheme=category;";
	document.cookie = "elecConf=abr;";
	document.cookie = "unit=K;"
}

getJSON();

setTimeout(function mainFunc() {
	createTable();
	update();
	makeSettings();
	tableDesc();
}, 600)	