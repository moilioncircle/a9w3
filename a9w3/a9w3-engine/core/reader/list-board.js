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
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
        init();
    }
}


function onSaveBoard(){
    if(document.getElementById("FROM").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("FROM").focus();
        return;
    }
    if(document.getElementById("CODE").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    
    if(document.getElementById("TEXT").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("TEXT").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("board.commit");
    url = parent.W3GUI.wrapUID(url);
    
    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function loadCode(){
    var url = parent.W3CNF.getServerURL("board.random");
    url = parent.W3GUI.avoidClientCache(parent.W3GUI.wrapUID(url));
    
    document.getElementById("__CODE__").src=url;
}

function init(){
    loadCode();
    parent.W3GUI.getBoardInfo(function(txt){
        document.getElementById("__BOARDINFO__").innerHTML=txt;
    });
    parent.W3GUI.getBoardLink(function(lst){
        document.getElementById("__BOARDSIZE__").innerHTML=lst==null?0:lst.length;
    });
}
// update
function update(){
    parent.W3GUI.getBoardLink(function(lst){
        document.getElementById("__BOARDSIZE__").innerHTML=lst==null?0:lst.length;
    });
}
//
init();

