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
    
    rtv = parent.W3TXT.trimEmpty(rtv);
    if(rtv != ""){
        alert(parent.W3CNF.getI18nString(rtv));
        if(rtv == "warn.pass.change" || rtv == "info.success"){
            parent.W3GUI.onAdminLogin();
        }else{
            loadCode();
            __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
        }
    }
}

function onLogin(){
    if(isSimplePass(document.getElementById("PASS").value)){
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("PASS").focus();
        return;
    }
    if(document.getElementById("CODE").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("admin.login");
    url = parent.W3GUI.wrapUID(url);
    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function onSwitch(){
    parent.W3GUI.onAdminLogin();
}

function isSimplePass(pass){
    if(pass == null || pass.length<10) return true;
    if(pass.replace(/[0-9a-zA-Z]/g,"").length<=0) return true;
    return false;
}

function loadCode(){
    var url = parent.W3CNF.getServerURL("admin.random");
    url = parent.W3GUI.avoidClientCache(parent.W3GUI.wrapUID(url));

    document.getElementById("__CODE__").src=url;
}

loadCode();
