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
	document.getElementById("__CODE__").src=parent.W3CNF.getServerURL("board.random");
}

function init()
{
	loadCode();
    parent.W3GUI.getBoardLink(function(lst)
    {
        if(lst == null || lst.length ==0) return;
		var size = lst.length<3?lst.length:3;
		var poff = size<3?0:lst.length-3;
		var buff = [];
    	var bxid = "W3GUI_LINK_BOX_";
		
		for(var i=0;i<size;i++)
		{
			buff.push("<div id='"+bxid+lst[poff+i]+"'>");
			buff.push("<img alt='loading "+lst[poff+i]+"' title='"+lst[poff+i]+"' src='../../data/image/loading-circle-red-s.gif' />");
			buff.push("</div>");
		}
		document.getElementById("__BOARDITEM__").innerHTML=buff.join("");
		document.getElementById("__BOARDSIZE__").innerHTML=size+"/"+lst.length;
		
		// load link
		for(var i=0;i<size;i++)
		{
			parent.W3GUI.getBoardItem(lst[poff+i],function(ai){
				var buff = [];
				buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
				buff.push("<tr height='5'><td></td></tr>");
				buff.push("<tr><td>");
				if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
				{
					buff.push("<a href='javascript:parent.W3GUI.deleteBoard(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete' border=0 /></a>&nbsp;");
				}
				buff.push("<img src='../../data/image/icon-list-posts.png' />&nbsp;"+parent.W3TXT.text2html(ai.user)+"</td></tr>");
				buff.push("<tr><td><pre>"+parent.W3TXT.text2html(parent.W3TXT.line2text(ai.text))+"</pre></td></tr>");
				buff.push("</table>");
				
				document.getElementById(bxid+ai.id).innerHTML=buff.join("");
			});
		}
    });
}

//
init();

