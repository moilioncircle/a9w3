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

function onSitefp(){
    var url = parent.W3CNF.getServerURL("admin.sitefp");
    url = parent.W3GUI.wrapUID(url);
    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function onBackup(){
    var url = parent.W3CNF.getServerURL("admin.backup");
    url = parent.W3GUI.wrapUID(url);
    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function onSitemap()
{
    var url = parent.W3CNF.getServerURL("admin.sitemap");
    url = parent.W3GUI.wrapUID(url);

    var rtv = parent.A9Loader.syncLoadText(url);
    rtv = parent.W3TXT.trimEmpty(rtv);

    alert(parent.W3CNF.getI18nString(rtv));
}
function onLogout(){
    var url = parent.W3CNF.getServerURL("admin.logout");
    url = parent.W3GUI.wrapUID(url);

    var rtv = parent.A9Loader.syncLoadText(url);
    rtv = parent.W3TXT.trimEmpty(rtv);

    alert(parent.W3CNF.getI18nString(rtv));
    parent.W3GUI.onAdminLogout();
}

function onRenew(){
    var url = parent.W3CNF.getServerURL("admin.renew");
    url = parent.W3GUI.wrapUID(url);

    var rtv = parent.A9Loader.syncLoadText(url);
    rtv = parent.W3TXT.trimEmpty(rtv);

    alert(parent.W3CNF.getI18nString(rtv));
}

function isSimplePass(pass){
    if(pass == null || pass.length<10) return true;
    if(pass.replace(/[0-9a-zA-Z]/g,"").length<=0) return true;
    return false;
}

function initTimeOffet(){
    var url = parent.W3CNF.getServerURL("admin.sertime");
    url = parent.W3GUI.avoidClientCache(parent.W3GUI.wrapUID(url));
    var sertime = parent.A9Loader.syncLoadText(url);
    var lcltime = Math.floor((new Date()).getTime()/1000);
    //
    var seroffset = lcltime - sertime;
    var lcloffset = parent.A9Loader.syncLoadText(parent.W3CNF.USERHOME+"profile/timeoffset.htm");
    var obj = document.getElementById("__TIME_OFFSET__");
    obj.innerHTML=lcloffset+"/"+seroffset;
}

initTimeOffet();