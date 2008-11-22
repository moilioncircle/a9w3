var lineHeight=16;

function initReader(){
	var html = "";
	html+="Pager: "+parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/read/article/0000.htm")+" read";
	html+="&nbsp;&nbsp;&nbsp;";
	html+="Album: "+parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/read/gallery/0000.htm")+" read";
	html+="</br></br>";
    document.getElementById("READER").innerHTML=html;
}

function initStatus(){
    var keys = ["admin","address","article","gallery","board","notice"];
    var html= "<table border='0' cellspacing='0' cellpadding='0' width='100%'>";
        html+="<tr height='"+lineHeight+"'><td width='60'>Channel</td><td width='30'>Cnt</td><td>Last Time</td></tr>";
	for(var i=0;i<keys.length;i++){
		html+="<tr height='"+lineHeight+"'>";
		html+="<td>"+keys[i]+"</td>";
        html+="<td>"+parent.W3GUI.STAT.getValue(keys[i]+".count")+"</td>";
		html+="<td>"+parent.W3GUI.STAT.getValue(keys[i]+".mtime")+"</td>";
		html+="</tr>";
	}
	html+="</table><br/>";
	document.getElementById("STATUS").innerHTML=html;
}

function initAction(){
	var html = "";
	var acts = parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"helpers/status/write/top30.htm");
	if(acts != null){
		var html= "<table border='0' cellspacing='0' cellpadding='0' width='100%'>";
		    html+="<tr height='"+lineHeight+"'><td width='20'>Id</td><td width='70'>Date</td><td>Name</td></tr>";
		var lines = acts.split(/[\r\n]+/).reverse();
		var cnt = lines.length>15?15:lines.length;
		for(var i=0;i<cnt;i++){
			var parts = lines[i].split("|");
			if(parts.length != 4) continue;
			var dt = parts[0];
			var at = parts[1];
			html+="<tr height='"+lineHeight+"'>";
			html+="<td>"+(i+1)+"</td>";
			html+="<td>"+dt.substr(0,8)+"</td>";
			html+="<td>"+at+"</td>";
			html+="</tr>";
		}
		html+="</table><br/>";
	}
	document.getElementById("ACTION").innerHTML=html;
}
initReader();
initStatus();
initAction();
