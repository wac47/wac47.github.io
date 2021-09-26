




/*
     FILE ARCHIVED ON 11:35:52 10 12, 2007 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 9:57:55 1 20, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
function Is()
{
	var agent = navigator.userAgent.toLowerCase();
	this.major = parseInt(navigator.appVersion);
	this.minor = parseFloat(navigator.appVersion);
	this.ns  = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible') == -1)));
	this.ns4 = (this.ns && (this.major >= 4));
	this.ie   = (agent.indexOf("msie") != -1);
	this.ie4  = (this.ie && (this.major >= 4));

	this.opera   = (agent.indexOf("opera") != -1);

	this.win   = (agent.indexOf("win")!=-1);
	this.mac   = (agent.indexOf("mac")!=-1);
}