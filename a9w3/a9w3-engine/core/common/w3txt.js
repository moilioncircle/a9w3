var W3TXT = {};

/** Item */
W3TXT.articleItem = function(map){
    this.id = null;
    this.title = "";
    this.lable = [];
    this.ctime = "";
    this.mtime = "";
    this.sizeb = 0;
    this.brief = "";
    this.views = 0;
    
    // init
    if(map != null){
        if(map["id"] != null) this.id = map["id"];
        if(map["title"] != null) this.title = map["title"];
        if(map["ctime"] != null) this.ctime = map["ctime"];
        if(map["mtime"] != null) this.mtime = map["mtime"];
        if(map["sizeb"] != null) this.sizeb = map["sizeb"];
        if(map["brief"] != null) this.brief = map["brief"];
        if(map["views"] != null) this.views = map["views"];
        
        var str = map["label"];
        if(str != null){
            var tmp = str.split(/[ \t]+/);
            for(var i=0; i<tmp.length; i++){
                if(tmp[i] != "")
                this.lable.push(tmp[i]);
            }
        }
    }
};

W3TXT.addressItem = function(map){
    this.id = null;
    this.title = "";
    this.lable = [];
    this.ctime = "";
    this.mtime = "";
    this.addrs = "";
    this.brief = "";
    
    // init
    if(map != null){
        if(map["id"] != null) this.id = map["id"];
        if(map["title"] != null) this.title = map["title"];
        if(map["ctime"] != null) this.ctime = map["ctime"];
        if(map["mtime"] != null) this.mtime = map["mtime"];
        if(map["addrs"] != null) this.addrs = map["addrs"];
        if(map["brief"] != null) this.brief = map["brief"];
        
        var str = map["label"];
        if(str != null){
            var tmp = str.split(/[ \t]+/);
            for(var i=0; i<tmp.length; i++) {
                if(tmp[i] != "")
                this.lable.push(tmp[i]);
            }
        }
    }
};


W3TXT.galleryItem = function(map){
    this.id = null;
    this.lable = [];
    this.sizeb = 0;
    this.ctime = "";
    this.ftype = "jpg";
    this.pixel = "0";
    this.brief = "";
    this.views = 0;
    // init
    if(map != null){
        if(map["id"] != null) this.id = map["id"];
        if(map["sizeb"] != null)this.sizeb = map["sizeb"];
        if(map["ctime"] != null)this.ctime = map["ctime"];
        if(map["ftype"] != null)this.ftype = map["ftype"];
        if(map["pixel"] != null)this.pixel = map["pixel"];
        if(map["brief"] != null)this.brief = map["brief"];
        if(map["views"] != null)this.views = map["views"];
        var str = map["label"];
        if(str != null){
            var tmp = str.split(/[ \t]+/);
            for(var i=0; i<tmp.length; i++) {
                if(tmp[i] != "")
                this.lable.push(tmp[i]);
            }
        }
    }
};

W3TXT.messageItem = function(map){
    this.id = null;
    this.time = "";
    this.user = "";
    this.from = "";
    this.text = "";
    // init
    if(map != null){
        if(map["id"] != null) this.id = map["id"];
        if(map["time"] != null)this.time = map["time"];
        if(map["user"] != null)this.user = map["user"];
        if(map["from"] != null)this.from = map["from"];
        if(map["text"] != null)this.text = map["text"];
    }
};

W3TXT.noticeItem = function(map){
    this.id = null;
    this.title = "";
    this.sizeb = 0;
    this.ctime = "";
    this.brief = "";
    // init
    if(map != null){
        if(map["id"] != null) this.id = map["id"];
        if(map["title"] != null)this.title = map["title"];
        if(map["sizeb"] != null)this.sizeb = map["sizeb"];
        if(map["ctime"] != null)this.ctime = map["ctime"];
        if(map["brief"] != null)this.brief = map["brief"];
    }
};

/** helper */
W3TXT.getKeyvalMap = function(t){
    if(t == null || t == "") return {};
    
    var map = {};
    var tmp = t.split(/[\r\n]/);
    for(var i=0; i<tmp.length; i++) {
        var pos = tmp[i].indexOf("=");
        if(pos <0) continue;
        var key = tmp[i].substr(0,pos).replace(/^[ \t]+/g,"").replace(/[ \t]+$/g,"");
        var val = tmp[i].substr(pos+1);
        map[key] = val;
    }
    return map;
}

W3TXT.text2line = function(text){
    if(text == null || text =="") return "";
    
    text = text.replace(/\\/g,"\\\\");
    text = text.replace(/\n/g,"\\n");
    text = text.replace(/\r/g,"\\r");
    
    return text;
};

W3TXT.line2text = function(line){
    if(line == null || line =="") return "";
    
    line = line.replace(/\\n/g,"\n");
    line = line.replace(/\\r/g,"\r");
    
    var i = line.indexOf("\\");
    var c="";
    var j=0;
    var buf = [];
    while(i>=0){
        if(i>0) buf.push(line.substring(j,i));
        for(j=i+1;j<line.length-1;j++){
            c = line.charAt(j);
            if(c != "\\") break;
        }
        if((j-i)%2 == 1){
            if(c == "\r") buf.push("\\r");
            else if (c == "\n") buf.push("\\n");
            else buf.push(c);
        }else{
            buf.push(line.substr(i,(j-i)/2));
        }
        
        i = line.indexOf("\\",j);
    }
    if(j<line.length) buf.push(line.substr(j));
    
    return buf.join('');
};

W3TXT.html2text = function(html){
    if(html == null || html =="") return "";
    
    html = html.replace(/&/g,"&amp;");
    html = html.replace(/</g,"&lt;");
    html = html.replace(/>/g,"&gt;");
    html = html.replace(/ /g,"&nbsp;");
    
    return html;
};

W3TXT.text2html = function(text){
    if(text == null || text =="") return "";
    
    text = text.replace(/&lt;/g,"<");
    text = text.replace(/&gt;/g,">");
    text = text.replace(/&nbsp;/g," ");
    text = text.replace(/&amp;/g,"&");
        
    return text;
};
W3TXT.trimEmpty = function(text){
    if(text == null || text =="") return "";
    text = text.replace(/[ ¡¡\t\r\n]+/g,"");
    return text;
};