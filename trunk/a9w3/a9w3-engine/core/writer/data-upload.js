var str_image_only = parent.W3CNF.UPLOAD.getValue("image.only").toLowerCase();
var str_datum_deny = parent.W3CNF.UPLOAD.getValue("datum.deny").toLowerCase();
var arr_image_only = str_image_only.split(/[\t ]*,[\t ]*/);
var arr_datum_deny = str_datum_deny.split(/[\t ]*,[\t ]*/);

function checkImageOnly(fn){
    if(fn == null) return false;
    fn = getExtnameOfFile(fn);
    for(var i=0;i<arr_image_only.length;i++){
        if(fn == arr_image_only[i]){
            return true;
        }
    }
    alert(parent.W3CNF.getI18nString("warn.upload.only")+"\n"+str_image_only);
    return false;
}

function checkDatumDeny(fn){
    if(fn == null) return true;
    fn = getExtnameOfFile(fn);
    for(var i=0;i<arr_datum_deny.length;i++){
        if(fn == arr_datum_deny[i]){
            alert(parent.W3CNF.getI18nString("warn.upload.deny")+"\n"+str_datum_deny);
            return false;
        }
    }
    return true;
}

function getExtnameOfFile(fn){
    var lp = fn.lastIndexOf(".");
    if(lp<0) return "";
    return fn.substr(lp+1).toLowerCase();
}

function checkReplyCode(cd){
    var fn = null;
    if(cd == "warn.upload.only"){
        fn = str_image_only;
    }else if(cd == "warn.upload.deny"){
        fn = str_datum_deny;
    }
    
    if(fn == null){
        return false;
    }else{
        alert(parent.W3CNF.getI18nString(cd)+"\n"+fn);
        return true;
    }
}
