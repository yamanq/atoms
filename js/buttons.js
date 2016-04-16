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