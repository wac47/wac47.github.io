
var home1		= new Image();
home1.src		= "../../meta/img/nav/home1.gif";
var home2		= new Image();
home2.src		= "../../meta/img/nav/home2.gif";
var news1		= new Image();
news1.src		= "../../meta/img/nav/news1.gif";
var news2		= new Image();
news2.src		= "../../meta/img/nav/news2.gif";
var business1	= new Image();
business1.src	= "../../meta/img/nav/business1.gif";
var business2	= new Image();
business2.src	= "../../meta/img/nav/business2.gif";
var regional1	= new Image();
regional1.src	= "../../meta/img/nav/regional1.gif";
var regional2	= new Image();
regional2.src	= "../../meta/img/nav/regional2.gif";
var jediwatch1	= new Image();
jediwatch1.src	= "../../meta/img/nav/jediwatch1.gif";
var jediwatch2	= new Image();
jediwatch2.src	= "../../meta/img/nav/jediwatch2.gif";
var sports1		= new Image();
sports1.src		= "../../meta/img/nav/sports1.gif";
var sports2		= new Image();
sports2.src		= "../../meta/img/nav/sports2.gif";
var life1		= new Image();
life1.src		= "../../meta/img/nav/life1.gif";
var life2		= new Image();
life2.src		= "../../meta/img/nav/life2.gif";
var archive1	= new Image();
archive1.src	= "../../meta/img/nav/archive1.gif";
var archive2	= new Image();
archive2.src	= "../../meta/img/nav/archive2.gif";

function highNav(img) {

	document[img].src = eval(img + "2.src");
}


function unhighNav(img) {

	document[img].src = eval(img + "1.src");
}