var lineHeight=16;
var splitbg = "#EFEFEF";
var blankbg = "#FFFFFF";
var datexbg = "#DDDDEF";

var isStop = true;
var isHead = false;
var typeHr = '';
var dateFr = new Date(1234567800000); // default date
var dateTo = new Date(1234567800000); // default date

var HEAD_POOL = {};

function getHead(tp,pid){
    if(!isHead) return pid;
    var pk = tp+pid;
    if(HEAD_POOL[pk] == null){
        var url,key;
        if(tp == 'article'){
            key = 'title';
            url = parent.W3CNF.USERHOME+tp+"/"+pid+"/head.htm";
        }else if(tp == 'gallery'){
            key = 'brief';
            url = parent.W3CNF.USERHOME+tp+"/info/"+pid+".htm";
        }else{
            return pid;
        }
        var txt = parent.A9Loader.syncLoadText(url);
        var tmp = txt.split(/[\r\n]/);
        for(var i=0; i<tmp.length; i++){
            if(tmp[i].indexOf(key)>=0){
                var pos = tmp[i].indexOf("=");
                HEAD_POOL[pk] = pos>0?(tmp[i].substr(pos+1).replace(/^[ \t]+/g,"")):pid;
                break;
            }
        }
    }
    return HEAD_POOL[pk];
}

function stopLoad(){
    isStop = true;
}

function listEvent(){
    try{
        dateFr.setFullYear(document.getElementById("__Y4_FM__").value);
        dateFr.setMonth(document.getElementById("__M2_FM__").value);
        dateFr.setDate(document.getElementById("__D2_FM__").value);
        
        dateTo.setFullYear(document.getElementById("__Y4_TO__").value);
        dateTo.setMonth(document.getElementById("__M2_TO__").value);
        dateTo.setDate(document.getElementById("__D2_TO__").value);
        dateTo.setDate(dateTo.getDate() + 1);
        
        typeHr = document.getElementById("__TYPE__").value;
    }catch(E){
        alert("bad [from:"+dateFr+"] or [to:"+dateTo+"]");
        return;
    }
    isStop = false;
    isHead = document.getElementById("__HEAD__").checked;
    document.getElementById("__SHOW__").disabled = !isStop;
    document.getElementById("__STOP__").disabled = isStop;
    document.getElementById("ACTION").innerHTML = "";
    loadData();
}

function loadData(){
    var dstr = dateFr.getFullYear()+"/"+
        (dateFr.getMonth()<9?('0'+(dateFr.getMonth()+1)):(dateFr.getMonth()+1))+"/"+
        (dateFr.getDate()<10?('0'+dateFr.getDate()):dateFr.getDate());
    var uhd = parent.W3CNF.USERHOME+"helpers/status/stat/";
    var uft = "/date/"+dstr+"-log.htm";
    var durl = [];
    if(typeHr == ''){
        durl.push(uhd+"article"+uft);
        durl.push(uhd+"gallery"+uft);
    }else{
        durl.push(uhd+typeHr+uft);
    }
    
    parent.A9Loader.asyncLoadText(function(us,ts){
        var html = [];
        var tcnt = 0;
        for(var x=0;x<ts.length;x++){
            if(ts[x] == null) continue;
            hasx = true;
            var tp = us[x].substring(uhd.length,us[x].lastIndexOf(uft));
            //2009/0113075318|20090202133859|59.46.193.226
            var lines = ts[x].split(/[\r\n]+/);
            for(var i=0;i<lines.length;i++){
                var parts = lines[i].split("|");
                if(parts.length != 3) continue;
                tcnt++;
                html.push("<tr height='"+lineHeight+"' style='background-color:"+(tcnt%5==0?splitbg:blankbg)+"'>");
                html.push("<td>&nbsp;"+tp+"</td>"); // type
                html.push("<td>&nbsp;"+getHead(tp,parts[0])+"</td>"); // pid
                html.push("<td>&nbsp;"+parts[1]+"</td>"); // time
                html.push("<td>&nbsp;"+parts[2]+"</td>"); // from
                html.push("</tr>");
            }
        }
        if(tcnt>0){
            html.push("</table>");
            var head = "<table border='0' cellspacing='1' cellpadding='2' width='100%'>"+
                       "<tr height='"+lineHeight+"' style='background-color:"+datexbg+"'><td width='120px'> + "+
                       dstr+"("+tcnt+")</td><td>pid</td><td width='100px'>time</td><td width='100px'>from</td></tr>";
            document.getElementById("ACTION").innerHTML+=head+html.join("");
        }
        
        dateFr.setDate(dateFr.getDate() + 1);
        if(!isStop && dateFr<dateTo){
            window.setTimeout(loadData,500);
        }else{
            isStop = true;
            document.getElementById("__SHOW__").disabled = !isStop;
            document.getElementById("__STOP__").disabled = isStop;
        }
        
    },durl);
}

function initIndex(){
    var myd = new Date();
    var y4 = myd.getFullYear();
    var mx = myd.getMonth();
    var dx = myd.getDate();
    
    var html = [];
    for(var i=2008;i<y4;i++){
        html.push("<option value='"+i+"'>"+i+"</option>");
    }
    html.push("<option value='"+y4+"' selected>"+y4+"</option>");
    var opy4 = html.join("");
    
    html = [];
    for(var i=0;i<12;i++){
        var v = i<9?('0'+(i+1)):(i+1);
        if(i == mx)
            html.push("<option value='"+i+"' selected>"+v+"</option>");
        else
            html.push("<option value='"+i+"'>"+v+"</option>");
    }
    var opm2 = html.join("");
    
    html = [];
    for(var i=1;i<=31;i++){
        var v = i<10?('0'+i):i;
        if(i == dx)
            html.push("<option value='"+i+"' selected>"+v+"</option>");
        else
            html.push("<option value='"+i+"'>"+v+"</option>");
    }
    var opd2 = html.join("");
    
    html = [];
    html.push("<select id='__TYPE__'>");
    html.push("<option value='' selected>all</option>");
    html.push("<option value='article'>article</option>");
    html.push("<option value='gallery'>gallery</option>");
    html.push("</select>");
    html.push(" : ");
    html.push("<select id='__Y4_FM__'>");
    html.push(opy4);
    html.push("</select>");
    html.push("<select id='__M2_FM__'>");
    html.push(opm2);
    html.push("</select>");
    html.push("<select id='__D2_FM__'>");
    html.push(opd2);
    html.push("</select>");
    html.push(" - ");
    html.push("<select id='__Y4_TO__'>");
    html.push(opy4);
    html.push("</select>");
    html.push("<select id='__M2_TO__'>");
    html.push(opm2);
    html.push("</select>");
    html.push("<select id='__D2_TO__'>");
    html.push(opd2);
    html.push("</select>");
    html.push("&nbsp;");
    html.push("<input type='button' id='__SHOW__' onclick='listEvent()' value='Show' style='font-size=12px; background-color:#99CCFF;'>");
    html.push("&nbsp;");
    html.push("<input type='button' id='__STOP__' onclick='stopLoad()' disabled value='Stop' style='font-size=12px; background-color:#FFCC99;'>");
    html.push("&nbsp;");
    html.push("<input type='checkbox' id='__HEAD__'><label for='__HEAD__'>Title(sync)</label>");
    document.getElementById("INDEX").innerHTML=html.join("");
}
//
initIndex();
listEvent();