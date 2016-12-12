
//
// Atoms - molecular interactions simulator
// Copyright (C) 2016  Yaman Qalieh and Kenneth Jao

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

get("pulltab")[0].onclick = function(){open(get("elements"));};
get("pulltab")[1].onclick = function(){open(get("tools"));};
get("pulltab")[2].onclick = function(){open(get("settings"));};
get("fa")[0].onclick = function() {
	get("elements").style.marginLeft = "-150%";
}
get("fa")[1].onclick = function() {
	get("tools").style.marginLeft = "-170%";
}
get("fa")[2].onclick = function() {
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

get("balancebutton").onclick = function() {
	//Invalid form handling
	var reactants = get("reactant").value;
	var products = get("products").value;
	var reacNum = reactants.split("+").length-1;
	var final = "";
	var balanced = balanceEquation(get("reactant").value,get("product").value);

	for(var i = 0; i < balanced.length; i++) {
		if(i == reacNum) {
			final += balanced[i] + " -> ";
		} else {
			final += balanced[i] + " + ";
		}
	}
	final = final.substring(0,final.length-3);
	get("balanceout").value = final;
}
