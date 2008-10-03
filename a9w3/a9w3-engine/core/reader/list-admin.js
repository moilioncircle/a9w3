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


function onSaveBoard()
{
    if(document.getElementById("PASS").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("PASS").focus();
        return;
    }
    if(document.getElementById("CODE").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("admin.commit");
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
	document.getElementById("__CODE__").src=parent.W3CNF.getServerURL("admin.random");
}

function init()
{
	loadCode();
}

//
init();

