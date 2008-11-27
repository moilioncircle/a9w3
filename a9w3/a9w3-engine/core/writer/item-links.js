var linksId = "";
var regexpId=/^\d{14}$/;

function onAddLabel(){
    var lb = document.getElementById("__LBLNME__").value;
    if(lb == "" || lb == "default") return;
    var obj = document.getElementById("LABEL");
    var txt = obj.value;
    if(txt == ""){
        obj.value = lb;
    }else if (txt.indexOf(lb+" ") < 0 && txt.lastIndexOf(lb) != txt.length-lb.length){
        obj.value += " " + lb;
    }
}

function onDeleteLinks(){
    parent.W3GUI.deleteAddress(linksId);
}

function onSaveLinks(){
    if(document.getElementById("TITLE").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("TITLE").focus();
        return;
    }
    if(document.getElementById("ADDRS").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("ADDRS").focus();
        return;
    }
    if(document.getElementById("BRIEF").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("BRIEF").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("links.commit");
    url = parent.W3GUI.wrapUID(url)+"&PID="+linksId;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

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
        if(regexpId.test(rtv)){
            linksId = rtv;
            rtv="info.success";
            updateUI();
        }
        if(rtv == "info.success"){
            parent.W3GUI.commitAddress();
        }
        
        alert(parent.W3CNF.getI18nString(rtv));
    }
}

function updateUI(){
    //label
    var lblMap = parent.W3GUI.ADDRESS_LABEL.getKeyValClone();
    var lblObj = document.getElementById("__LBLNME__");
    var len = lblObj.length;
    for(var i=1;i<len;i++){
        lblObj.remove(1);
    }
    for(var k in lblMap){
        var opt=document.createElement("OPTION");
        opt.text=lblMap[k];
        opt.value=lblMap[k];
        try{
            lblObj.add(opt,null);
        }catch(e){
            lblObj.add(opt);
        }
    }
    document.getElementById("__BTN_DELETE__").disabled=false;
    
    if(linksId == null || !regexpId.test(linksId)) return;
    parent.W3GUI.getAddressItem(linksId,function(ai){
        document.getElementById("TITLE").value=ai.title;
        document.getElementById("ADDRS").value=ai.addrs;
        document.getElementById("LABEL").value=ai.lable.join(" ");
        document.getElementById("BRIEF").value=parent.W3TXT.line2text(ai.brief);
    });
}

function init(){
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0 && regexpId.test(url.substr(pos+1))){
        linksId = url.substr(pos+1);
    }
    updateUI();
}
//
init();

