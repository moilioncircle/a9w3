function getText(){
    var text = document.getElementById("__ART_TEXT__").value;
    if(document.getElementById('ENCRYPT_ALL').checked){
        text = encryptText(text);
    }
    return wrapA9text(text);
}

function setText(text){
    if(text == null) return;
    
    if(isA9text(text)){
        text = unwrapA9text(text);
    }
    text = decryptText(text);
    var obj = document.getElementById("__ART_TEXT__");
    obj.focus();
    obj.value=text;
}

function initEdit(){
    var btns = {
        mode:{
            "Blod":"[![|]]",
            "Italic":"[/[|]]",
            "Underline":"[_[|]]",
            "Delete":"[-[|]]",
            "Sup":"['[|]]",
            "Sub":"[,[|]]",
            "Fontsize":"[%150[|]]",
            "Fgcolor":"[#FFFFFF[|]]",
            "Bgcolor":"[&000000[|]]",
            "Join-Text":"[[<=|]]",
            "Join-Media":"[100*200[|<=file]]",
            "Join-Link":"[[<=|=>addr]]",
            "Join-Index":"|[[<=$INDEX]]",
            "Join-Para":"|[[<=$para]]",
            "Link(Mini)":"[[|=>addr]]",
            "Link(Stand)":"[[|=>addr]]",
            "Link(Anchor)":"[[|=>]]",
            "Link-SECT":"[[|=>#SECT:5.]]",
            "Link-DICT":"[[|=>#DICT:key]]",
            "Link-AREA":"[[|=>#AREA:name]]",
            "Link-HASH":"[[|=>#HASH:name]]",
            "Link-JOIN":"[[|=>#JOIN:name]]",
            "*HTML":"[*htm[|]]",
            "*Mixed":"[!/-%150#FF0000&00FF00[|]]"
              },
        line:{
            "Soft-1":"| \n",
            "Soft-2":"|\\\n",
            "1-size":"|\n--------------------\n",
            "2-size":"|\n====================\n",
            "4-size":"|\n####################\n"
             },
        dict:{
            "Stand":"\n|::val",
            "Colon":"\n|:::val",
            "NOTE":"\n[NOTE]::|",
            "WARN":"\n[WARN]::|"
             },
        list:{
            "Item-1":"\n*) |",
            "Item-1":"\n*  |",
            "Item-2":"\n+) |",
            "Item-2":"\n+  |",
            "Item-3":"\n-) |",
            "Item-3":"\n-  |",
            "Step-#":"\n#) |",
            "Step-1":"\n1. |",
            "Step-1":"\n1) |",
            "Step-a":"\na) |",
            "Step-a":"\na) |",
            "Step-A":"\nA) |",
            "Step-A":"\nA. |"
            },
        area:{
            "Text(mini)":"\n.................\n|\n.................\n",
            "Text(Stand)":"\n=============== text name:info =================\n|\n==========================================\n",
            "Table":"\n=============== table name:info =================\n|\n==========================================\n",
            "TTY":"\n=============== tty name:info =================\n|\n==========================================\n",
            "C":"\n=============== c name:info =================\n|\n==========================================\n",
            "C++":"\n=============== cpp name:info =================\n|\n==========================================\n",
            "Bash":"\n=============== bash name:info =================\n|\n==========================================\n",
            "SQL":"\n=============== sql name:info =================\n|\n==========================================\n",
            "B64":"\n=============== b64 name:info =================\n|\n==========================================\n",
            "AES":"\n=============== aes name:info =================\n|\n==========================================\n"
            },
        sect:{
            "^Title":"^Title\n^^^^^^^^^\n  - author:trydofor\n  - licence: gpl v2\n\n",
            "Hide-0.":"\n0. |\n^^^^^^^^^\n",
            "Level-1.":"\n1. |\n^^^^^^^^^\n",
            "Level-1.1.":"\n1.1. |\n^^^^^^^^^\n"
            }
    };
    buff = [];
    for(var kb in btns){
        buff.push("<select onchange='insertText(unescape(this.value))'>");
        buff.push("<option value=''>::"+kb+"::</option>");
        var btn = btns[kb];
        for(var ks in btn){
            buff.push("<option value=\""+escape(btn[ks])+"\">"+ks+"</option>");
        }
        buff.push("</select>");
    
    }
    
    //
    buff.push("&nbsp;<input id='ENCRYPT_ALL' type='checkbox'><label style='font-size:12px;color:green' for='ENCRYPT_ALL'>Encrypt!</label>");
    document.getElementById("__ART_BTNS__").innerHTML=buff.join("");
}

function insertText(t){
    if(t == "") return;
    
    var obj = document.getElementById("__ART_TEXT__");
    obj.focus();
    if(t.charAt(0)=="^"){
        obj.value = t.substr(1)+obj.value;
    }else if(obj.selectionStart && obj.selectionEnd){
        var at = obj.value;
        var st = at.substring(obj.selectionStart,obj.selectionEnd);
        obj.value = at.substring(0,obj.selectionStart)+mergeText(t,st)+at.substr(obj.selectionEnd);
    }else if(document.selection){
        var st=document.selection.createRange().text;
        if(st == null) st = "";
        document.selection.createRange().text = mergeText(t,st);
    }else{
        obj.value += mergeText(t,'');
    }
}

function mergeText(temp,text){
    try{
        if(temp.indexOf('b64')>0){
            text = enB64(text);
        }else if (temp.indexOf('aes')>0){
            text = enAes(text);
        }
    }catch(e){};
    return temp.replace("|",text);
}

// helper
function wrapA9text(text){
    if(text == null) text = "";
    
    // replace \r to \n
    text = text.replace(/\r\n/g,"\n");
    text = text.replace(/\r/g,"\n");
    // html
    text = text.replace(/&/g,"&amp;");
    text = text.replace(/</g,"&lt;");
    text = text.replace(/>/g,"&gt;");
    
    var buff = [];
    buff.push("<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />");
    buff.push("<pre>");
    buff.push(text);
    buff.push("</pre>");
    buff.push("<script type='text/javascript' src='../../../../../a9w3-engine/3rdp/a9text/a9loader.js'></script>");
    buff.push("<script type='text/javascript' src='../../../../../a9w3-engine/core/reader/item-a9text.js'></script>");
    return buff.join("\n");
}

function unwrapA9text(text){
    if(text == null) text = "";
    var pret = "<pre>";
    var pos1 = text.indexOf(pret);
    var pos2 = text.lastIndexOf("</pre>");
    if(pos1<0) pos1 = 0;
    else pos1 = pos1 + pret.length;
    if(pos2<0) pos2 = text.length;
    text = text.substring(pos1,pos2);
    text = text.replace(/&lt;/ig,"<");
    text = text.replace(/&gt;/ig,">");
    text = text.replace(/&amp;/ig,"&");
    text = text.replace(/^[\r\n]+/,"");
    text = text.replace(/[\r\n]+$/,"");
    return text;
}

initEdit();