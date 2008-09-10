var docPath = null;
var paperId = null;
var bodyTxt = null;

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
    var fm = document.getElementById("__DATA_FORM__");
    fm.action = parent.W3CNF.A9W3HOME+parent.W3CNF.SERVER.getValue("paper.data.upload");
    fm.submit();
}
function hideDataDialog()
{
    document.getElementById("__DATA_UPLOAD__").style.visibility="hidden";
}
function showDataDialog()
{
    document.getElementById("__DATA_UPLOAD__").style.visibility="visible";
}

function onDataPostDone()
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
    }
}

function addLabel()
{
    var lb = document.getElementById("__LBLNME__").value;
    if(lb == "" || lb == "default") return;
    var obj = document.getElementById("__LABEL__");
    var txt = obj.value;
    if(txt == ""){
        obj.value = lb;
    }else if (txt.indexOf(lb)<0){
        obj.value = txt +", "+lb;
    }
}
function addData()
{
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == "") return;
    alert("add:"+id);
}
function delData()
{
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == "") return;
    
    var rtv = parent.A9Loader.syncLoadText(parent.W3CNF.A9W3HOME+parent.W3CNF.SERVER.getValue("paper.data.delete"));
    if(rtv == "info.success")
    {
        alert("ok");
    }
    alert(parent.W3CNF.getI18nString(rtv));
}
function viewData()
{
    var id = document.getElementById("__DATAS__").value;
    if(id == null || id == "") return;
    window.open(docPath+"data/"+id,'newwindow', 'height=200, width=400, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no,status=no');
}

function preview()
{
    var win = window.open("about:blank",'newwindow', 'height=600, width=600, top=0, left=0, toolbar=no,scrollbars=yes, resizable=yes, menubar=no,location=no, status=no');
    win.document.write("<base href='"+docPath+"'>");
    win.document.write(__EDIOR__.getText());
    win.document.close();
}

function switchEditor(isA9)
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
    parent.W3GUI.getArticleItem(paperId,function(ai){
        document.getElementById("__TITLE__").value = ai.title;
        document.getElementById("__LABEL__").value = ai.lable.join(", ");
        document.getElementById("__BRIEF__").value = ai.brief;
    });
}
function initData()
{
    parent.W3GUI.getArticleData(paperId,function(ls){
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
function init()
{
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0){
        paperId = url.substr(pos+1);
        docPath = parent.W3CNF.USERHOME+"article/"+paperId+"/";
        
        //label
        var lblMap = parent.W3CNF.ARTICLE_LABEL.getKeyValClone();
        var lblObj = document.getElementById("__LBLNME__");
        for(var k in lblMap)
        {
            var opt=document.createElement("OPTION");
            opt.text=lblMap[k];
            opt.value=lblMap[k];
            try{
                lblObj.add(opt,null);
            }catch(e){
                lblObj.add(opt);
            }
        }
        // head
        initHead();
        // data
        initData();
        // body
        parent.W3GUI.asyncLoadText(function(t){
            bodyTxt = t;
            initEditor(isA9text(t));
        },docPath+"body.htm");
    }
}
//
init();

