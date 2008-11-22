var lineHeight=16;

parent.W3GUI.asyncLoadText(function(t){
	var html = "";
    if(t != null){
    	//20081122114739|admin.login||127.0.0.9
        var html= "<table border='0' cellspacing='0' cellpadding='0' width='100%'>";
            html+="<tr height='"+lineHeight+"'><td width='20'>Id</td><td width='130'>Date</td><td>Name</td><td>PID</td><td>From</td></tr>";
        var lines = t.split(/[\r\n]+/).reverse();
        for(var i=0;i<lines.length;i++){
            var parts = lines[i].split("|");
            if(parts.length != 4) continue;
            html+="<tr height='"+lineHeight+"'>";
            html+="<td>"+(i+1)+"</td>";
            html+="<td>"+parts[0]+"</td>";
            html+="<td>"+parts[1]+"</td>";
            html+="<td>"+parts[2]+"</td>";
            html+="<td>"+parts[3]+"</td>";
            html+="</tr>";
        }
        html+="</table><br/>";
    }
    document.getElementById("ACTION").innerHTML=html;
},parent.W3CNF.USERHOME+"helpers/status/write/event.htm")