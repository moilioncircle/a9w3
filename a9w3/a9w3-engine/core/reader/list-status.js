var lineHeight=16;
var splitbg = "#EFEFEF";
var blankbg = "#FFFFFF";

function initReader(){
	var html = [];
	html.push("Pager:"+parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/read/article/0000.htm"));
	html.push("&nbsp;&nbsp;");
	html.push("Album:"+parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/read/gallery/0000.htm"));
	html.push("</br>");
    document.getElementById("READER").innerHTML=html.join("");
}

function initStatus(){
    var keys = ["admin","address","article","gallery","board","notice"];
    var html = [];
    html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
    html.push("<tr height='"+lineHeight+"'><td width='80'>Channel</td><td width='40'>Cnt</td><td>Last Date</td></tr>");
	for(var i=0;i<keys.length;i++){
		html.push("<tr height='"+lineHeight+"' style='background-color:"+blankbg+"'>");
		html.push("<td>"+keys[i]+"</td>");
        html.push("<td>"+parent.W3GUI.STAT.getValue(keys[i]+".count")+"</td>");
		html.push("<td>"+parent.W3GUI.STAT.getValue(keys[i]+".mtime").substr(0,10)+"</td>");
		html.push("</tr>");
	}
	html.push("</table><br/>");
	document.getElementById("STATUS").innerHTML=html.join("");
}

function initAction(){
	var maxl =12;
	var html = [];
	var acts = parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/write/top30.htm");
	if(acts != null){
		html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
		html.push("<tr height='"+lineHeight+"'><td width='20'>Id</td><td width='70'>Date</td><td>Name</td></tr>");
		var lines = acts.split(/[\r\n]+/).reverse();
		var cnt = lines.length>maxl?maxl:lines.length;
        var j=1;
		for(var i=0;i<cnt;i++){
			var parts = lines[i].split("|");
			if(parts.length != 4) continue;
			var dt = parts[0];
			var at = parts[1];
            html.push("<tr height='"+lineHeight+"' style='background-color:"+(j%5 ==0?splitbg:blankbg)+"'>");
			html.push("<td>"+j+"</td>");
			html.push("<td>"+dt.substr(0,8)+"</td>");
			html.push("<td>"+at+"</td>");
			html.push("</tr>");
            j++;
		}
		html.push("</table><br/>");
	}
	document.getElementById("ACTION").innerHTML=html.join("");
}
initReader();
initStatus();
initAction();
