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
        if(rtv == "warn.pass.change" || rtv == "info.success")
        {
            if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_READER)
            {
                parent.W3CNF.A9W3_RTMODE = parent.W3CNF.A9W3_WRITER;
            }
            switchMode();
            loadCode();
        }
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
        alert(parent.W3CNF.getI18nString(rtv));
    }
}

function onLogin()
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
function onLogout()
{
    var url = parent.W3CNF.getServerURL("admin.logout");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

	var rtv = parent.A9Loader.syncLoadText(url);
    if(rtv == "info.success")
    {
        parent.W3CNF.A9W3_RTMODE = parent.W3CNF.A9W3_READER;
        switchMode();
    }

    alert(parent.W3CNF.getI18nString(rtv));
}

function onChpass()
{
    if(isSimplePass(document.getElementById("PASS").value))
    {
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("PASS").focus();
        return;
    }
    if(isSimplePass(document.getElementById("NEWP").value))
    {
        alert(parent.W3CNF.getI18nString("info.pass.simple"));
        document.getElementById("NEWP").focus();
        return;
    }
    
    if(document.getElementById("NEWP").value != document.getElementById("RENP").value)
    {
        alert(parent.W3CNF.getI18nString("warn.pass.differ"));
        document.getElementById("RENP").focus();
        return;
    }
    
    if(document.getElementById("CODE").value =="")
    {
        alert(parent.W3CNF.getI18nString("info.check.empty"));
        document.getElementById("CODE").focus();
        return;
    }
    var url = parent.W3CNF.getServerURL("admin.cpass");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER;
    else
        url = url+"?UID="+parent.W3CNF.USER;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function switchMode()
{
    var isAdmin = (parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER);
    document.getElementById("__READER__").style.display=isAdmin?"none":"";
    document.getElementById("__CPASS1__").style.display=isAdmin?"":"none";
    document.getElementById("__CPASS2__").style.display=isAdmin?"":"none";
    document.getElementById("__WRITER__").style.display=isAdmin?"":"none";
}
function isSimplePass(pass)
{
    if(pass == null || pass.length<10) return true;
    if(pass.replace(/[0-9a-zA-Z]/g,"").length<=0) return true;
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
    switchMode();
}

//
init();

