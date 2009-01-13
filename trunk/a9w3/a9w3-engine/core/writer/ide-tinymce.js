var isReady = false;
function getText(){
    var text = null;
    if(tinyMCE.activeEditor != null){
        text = tinyMCE.activeEditor.getContent();
    }
    
    return addUTF8Meta(text);
}

function setText(text){
    if(!isReady){
        window.setTimeout(function(){setText(text)},500);
    }else{
        tinyMCE.activeEditor.setContent(text);
    }
}

function initEdit(docPath){
    var docPath = null;
    
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0){
        docPath = url.substr(pos+1);
    }
    tinyMCE.init({
       // General options
       mode : "exact",
       elements : "__ART_TEXT__",
       theme : "advanced",
       plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
       document_base_url:docPath,
       // Theme options
       theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
       theme_advanced_buttons2 : "search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
       theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,iespell,media,advhr,|,ltr,rtl",
       theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
       theme_advanced_toolbar_location : "top",
       theme_advanced_toolbar_align : "left",
       theme_advanced_statusbar_location : "bottom",
       //
       setup:function(ed){
          ed.onInit.add(function(ed){ isReady = true;});
       }
       });
}
// helper
function addUTF8Meta(text){
    if(text == null || text =="") return text;
    
    // replace \r to \n
    text = text.replace(/\r\n/g,"\n");
    text = text.replace(/\r/g,"\n");
    // add charset
    var regm = /<\s*meta\s+.*content\s*=\s*['"]\s*text\/html\s*;\s*charset\s*=\s*[\w\d-]+\s*['"]\s*\/?>/i;
    var pos = text.search(regm);
    if(pos>=0){
        text = text.replace(regm,"<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>");
    }else{
        var regh = /<\s*head\s*>/i;
        pos = text.search(regh);
        if(pos>=0){
            text = text.replace(regh,"<head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>");
        }else{
            text = "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+text;
        }
    }
    
    return text;
}
//
initEdit();