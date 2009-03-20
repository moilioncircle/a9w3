/* 
dependence:
a9text/com/trydofor/a9js/code/b64.js
a9text/com/trydofor/a9js/code/aes.js
*/

var TEXT_CRYPT_TOKEN = "----------------------- a9-encrypted-text -----------------------";
var TEXT_CRYPT_REGEX = /(^\s*-----------------------+ a9-encrypted-text -----------------------+\s*)/;

var b64Impl  = new B64Class();
var aesImpl  = new AESClass();

function encryptText(text){
    if(text == null || text == "") return "";
    return TEXT_CRYPT_TOKEN+"\n"+enAes(text);
}

function decryptText(text){
    if(text == null || text == "") return "";
    
    if(TEXT_CRYPT_REGEX.test(text)){
        return deAes(text.substr(RegExp.$1.length));
    }else{
        return text;
    }
}

function enB64(text){
    if(text == null || text == "") return "";
    return format(b64Impl.encode(text));
}

function deB64(text){
    if(text == null || text == "") return "";
    return b64Impl.decode(text.replace(/\s/gm,''));
}

function enAes(text){
    if(text == null || text == "") return "";
    try{
        var passwd = window.prompt('please input your passwd','');
        if(passwd ==null || passwd =='') return "";
        
        var ot = b64Impl.encode(aesImpl.encrypt(text,passwd,256));
        return format(ot);
    }catch(e){
        alert("failed to get base64 encode:"+e);
    }
}

function deAes(text){
    if(text == null || text == "") return "";
    try{
        var passwd = window.prompt('please input your passwd','');
        if(passwd ==null || passwd =='') return "";
        
        return aesImpl.decrypt(deB64(text),passwd,256);
    }catch(e){
        alert("failed to get base64 decode:"+e);
    }
}

function format(text){
    if(text == null || text =='') return text;
    
    var linesize = 64;
    text = text.replace(/\s+/g,'');
    var rtxt = [];
    for(var i=0;i<text.length;i+=linesize){
        var line = (i+linesize<text.length)?text.substr(i,linesize):text.substr(i);
        rtxt.push(line);
    }
    
    return rtxt.join('\n');
}
