document.cookie = "bg=light;";
var co;
update();
createTable();

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

function replaceCookie(setting, newSetting, index) {
	document.cookie = document.cookie
	.substring(0,document.cookie.indexOf(setting)+setting.length+1) + newSetting +
	document.cookie.substring(document.cookie.split(";",index).join(";").length)
}

function update() {
	var settings = {};
	var cookie = document.cookie;
	var cooked = cookie.split(";");

	for(var i = 0; i < cooked.length; i++) {
		var set = cooked[i].split("=");
		settings[set[0]] = set[1];
	}
	//get("body").style.backgroundImage = "url('./resources/static/" + settings["bg"] +".png')"

}

// Button Clicks

get("bg").onclick = function() {
	var bg = get("bg").childNodes[0].nodeValue;
	if(bg = "Dark") {
		replaceCookie("bg","light",1);
		get("bg").childNodes[0].nodeValue = "Light";
	} else {
		replaceCookie("bg","dark",1);
		get("bg").childNodes[0].nodeValue = "Dark";
	}
	update();
}

get("pulltab")[0].onclick = function(){open("sidebar 0");}
get("pulltab")[1].onclick = function(){open("sidebar 1");}
get("fa")[0].onclick = function(){close("sidebar 0");}
get("fa")[1].onclick = function(){close("sidebar 1");}

function open(div) {
	get(div).style.marginLeft = "0%";
}

function close(div) {
	get(div).style.marginLeft = "-60%";
}

function createTable() {
    var tbl = document.createElement('table');
    tbl.style.border = "1px hidden";
    for(var i = 0; i < 7; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 18; j++) {
            var td = tr.insertCell();
        }
    }
   	get("sidebar 0").appendChild(tbl);
    table = document.getElementsByTagName('table')[0];
}
