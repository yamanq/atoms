document.cookie = "theme=dark";
document.cookie = "tbTheme=category";
document.cookie = "unit=K";
document.cookie = "elecConf=abr";

var settings = {};
var reader = new FileReader();
var xhr = new XMLHttpRequest();
var info;

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

/*function replaceCookie(setting, newSetting, index) {
	document.cookie = document.cookie
	.substring(0,document.cookie.indexOf(setting)+setting.length+1) + newSetting +
	document.cookie.substring(document.cookie.split(";",index).join(";").length);
}*/

function update() {
	var cookie = document.cookie;
	var cooked = cookie.split(";");

	for(var i = 0; i < cooked.length; i++) {
		var set = cooked[i].split("=");
		settings[set[0].replace(" ","")] = set[1];
	}
}

function open(dom) {
	dom.style.marginLeft = "0%";
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
    }

}

function changeTheme(type) {
	var theme = {
		"pulltab": {'light': '#B3DAFF','dark': '#F33333'},
		"sidebar": {'light':'#E6F5FF','dark':'#FF5858'} 
	}
	get("body").style.backgroundImage = "url('./resources/static/" + type +".png')";

	get("pulltab")[0].style.backgroundColor = theme["pulltab"][type];
	get("pulltab")[1].style.backgroundColor = theme["pulltab"][type];
	get("sidebar")[0].style.backgroundColor = theme["sidebar"][type];
	get("sidebar")[1].style.backgroundColor = theme["sidebar"][type];
}

function tableTheme(theme) {
	var colorChart = {
		"category": {"al":'#8EF02B',"ae":"#D77A1D","md":"#387290","nm":"#52BFF6","ha":"#4842E9","ng":"#7B1AE9","tm":"#E5D439",
					 "bm":"#2ADEA8","lh":"#F02BBC","ac":"#D78A8A"}		
	};
	for(var i = 0;i < 118;i++) {
		get("td")[info["location"][i]].style.backgroundColor = colorChart[theme][info[theme][i]];
	}
}

function tableDesc() {
	var p = ["element","atomRadi","moleWeig","ioniEner","elecAffi","elecNega","phase","density","melting","boiling",
		 	 "oxidStat","elecConf"];
	var unit = [""," pm"," g/mol", " kJ/mol"," kJ/mol", " eV", "", " g/mL", "",""];
	var prefix = ["Element Name: ", "Atomic Radius: ", "Molecular Mass: ", "Ionization Energy: ", "Electron Affinity: ",
				  "Electronegativity: ", "Room Temperature Phase: ", "Density: ", "Melting Point: ", "Boiling Point: ",
				  "Oxidation State(s): ", "Electron Configuration: "];
	var states = {"g":"Gas","l":"Liquid","s":"Solid","Unknown":"Unknown"};

	for(var i = 0;i < p.length; i++) {
		elem = document.createElement("p");
		elem.className = "eDesc " + p[i];
	 	get("elements").appendChild(elem);
	}

	for(var i = 0;i < 118;i++) {
		var cell = get("td")[info["location"][i]];
		cell.onmouseenter = function() {
			index = parseInt(this.childNodes[0].childNodes[0].nodeValue-1);
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
		}
	}
}

function changeText(dom,text) {
	dom = get(dom);
	while (dom.firstChild) {
    	dom.removeChild(dom.firstChild);
	}
	dom.appendChild(document.createTextNode(" "));
	dom.childNodes[0].nodeValue = text;
}

// Button Clicks

get("theme").onclick = function() {
	var theme = get("theme").childNodes[0].nodeValue;
	console.log("hi");
	if(theme == "Dark") {
		//replaceCookie("theme","light",1);
		get("theme").childNodes[0].nodeValue = "Light";
	} else {
		//replaceCookie("theme","dark",1);
		get("theme").childNodes[0].nodeValue = "Dark";
	}
	update();
}

get("pulltab")[0].onclick = function(){open(get("elements"));}
get("pulltab")[1].onclick = function(){open(get("settings"));}
get("fa")[0].onclick = function(){
	get("elements").style.marginLeft = "-70%";
}
get("fa")[1].onclick = function(){
	get("settings").style.marginLeft = "-20%";
}



getJSON();
setTimeout(function mainFunc() {
	createTable();
	update();
	changeTheme(settings["theme"]);
	tableTheme(settings["tbTheme"]);
	tableDesc();
}, 600)	