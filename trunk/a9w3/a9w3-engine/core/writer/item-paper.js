var docPath = "";
var paperId = "";
var bodyTxt = "";
var regexpId=/^\d{4}\/\d{10}$/;

// event
function onAddLabel(){
    var lb = document.getElementById("__LBLNME__").value;
    if(lb == "" || lb == "default") return;
    var obj = document.getElementById("__LABEL__");
    var txt = obj.value;
    if(txt == ""){
        obj.value = lb;
    }else if (txt.indexOf(lb+" ") < 0 && txt.lastIndexOf(lb) != txt.length-lb.length){
        obj.value += " " + lb;
    }
}

function onDataChose(obj){
    if(!checkDatumDeny(obj.value)) return;
    path = obj.value;
    if(path==null) return;
    path = path.replace(/\\/g,'/');
    if(path.indexOf('/')<0) return;
    
    var img = document.getElementById("__DATA_PREVIEW__");
    img.src="file://localhost/"+path;
}

function onDataUpload(){
    if(isNewPaper()) return;
    var url = parent.W3CNF.getServerURL("paper.data.upload");
    url = parent.W3GUI.wrapUID(url)+"&PID="+paperId;
    
    var fm = document.getElementById("__DATA_FORM__");
    fm.action = url;
    fm.submit();
}
function hideDataDialog(){
    document.getElementById("__DATA_UPLOAD__").style.visibility="hidden";
}

function showDataDialog(){
    if(isNewPaper()){
        alert(parent.W3CNF.getI18nString("info.commit.newone"));
        return;
    }
    document.getElementById("__DATA_UPLOAD__").style.visibility="visible";
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
        if(checkReplyCode(rtv)){
            return;
        }else{
        	if(rtv == "info.success"){
		        initData();
		    }
            alert(parent.W3CNF.getI18nString(rtv));
        }
    }
}

function onDelData(){
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == ""){
        alert(parent.W3CNF.getI18nString("info.select.empty"));
        return;
    }
    if(isNewPaper()) {
        alert(parent.W3CNF.getI18nString("info.commit.newone"));
        return;
    }
    
    var url = parent.W3CNF.getServerURL("paper.data.delete");
    url = parent.W3GUI.wrapUID(url)+"&PID="+paperId+"&FILE="+id;
    
    var rtv = parent.A9Loader.syncLoadText(url);
    rtv = parent.W3TXT.trimEmpty(rtv);

    if(rtv == "info.success"){
        initData();
    }
    alert(parent.W3CNF.getI18nString(rtv));
}

function onViewData(){
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == ""){
        alert(parent.W3CNF.getI18nString("info.select.empty"));
        return;
    }

    window.open(docPath+"data/"+id,'newwindow', 'height=200, width=400, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no,status=no');
}

function onViewPaper(){
    var win = window.open('about:blank','newwindow', 'height=600, width=600, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no, status=no');
    win.document.write("<meta content='text/html; charset=utf-8' http-equiv='content-type'>");
    if(isNewPaper()){
    	win.document.write("<base href='"+parent.W3CNF.USERHOME+"indexer/article/label/'>");
    }else{
    	win.document.write("<base href='"+docPath+"'>");
    }
    win.document.write(__EDIOR__.getText());
    win.document.close();
}
function onOpenCodeTool(){
    window.open('../../3rdp/a9text/tools/minitools/code-util.htm','newwindow', 'height=600, width=600, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no, status=no');
}
function onOpenSetTool(){
    window.open('../../3rdp/a9text/tools/minitools/set-util.htm','newwindow', 'height=600, width=600, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no, status=no');
}

function onSavePaper(isAs){
    var title = document.getElementById("__TITLE__").value;
    if(title ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("__TITLE__").focus();
        return;
    }
    
    document.getElementById("TITLE").value = title;
    document.getElementById("BRIEF").value = document.getElementById("__BRIEF__").value;
    document.getElementById("LABEL").value = document.getElementById("__LABEL__").value;
    document.getElementById("XTEXT").value = __EDIOR__.getText();
    
    var url = parent.W3CNF.getServerURL("paper.edit.commit");
    url = parent.W3GUI.wrapUID(url)+"&PID="+(isAs?"":paperId);

    var fm = document.getElementById("__PAPER_FORM__");
    fm.action=url;
    fm.submit();
}

function onDeletePaper(){
    if(isNewPaper()){
        alert(parent.W3CNF.getI18nString("info.commit.newone"));
        return;
    }
    parent.W3GUI.deleteArticle(paperId);
}

function onPaperResponse(){
    var rtv = "";
    if(__PAPER_POSTER__.document.readyState){ // onreadystatechange
        if(__PAPER_POSTER__.document.readyState == "complete"){
            rtv = __PAPER_POSTER__.document.body.innerHTML;
            __PAPER_POSTER__.document.body.innerHTML = "";
        }
    }else{ // onload
        rtv = __PAPER_POSTER__.document.body.innerHTML;
        __PAPER_POSTER__.document.body.innerHTML = "";
    }

    rtv = parent.W3TXT.trimEmpty(rtv);
    if(rtv != ""){
    	__PAPER_POSTER__.location="about:blank";// avoid recommit when refresh
        
        if(regexpId.test(rtv)){ // new paper,return id
            paperId = rtv;
            initHead();
            initData();
            rtv = "info.success";
        }
        
        if(rtv == "info.success"){
        	parent.W3GUI.commitArticle();
        }
        alert(parent.W3CNF.getI18nString(rtv));
    }
}

function onSwitchEditor(name){
    bodyTxt = __EDIOR__.getText();
    initEditor(name);
}
// helper

function initEditor(name){
    if(name=="a9text"){
        __EDIOR__.location = parent.W3CNF.A9W3HOME+"a9w3-engine/view/writer/ide-a9text.htm?"+docPath;
        document.getElementById("__BTN_TINYMCE__").disabled  = false;
        document.getElementById("__BTN_PURETEXT__").disabled = false;
        document.getElementById("__BTN_A9TEXT__").disabled   = true;
    }else if (name=="tinymce"){
        __EDIOR__.location = parent.W3CNF.A9W3HOME+"a9w3-engine/view/writer/ide-tinymce.htm?"+docPath;
        document.getElementById("__BTN_TINYMCE__").disabled  = true;
        document.getElementById("__BTN_PURETEXT__").disabled = false;
        document.getElementById("__BTN_A9TEXT__").disabled   = false;
    }else{
        __EDIOR__.location = parent.W3CNF.A9W3HOME+"a9w3-engine/view/writer/ide-puretext.htm?"+docPath;
        document.getElementById("__BTN_PURETEXT__").disabled = true;
        document.getElementById("__BTN_TINYMCE__").disabled  = false;
        document.getElementById("__BTN_A9TEXT__").disabled   = false;
    }
}
// ide paper
function ideReady(){
    try{
        __EDIOR__.setText(bodyTxt);
    }catch(E){};
}

// init
function initHead(){
    //label
    var lblMap = parent.W3GUI.ARTICLE_LABEL.getKeyValClone();
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
}
function initData(){
	if(isNewPaper()) return;
	docPath = parent.W3CNF.USERHOME+"article/"+paperId+"/";
    parent.W3GUI.getArticleItem(paperId,function(ai){
        document.getElementById("__TITLE__").value = ai.title;
        document.getElementById("__LABEL__").value = ai.lable.join(" ");
        document.getElementById("__BRIEF__").value = ai.brief;
    });
    parent.W3GUI.getArticleData(paperId,function(ls){
        var datObj = document.getElementById("__DATAS__");
        var len = datObj.length;
        for(var i=1;i<len;i++){
            datObj.remove(1);
        }
        for(var i=0;i<ls.length;i++){
            var opt=document.createElement("OPTION");
            opt.text=ls[i];
            opt.value=ls[i];
            try{
                datObj.add(opt,null);
            }catch(e){
                datObj.add(opt);
            }
        }
    });
}

function isNewPaper(){
    if(paperId == null || paperId == "") return true;
    return false;
}

function init(){
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0 && regexpId.test(url.substr(pos+1))){
        paperId = url.substr(pos+1);
        initHead();
        initData();
        // body
        parent.A9Loader.asyncLoadText(function(u,t){
            bodyTxt = t;
            initEditor(isA9text(t)?"a9text":"puretext");
        },docPath+"body.htm");
        
        document.getElementById("__BTN_DELETE__").disabled=false;
    }else{
    	initHead();
    	initEditor("");
    }
}
//
init();

