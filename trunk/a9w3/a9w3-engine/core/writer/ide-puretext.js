var textId = "__ART_TEXT__";
function getText(){
    var obj = document.getElementById(textId);
    return addUTF8Meta(obj.value);
}

function setText(text){
    if(text == null) return;
    
    var obj = document.getElementById(textId);
    obj.focus();
    obj.value=text;
}

function initEdit(){
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