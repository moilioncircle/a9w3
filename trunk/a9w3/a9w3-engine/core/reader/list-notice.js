var cacheObj = null;
var cacheLst = null;
var cachePge = null;

drawNoticeLinkView = function(page,obj,lst)
{
    if(obj != null) cacheObj=obj;
    else obj = cacheObj;

    if(lst != null) cacheLst=lst;
    else lst = cacheLst;
        
    if(obj == null) return;
    if(lst == null || lst.length ==0)
    {
        obj.innerHTML="";
        return;
    }

    var pall = Math.floor((lst.length-1)/parent.W3CNF.PAGE_SIZE)+1;
    if(page == null || page< 1) page = 1;
    if(page>pall) page = pall;
    
    cachePge = page; // cache
    
    var tmp = [1,2,page-1,page,page+1,pall-1,pall];
    var cur = 0;
    var show=[];
    for(var i=0;i<tmp.length;i++)
    {
        if(tmp[i]>0 && tmp[i]<=pall && tmp[i]>cur)
        {
            show.push(tmp[i]);
            cur = tmp[i];
        }
    }
    
    var poff = parent.W3CNF.PAGE_SIZE*(page-1);
    var size = lst.length-poff>parent.W3CNF.PAGE_SIZE?parent.W3CNF.PAGE_SIZE:lst.length-poff;
    //
    // draw box
    var buff = [];
    var bxid = "W3GUI_LINK_BOX_";
    for(var i=0;i<size;i++)
    {
    	buff.push("<div id='"+bxid+lst[poff+i]+"'>");
    	buff.push("<img alt='loading "+lst[poff+i]+"' title='"+lst[poff+i]+"' src='../../data/image/loading-circle-red-s.gif' />");
    	buff.push("</div>");
    }
    
    // page
    buff.push("<div class='a9w3_text_page_box'>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
    {
    	buff.push("<a href='javascript:parent.W3GUI.editNotice()'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-new.png' title='edit'  border=0 /></a>");
    	buff.push("&nbsp;&nbsp;");
    }

    for(var j=0;j<show.length;j++)
    {
        if(j>0 && show[j]-show[j-1]>1)buff.push("--");

        if(show[j]!=page)
            buff.push("<a href='javascript:drawNoticeLinkView("+show[j]+")' class='a9w3_link_infos'>"+show[j]+"</a>");
        else
            buff.push("<span class='a9w3_text_infos'>"+page+"</span>");
        
        buff.push(" ");
    }
    buff.push("</div>");
    obj.innerHTML=buff.join("");
    
    // load link
    for(var i=0;i<size;i++)
    {	
        parent.W3GUI.getNoticeItem(lst[poff+i],function(ai){
            var buff = [];
            buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
            buff.push("<tr height='5'><td></td></tr>");
            buff.push("<tr>");
            buff.push("<td onmouseover='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"\"' onmouseout='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"none\"'><a href='"+
                   parent.W3CNF.USERHOME+"helpers/notice/"+ai.id+"/body.htm"+"' target='A9W3_ITEM_WIN' class='a9w3_link_title'>"+parent.W3TXT.text2html(ai.title)+"</a></td>");
            buff.push("</tr>");
            buff.push("<tr>");
            buff.push("<td class='a9w3_text_plain'>");
            if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
            {
            	buff.push("<a href='javascript:parent.W3GUI.editNotice(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 /></a>");
            	buff.push("&nbsp;<a href='javascript:parent.W3GUI.deleteNotice(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete'  border=0 /></a>&nbsp;&nbsp;");
            }
            buff.push("<img src='../../data/image/icon-list-ctime.png' title='created time'/> "+ai.ctime);
            buff.push("&nbsp;<img src='../../data/image/icon-list-sizeb.png' title='size'/> "+ai.sizeb);
            buff.push("</td>");
            buff.push("</tr>");
            buff.push("<tr>");
            buff.push("<td style='display:none' id='ITEM_"+ai.id+"' class='a9w3_text_plain'>"+parent.W3TXT.text2html(ai.brief)+"</td>");
            buff.push("</tr>");
            buff.push("</table>");
            
            document.getElementById(bxid+ai.id).innerHTML=buff.join("");
        });
    }
}

// total
function showPage(page){
    parent.W3GUI.getNoticeLink(function(ls){
        drawNoticeLinkView(page,document.getElementById("ARTLINKS"),ls);
    });
}

// update
function update()
{
    showPage(cachePge);
}

//////////// init /////////////
showPage();