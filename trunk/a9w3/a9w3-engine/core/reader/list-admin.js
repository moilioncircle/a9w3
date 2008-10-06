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
    if(isSimplePass(document.getElementById("PASS").value))
    {
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("PASS").focus();
        return;
    }
    if(document.getElementById("CODE").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    
    var url = parent.W3CNF.getServerURL("admin.login");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function isSimplePass(pass)
{
    if(pass == null || pass.length<10) return true;
    if(/^\d+$/.test(pass)) return true;
    if(/^[a-zA-Z]+$/.test(pass)) return true;
    if(pass.replace(/[0-9a-zA-Z]/g,"").length==0) return true;
    return false;
}

function loadCode()
{
    var url = parent.W3CNF.getServerURL("admin.random");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

	document.getElementById("__CODE__").src=url;
}

function init()
{
	loadCode();
}

//
init();

