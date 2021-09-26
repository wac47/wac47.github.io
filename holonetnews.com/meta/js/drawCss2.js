

// Draw Appropriate CSS File

browser_type = null;
var is = new Is();

if(is.opera) {
	document.write("<link rel='stylesheet' Type='text/css' href='../meta/css/holonet.css'>");
}
else if(is.ie) {
	document.write("<link rel='stylesheet' Type='text/css' href='../meta/css/holonet.css'>");
}
else if(is.ns) {
	document.write("<link rel='stylesheet' Type='text/css' href='../meta/css/holonet_ns.css'>");
}
else {
	document.write("<link rel='stylesheet' Type='text/css' href='../meta/css/holonet.css'>");
}


