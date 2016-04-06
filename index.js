var swchr = 1;
document.cookie = "bg=light;";

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

update();

get("bg").onclick = function() {
	swchr = swchr*-1;
	if(swchr == 1) {
		replaceCookie("bg","light",1);
		get("bg").childNodes[0].nodeValue = "Light";
	} else {
		replaceCookie("bg","dark",1);
		get("bg").childNodes[0].nodeValue = "Dark";
	}
	update();
}

function update() {
	var settings = {};
	var cookie = document.cookie;
	var cooked = cookie.split(";");

	for(var i = 0; i < cooked.length; i++) {
		var set = cooked[i].split("=");
		console.log(set);
		settings[set[0]] = set[1];
	}
	console.log(settings)
	get("body").style.backgroundImage = "url('./resources/static/" + settings["bg"] +".png')"

}

