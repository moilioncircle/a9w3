var lineHeight=16;
var splitbg = "#EFEFEF";
var blankbg = "#FFFFFF";

function initReader(){
    var myd = new Date();
    var y4 = myd.getFullYear();
    var m2 = myd.getMonth()<9?'0'+(myd.getMonth()+1):(myd.getMonth()+1);
    var d2 = myd.getDate()<10?'0'+myd.getDate():myd.getDate();
    var rUrls = [
        parent.W3CNF.USERHOME+"helpers/status/read/article/0000.htm",
        parent.W3CNF.USERHOME+"helpers/status/read/gallery/0000.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/article/year/" +y4+"-hit.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/gallery/year/" +y4+"-hit.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/article/month/"+y4+"/"+m2+"-hit.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/gallery/month/"+y4+"/"+m2+"-hit.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/article/date/" +y4+"/"+m2+"/"+d2+"-hit.htm",
        parent.W3CNF.USERHOME+"helpers/status/stat/gallery/date/" +y4+"/"+m2+"/"+d2+"-hit.htm"
    ];
    parent.A9Loader.asyncLoadText(function(urls,txts){
        var vals = [];
        for(var i=0;i<urls.length;i++){
            for(var j=0;j<rUrls.length;j++){
                if(urls[i] == rUrls[j]){
                    if(txts[i] != null && txts[i].length>0){
                        vals[j] = txts[i].replace(/\D+/,'');
                    }else{
                        vals[j]=0;
                    }
                    break;
                }
            }
        }
        
        var keys = ["total","year","month","today"];
        var html = [];
        html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
        html.push("<tr height='"+lineHeight+"'><td width='55'>Reader</td><td>Paper</td><td>Album</td></tr>");

        for(var i=0;i<keys.length;i++){
            html.push("<tr height='"+lineHeight+"' style='background-color:"+blankbg+"'>");
            html.push("<td>"+keys[i]+"</td>");
            html.push("<td>"+vals[i*2]+"</td>");
            html.push("<td>"+vals[i*2+1]+"</td>");
            html.push("</tr>");
        }
        html.push("</table>");
        document.getElementById("READER").innerHTML=html.join("");
    },rUrls);
}

function initStatus(){
    var keys = ["admin","address","article","gallery","board","notice"];
    var html = [];
    html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%'>");
    html.push("<tr height='"+lineHeight+"'><td width='60'>Channel</td><td width='50'>Count</td><td>Modified</td></tr>");
    for(var i=0;i<keys.length;i++){
        html.push("<tr height='"+lineHeight+"' style='background-color:"+blankbg+"'>");
        html.push("<td>"+keys[i]+"</td>");
        html.push("<td>"+parent.W3GUI.STAT.getValue(keys[i]+".count")+"</td>");
        html.push("<td>"+parent.W3GUI.STAT.getValue(keys[i]+".mtime").substr(0,10)+"</td>");
        html.push("</tr>");
    }
    html.push("</table>");
    document.getElementById("STATUS").innerHTML=html.join("");
}

function initAction(){
    var maxl =10;
    parent.A9Loader.asyncLoadText(function(url,acts){
        var html = [];
        if(acts != null){
            html.push("<table border='0' cellspacing='1' cellpadding='2' width='100%' style='overflow:hidden;'>");
            html.push("<tr height='"+lineHeight+"'><td width='20'></td><td width='70'>Date</td><td>Action</td></tr>");
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
            html.push("</table>");
        }
        document.getElementById("ACTION").innerHTML=html.join("");
    },parent.W3CNF.USERHOME+"helpers/status/write/top10.htm");
}
//
initReader();
initStatus();
initAction();
