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

for(var i = 0; i < options.length; i++) {
	get("help")[i].onclick = function() {
		var index = options.indexOf(this.parentNode.childNodes[9].id);
		get("helptext")[index].style.display = "block";
		get("helptab")[index].style.display = "block";
		setTimeout(function() {
			get("helptab")[index].style.opacity = "1";
			get("helptext")[index].style.opacity = "1";
		}, 1)
	}

	get("help")[i].onmouseleave = function() {
		var index = options.indexOf(this.parentNode.childNodes[9].id);
		get("helptab")[index].style.opacity = "0";
		setTimeout(function(){get("helptext")[index].style.opacity = "0";},100);
		setTimeout(function() {
			get("helptab")[index].style.display = "none";
			get("helptext")[index].style.display = "none";
		}, 300);
	}
}