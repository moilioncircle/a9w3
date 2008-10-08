var docPath = null;
var paperId = null;
var bodyTxt = null;
var regexpId=/^\d{17}$/;

// event
function onDataChose(obj)
{
    var box = document.getElementById("__DATA_PREVIEW__");
    var htm = "&nbsp;";
    htm = "<img src='file://localhost/"+obj.value+"' alt='"+obj.value+"'/>";
    box.innerHTML=htm;
}

function onDataUpload()
{
    if(isNewPaper()) return;

    var url = parent.W3CNF.getServerURL("notice.data.upload");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&PID="+paperId;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&PID="+paperId;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action = url;
    fm.submit();
}
function hideDataDialog()
{
    document.getElementById("__DATA_UPLOAD__").style.visibility="hidden";
}

function showDataDialog()
{
    if(isNewPaper()) 
    {
        alert(parent.W3CNF.getI18nString("info.paper.newpaper"));
        return;
    }
    document.getElementById("__DATA_UPLOAD__").style.visibility="visible";
}

function onDataResponse()
{
    var rtv = "";
    if(__DATA_POSTER__.document.readyState)// onreadystatechange
    {
        if(__DATA_POSTER__.document.readyState == "complete")
        {
            rtv = __DATA_POSTER__.document.body.innerHTML;
            __DATA_POSTER__.document.body.innerHTML = "";
        }
    }
    else // onload
    {
        rtv = __DATA_POSTER__.document.body.innerHTML;
        __DATA_POSTER__.document.body.innerHTML = "";
    }
    
    if(rtv != "")
    {
        alert(rtv);
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
    }
}

function onDelData()
{
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == "")
    {
        alert(parent.W3CNF.getI18nString("info.paper.data.empty"));
        return;
    }
    if(isNewPaper()) 
    {
        alert(parent.W3CNF.getI18nString("info.paper.newpaper"));
        return;
    }
    
    var url = parent.W3CNF.getServerURL("notice.data.delete");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&PID="+paperId+"&FILE="+id;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&PID="+paperId+"&FILE="+id;
    
    var rtv = parent.A9Loader.syncLoadText(url);
    if(rtv == "info.success")
    {
        alert("ok");
    }
    alert(parent.W3CNF.getI18nString(rtv));
}

function onViewData()
{
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == "")
    {
        alert(parent.W3CNF.getI18nString("info.paper.data.empty"));
        return;
    }

    window.open(docPath+"data/"+id,'newwindow', 'height=200, width=400, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no,status=no');
}

function onViewPaper()
{
    var win = window.open("about:blank",'newwindow', 'height=600, width=600, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no, status=no');
    win.document.write("<base href='"+docPath+"'>");
    win.document.write(__EDIOR__.getText());
    win.document.close();
}

function onSavePaper()
{
    var title = document.getElementById("__TITLE__").value;
    if(title =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("__TITLE__").focus();
        return;
    }
    var brief = document.getElementById("__BRIEF__").value;
    if(brief =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("__BRIEF__").focus();
        return;
    }
    
    document.getElementById("TITLE").value = title;
    document.getElementById("BRIEF").value = brief
    document.getElementById("XTEXT").value = __EDIOR__.getText();
    
    var url = parent.W3CNF.getServerURL("notice.edit.commit");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&PID="+paperId;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&PID="+paperId;

    var fm = document.getElementById("__PAPER_FORM__");
    fm.action=url;
    fm.submit();
}

function onDeletePaper()
{
    if(isNewPaper()) 
    {
        alert(parent.W3CNF.getI18nString("info.paper.newpaper"));
        return;
    }
    parent.W3GUI.deleteNotice(paperId);
}

function onPaperResponse()
{
    var rtv = "";
    if(__PAPER_POSTER__.document.readyState)// onreadystatechange
    {
        if(__PAPER_POSTER__.document.readyState == "complete")
        {
            rtv = __PAPER_POSTER__.document.body.innerHTML;
            __PAPER_POSTER__.document.body.innerHTML = "";
        }
    }
    else // onload
    {
        rtv = __PAPER_POSTER__.document.body.innerHTML;
        __PAPER_POSTER__.document.body.innerHTML = "";
    }
    
    if(rtv != "")
    {
        alert(rtv);
        
        if(regexpId.test(rtv)) // new paper,return id
        {
            window.location=self.location.href+"?"+rtv;
        }
        else // message
        {
            
        }
        
        __PAPER_POSTER__.location="about:blank";// avoid recommit when refresh
    }
}

function onSwitchEditor(isA9)
{
    bodyTxt = __EDIOR__.getText();
    initEditor(isA9);
}
// helper
function isA9text(text)
{
    if(text == null) return true;
    return text.indexOf("a9w3-engine/core/reader/item-a9text.js")>0;
}
function initEditor(isA9)
{
    if(isA9){
        __EDIOR__.location = parent.W3CNF.A9W3HOME+"a9w3-engine/view/writer/ide-a9text.htm?"+docPath;
        document.getElementById("__BTN_TINYMCE__").disabled = false;
        document.getElementById("__BTN_A9TEXT__").disabled = true;
    }else{
        __EDIOR__.location = parent.W3CNF.A9W3HOME+"a9w3-engine/view/writer/ide-tinymce.htm?"+docPath;
        document.getElementById("__BTN_TINYMCE__").disabled = true;
        document.getElementById("__BTN_A9TEXT__").disabled = false;
    }
}
// ide notice
function ideReady()
{
    try{
        __EDIOR__.setText(bodyTxt);
    }catch(E){};
}

// init
function initHead()
{
    parent.W3GUI.getNoticeItem(paperId,function(ai){
        document.getElementById("__TITLE__").value = ai.title;
        document.getElementById("__BRIEF__").value = ai.brief;
    });
}
function initData()
{
    parent.W3GUI.getNoticeData(paperId,function(ls){
        var datObj = document.getElementById("__DATAS__");
        var len = datObj.length;
        for(var i=1;i<len;i++)
            datObj.remove(1);
        for(var i=0;i<ls.length;i++)
        {
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

function isNewPaper()
{
    if(paperId == null || paperId == "") return true;
    return false;
}

function init()
{
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0 && regexpId.test(url.substr(pos+1)))
	{
		paperId = url.substr(pos+1);
        docPath = parent.W3CNF.USERHOME+"helpers/notice/"+paperId+"/";
        
        // head
        initHead();
        // data
        initData();
        // body
        parent.W3GUI.asyncLoadText(function(t){
            bodyTxt = t;
            initEditor(isA9text(t));
        },docPath+"body.htm");
        
        document.getElementById("__BTN_DELETE__").disabled=false;
    }
}
//
init();
