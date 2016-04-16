function tableDesc() {
	var p = ["element","atomRadi","moleWeig","ioniEner","elecAffi","elecNega","phase","density","melting","boiling",
		 	 "oxidStat","elecConf"];
	var unit = [""," pm"," g/mol", " kJ/mol"," kJ/mol", " eV", "", " g/mL", "",""];
	var prefix = ["Element Name: ", "Atomic Radius: ", "Molecular Mass: ", "Ionization Energy: ", "Electron Affinity: ",
				  "Electronegativity: ", "Phase/State: ", "Density: ", "Melting Point: ", "Boiling Point: ",
				  "Oxidation State(s): ", "Electron Configuration: "];
	var states = {"g":"Gas","l":"Liquid","s":"Solid","Unknown":"Unknown"};

	// Setting up divs for organization
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

	// Creates 'reactivity' for each cell
	for(var i = 0;i < 118;i++) {
		var cell = get("td")[info["location"][i]]; // Gets location of each atom in order

		cell.onclick = function() {
			var index = parseInt(this.childNodes[0].childNodes[0].nodeValue-1); 
			for(var i = 0;i < p.length; i++) { // Loop through all data types to be displayed
				if(i == 8 || i == 9) { // If data type is melting or boiling
					if(info[p[i]][settings["unit"]][index] !== null) {
						// Get prefix ex. Atomic Radius: + actual value + unit
						changeText(p[i],prefix[i] + info[p[i]][settings["unit"]][index] + " " + settings["unit"]);
					} else { // If null
						changeText(p[i],prefix[i] + "Unknown"); // Make unknown
					}
				} else {
					if(info[p[i]][index] != null) { // If data type value isn't null
						if(i == 6) { // If data type is phase/state
							// Get prefix + value reference ex. 'g' -> 'Gas' + unit
							changeText(p[i],prefix[i] + states[info[p[i]][index]] + unit[i]); 
						} else if(i == 10) { // If data type is oxidation states
							var para = get("oxidStat");

							// Remove all childs in oxidation state div
							while (para.firstChild) {
    							para.removeChild(para.firstChild);
							}

							var allStates = info[p[i]][index];
							var para1 = document.createElement("span");
							para1.appendChild(document.createTextNode(prefix[i]));
							para.appendChild(para1);

							for(var j = 0;j < allStates.length; j++) { // For all states in array
								oxidStat = allStates[j];
								if(j == 6) { // Add new line to prevent overflow
									para.appendChild(document.createElement("br"))
								}
								if(allStates[j].includes("b")) { // If value has b, make value different
									oxidStat = allStates[j].substring(1);
									var par = document.createElement("p");
									par.appendChild(document.createTextNode(oxidStat));
									par.className = "oxid common";
									para.appendChild(par);
									var par = document.createElement("span");
									par.className = "comma"
									par.appendChild(document.createTextNode(", "))
									para.appendChild(par);
								} else {
									var pa = document.createElement("p");
									pa.appendChild(document.createTextNode(oxidStat));
									pa.className = "oxid";
									para.appendChild(pa);
									pa = document.createElement("span");
									pa.className = "comma"
									pa.appendChild(document.createTextNode(", "))
									para.appendChild(pa);
								}
							}
							para.removeChild(para.lastChild); // Remove last comma
						} else if(i == 11) { // If data type is electron configuration
							var para = get("elecConf"); 

							// Remove all childs in electron configuration div
							while (para.firstChild) {
    							para.removeChild(para.firstChild);
							}

							var elecConf = info[p[i]][index].split("."); // Ex. ["1s", "2", "2s", "2"]
							para.appendChild(document.createTextNode(prefix[i]));

							if(settings["elecConf"] == "abr") {
								// Add 2 to get to next non superscript and subtract one to prevent undefined
								for(var j = 0;j < elecConf.length-1; j+=2) { 
									para.appendChild(document.createTextNode(elecConf[j])); // Append electron level
									// Append value for level in superscript
									var sup = document.createElement("sup"); 
									sup.appendChild(document.createTextNode(elecConf[j+1])); 
									para.appendChild(sup);
								}

							} else if(settings["elecConf"] == "norm") {
								while(elecConf[0].includes("[")) { // Ex: [Xe]5s2 
									// Get ex. [Xe] configuration
									otherConf = info[p[i]][info["shorthand"].indexOf(elecConf[0].substring(1,3))].split(".");
									elecConf[0] = elecConf[0].substring(4); // [Xe]5s2 = 5s2
									for(var j = otherConf.length-1; j >= 0; j--) { 
										// Put configuration of abbreviation in front of last configuration
										elecConf.unshift(otherConf[j]); 
									}	
								}

								// Add 2 to get to next non superscript and subtract one to prevent undefined
								for(var j = 0;j < elecConf.length-1; j+=2) {
									if(j == 20) { // Add new line to prevent overflow
										para.appendChild(document.createElement("br"))
									}
									para.appendChild(document.createTextNode(elecConf[j])); // Append electron level
									var sup = document.createElement("sup");
									// Append value for level in superscript
									sup.appendChild(document.createTextNode(elecConf[j+1]));
									para.appendChild(sup);
								}
							}
						} else { // If not special data type 
							changeText(p[i],prefix[i] + info[p[i]][index] + unit[i]); 
						}
						
					} else { // If null
						changeText(p[i],prefix[i] + "Unknown");
					}
				}
			} // Remove all childs in preview, then get new atom div
			try { get("preview").removeChild(get("preview").firstChild); } catch(err){}
			get("preview").appendChild(getAtomDOM(index,window.innerHeight/3.8));
					
		}
	}
}

function changeText(dom,text) {
	var dom = get(dom);
	// Remove all childs in div
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
	circle.style.borderRadius = "50%"; // Creates circle
	circle.style.height = size*0.8;
	circle.style.width = size*0.8;
	circle.style.margin = "0 auto";
	circle.style.position = "absolute";
	circle.style.top = size*0.1;
	circle.style.left = size*0.1;
	
	circle.style.backgroundColor = getColor(settings["displayTheme"],atomNum);

	var sh = document.createElement("p");
	sh.appendChild(document.createTextNode(info["shorthand"][atomNum]));
	sh.className = "sh";

	circle.appendChild(sh);
	
	holder.appendChild(circle)
	holder.appendChild(atom);

	return holder;
}

function getColor(theme, atomNum) {
	if(theme == "category") {
		var color = colorChart[theme][info[theme][atomNum]];	
	} else if(theme == "melting" || theme == "boiling") { 
		if(info[theme]["K"][atomNum] == null) { // if value is null
			color = "#41484D";
		} else {
			// Value - Min(all values) / Max(all values) - Min(all values)
			var ratio = (info[theme]["K"][atomNum] - Math.min.apply(null,info[theme]["K"])) / (Math.max.apply(null,info[theme]["K"]) - Math.min.apply(null,info[theme]["K"]));
			var color = gradientColor(colorChart[theme][0],colorChart[theme][1], ratio); // high, low, ratio
		}	
	} else {
		if(info[theme][atomNum] == null) { // if value is null
			color = "#41484D";
		} else {
			// Value - Min(all values) / Max(all values) - Min(all values)
			var ratio = (info[theme][atomNum] - Math.min.apply(null,info[theme])) / (Math.max.apply(null,info[theme]) - Math.min.apply(null,info[theme]));
			var color = gradientColor(colorChart[theme][0],colorChart[theme][1], ratio); 
		}
	}

	return color;
}

function makeSettings() {
	for(var i = 0; i < options.length;i++) {
		var parent = get("option")[i]; 
		var text = document.createElement("p");
		// Create text of current settings choice for this option 
		text.appendChild(document.createTextNode(choicesDisplay[i][choices[i].indexOf(settings[parent.id])]))
		parent.appendChild(text);
		var holder = document.createElement("div"); //Dropdown choice holder div
		holder.className = "dropdown";

		parent.appendChild(holder);
		parent.onclick = function() {
			// Make visible
			this.childNodes[1].style.opacity = "1";
			this.childNodes[1].style.display = "flex";
		}
		parent.onmouseleave = function() {
			// Make invisible
			this.childNodes[1].style.opacity = "0";
			this.childNodes[1].display = "none";
		}
		holder.onmouseleave = function() {
			// Make invisible
			this.style.opacity = "0";
			this.style.display = "none";
		}
		for(var j = 0;j < choices[i].length;j++) { // For all choices, append div for choice selection
			var p = document.createElement("p");
			p.className = i.toString() + j.toString(); 
			p.appendChild(document.createTextNode(choicesDisplay[i][j]))
			holder.appendChild(p);
			p.onclick = function() {
				// Change choice by changing cookie and text
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