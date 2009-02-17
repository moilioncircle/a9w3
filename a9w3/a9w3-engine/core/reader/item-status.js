var lineHeight=16;
var splitbg = "#EFEFEF";
var blankbg = "#FFFFFF";

function listEvent(fn){
    if(fn ==null || fn == ""){
        fn = "inuse.htm";
    }
    parent.A9Loader.asyncLoadText(function(u,t){
    	var html = [];
        if(t != null){
        	//20081122114739|admin.login||127.0.0.9
            html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
            html.push("<tr height='"+lineHeight+"'><td width='40'>Id</td><td width='120'>Date</td><td>Name</td><td>PID</td><td>From</td></tr>");
            var j=1;
            var lines = t.split(/[\r\n]+/).reverse();
            for(var i=0;i<lines.length;i++){
                var parts = lines[i].split("|");
                if(parts.length != 4) continue;
                html.push("<tr height='"+lineHeight+"' style='background-color:"+(j%5 ==0?splitbg:blankbg)+"'>");
                html.push("<td>"+j+"</td>");
                html.push("<td>"+parts[0]+"</td>");
                html.push("<td>"+parts[1]+"</td>");
                html.push("<td>"+parts[2]+"</td>");
                html.push("<td>"+parts[3]+"</td>");
                html.push("</tr>");
                j++;
            }
            html.push("<tr height='"+lineHeight+"'><td width='40'></td><td width='120'></td><td></td><td></td><td></td></tr>");
            html.push("</table>");
        }
        document.getElementById("ACTION").innerHTML=html.join("");
    },parent.W3CNF.USERHOME+"helpers/status/write/"+fn);
}

function initIndex(){
    parent.A9Loader.asyncLoadText(function(u,t){
    	var html = [];
        if(t != null){
            html.push("<select onchange='listEvent(this.value)'>");
            var lines = t.split(/[\r\n]+/).reverse();
            for(var i=0;i<lines.length;i++){
                html.push("<option value=\""+lines[i]+"\">"+lines[i]+"</option>");
            }
            html.push("</select>");
            
            document.getElementById("INDEX").innerHTML=html.join("");
        }
    },parent.W3CNF.USERHOME+"helpers/status/write/index.htm");
}

//
initIndex();
listEvent();