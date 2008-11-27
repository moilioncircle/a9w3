function onDataResponse(){
    var rtv = "";
    if(__DATA_POSTER__.document.readyState){// onreadystatechange
        if(__DATA_POSTER__.document.readyState == "complete"){
            rtv = __DATA_POSTER__.document.body.innerHTML;
            __DATA_POSTER__.document.body.innerHTML = "";
        }
    }else{ // onload
        rtv = __DATA_POSTER__.document.body.innerHTML;
        __DATA_POSTER__.document.body.innerHTML = "";
    }
    
    if(rtv != ""){
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
        alert(parent.W3CNF.getI18nString(rtv));
    }
}

function onChpass(){
    if(isSimplePass(document.getElementById("PASS").value)){
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("PASS").focus();
        return;
    }
    if(isSimplePass(document.getElementById("NEWP").value)){
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("NEWP").focus();
        return;
    }
    
    if(document.getElementById("NEWP").value != document.getElementById("RENP").value){
        alert(parent.W3CNF.getI18nString("warn.pass.differ"));
        document.getElementById("RENP").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("admin.cpass");
    url = parent.W3GUI.wrapUID(url);

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function onLogout(){
    var url = parent.W3CNF.getServerURL("admin.logout");
    url = parent.W3GUI.wrapUID(url);

    var rtv = parent.A9Loader.syncLoadText(url);
    alert(parent.W3CNF.getI18nString(rtv));
    parent.W3GUI.onAdminLogout();
}

function isSimplePass(pass){
    if(pass == null || pass.length<10) return true;
    if(pass.replace(/[0-9a-zA-Z]/g,"").length<=0) return true;
    return false;
}
