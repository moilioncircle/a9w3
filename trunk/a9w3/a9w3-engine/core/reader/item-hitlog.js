var lineHeight=16;
var splitbg = "#EFEFEF";
var blankbg = "#FFFFFF";
var logpath="";

//
var url = self.location.href;
var pos = url.indexOf("?");
if(pos>0){
    logpath = url.substr(pos+1);
}

parent.A9Loader.asyncLoadText(function(u,t){
	var html = [];
    if(t != null){
    	//20081123131747|127.0.0.9
        html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
        html.push("<tr height='"+lineHeight+"'><td width='40'>Id</td><td width='150'>Date</td><td>IP</td></tr>");
        var j=1;
        var lines = t.split(/[\r\n]+/).reverse();
        for(var i=0;i<lines.length;i++){
            var parts = lines[i].split("|");
            if(parts.length != 2) continue;
            html.push("<tr height='"+lineHeight+"' style='background-color:"+(j%5 ==0?splitbg:blankbg)+"'>");
            html.push("<td>"+j+"</td>");
            html.push("<td>"+parts[0]+"</td>");
            html.push("<td>"+parts[1]+"</td>");
            html.push("</tr>");
            j++;
        }
        html.push("<tr height='"+lineHeight+"'><td width='40'></td><td width='150'></td><td></td></tr>");
        html.push("</table>");
    }
    document.getElementById("ACTION").innerHTML=html.join("");
},parent.W3CNF.USERHOME+"helpers/status/read/"+logpath+"-log.htm")