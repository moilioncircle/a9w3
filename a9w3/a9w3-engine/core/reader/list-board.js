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
        init();
    }
}


function onSaveBoard()
{
    if(document.getElementById("FROM").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("FROM").focus();
        return;
    }
    if(document.getElementById("CODE").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    
    if(document.getElementById("TEXT").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("TEXT").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("board.commit");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function loadCode()
{
        var url = parent.W3CNF.getServerURL("board.random");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

	document.getElementById("__CODE__").src=url;
}

function init()
{
	loadCode();
    parent.W3GUI.getBoardInfo(function(txt)
    {
        document.getElementById("__BOARDINFO__").innerHTML="<pre style='line-height:100%;margin-top:0px;'>"+txt+"</pre>";
    });
    parent.W3GUI.getBoardLink(function(lst)
    {
		document.getElementById("__BOARDSIZE__").innerHTML=lst==null?0:lst.length;
    });
}
//
init();

