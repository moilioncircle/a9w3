/** list view  */
var listCache = {'obj':null,'lst':null};
var linkCache = {'obj':null,'lst':null};
var pageCache = {'type':null,'name':null,'page':1};

function drawArticleListLabelView(cur,obj,lst)
{
    if(obj != null)
        listCache['obj']=obj;
    else
        obj = listCache['obj'];

    if(lst != null)
        listCache['lst']=lst;
    else
        lst = listCache['lst'];
    
    if(obj == null) return;
    if(lst == null || lst.length ==0)
    {
        obj.innerHTML="";
        return;
    }

    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";
    
    var pos = 0;
    for(var i=0;i<lst.length;i++)
    {
        if(cur == lst[i])
        {
            pos = i;
            break;
        }
    }
    cur = lst[pos];
    
    pageCache['name']=cur; // cache
    
    var show = [];
    if(pos>0) show.push(lst[pos-1]);
    show.push(cur);
    if(pos+1<lst.length) show.push(lst[pos+1]);
    
    var buff = [];
    buff.push("<table width='100%' border='0' cellspacing='0' cellpadding='0'  ");
    buff.push("onmouseover='document.getElementById(\"LIST_ALL\").style.display=\"\";document.getElementById(\"LIST_ICN\").src=\"../../data/image/icon-list-tobottom.png\"' ");
    buff.push("onmouseout='document.getElementById(\"LIST_ALL\").style.display=\"none\";document.getElementById(\"LIST_ICN\").src=\"../../data/image/icon-list-toright.png\"'>");
    buff.push("<tr>");
    buff.push("<td width='12' class='a9w3_text_list_box'>");
    buff.push("<img id='LIST_ICN' src='../../data/image/icon-list-toright.png' />");
    buff.push("</td>");
    buff.push("<td  class='a9w3_text_list_box'>");
    for(var i=0;i<show.length;i++)
    {
        if(cur != show[i])
            buff.push("<a href='javascript:{showPage(\"label\",\""+show[i]+"\")}' class='a9w3_link_infos'>"+parent.W3CNF.ARTICLE_LABEL.getValue(show[i])+"</a>");
        else
            buff.push(parent.W3CNF.ARTICLE_LABEL.getValue(show[i]));
        buff.push(" ");
    }
    
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("<tr id='LIST_ALL' style='display:none'>");
    buff.push("<td></td>");
    buff.push("<td class='a9w3_text_list_box'>");
    for(var i=0;i<lst.length;i++)
    {
        if(cur != lst[i])
            buff.push("<a href='javascript:{showPage(\"label\",\""+lst[i]+"\")}' class='a9w3_link_infos'>"+parent.W3CNF.ARTICLE_LABEL.getValue(lst[i])+"</a>");
        else
            buff.push(parent.W3CNF.ARTICLE_LABEL.getValue(lst[i]));
        buff.push(" ");
    }
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("</table>");
    
    obj.innerHTML=buff.join("");
}

function drawArticleListMonthView(cur,obj,lst)
{
    if(obj != null)
        listCache['obj']=obj;
    else
        obj = listCache['obj'];

    if(lst != null)
        listCache['lst']=lst;
    else
        lst = listCache['lst'];
    
    if(obj == null) return;
    if(lst == null || lst.length ==0)
    {
        obj.innerHTML="";
        return;
    }

    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";
    
    var pos = 0;
    for(var i=0;i<lst.length;i++)
    {
        if(cur == lst[i])
        {
            pos = i;
            break;
        }
    }
    cur = lst[pos];
    
    pageCache['name']=cur; // cache

    var show = [];
    if(pos>0) show.push(lst[pos-1]);
    show.push(cur);
    if(pos+1<lst.length) show.push(lst[pos+1]);
    
    var buff = [];
    buff.push("<table width='100%' border='0' cellspacing='0' cellpadding='0'  ");
    buff.push("onmouseover='document.getElementById(\"LIST_ALL\").style.display=\"\";document.getElementById(\"LIST_ICN\").src=\"../../data/image/icon-list-tobottom.png\"' ");
    buff.push("onmouseout='document.getElementById(\"LIST_ALL\").style.display=\"none\";document.getElementById(\"LIST_ICN\").src=\"../../data/image/icon-list-toright.png\"'>");
    buff.push("<tr>");
    buff.push("<td width='12' class='a9w3_text_list_box'>");
    buff.push("<img id='LIST_ICN' src='../../data/image/icon-list-toright.png' />");
    buff.push("</td>");
    buff.push("<td  class='a9w3_text_list_box'>");
    for(var i=0;i<show.length;i++)
    {
        if(cur != show[i])
            buff.push("<a href='javascript:{showPage(\"month\",\""+show[i]+"\")}' class='a9w3_link_infos'>"+show[i]+"</a>");
        else
            buff.push(show[i]);
        buff.push(" ");
    }
    
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("<tr id='LIST_ALL' style='display:none'>");
    buff.push("<td></td>");
    buff.push("<td class='a9w3_text_list_box'>");
    for(var i=0;i<lst.length;i++)
    {
        if(cur != lst[i])
            buff.push("<a href='javascript:{showPage(\"month\",\""+lst[i]+"\")}' class='a9w3_link_infos'>"+lst[i]+"</a>");
        else
            buff.push(lst[i]);
        buff.push(" ");
    }
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("</table>");
    
    obj.innerHTML=buff.join("");
}

function drawArticleLinkView(page,obj,lst)
{
    if(obj != null)
        linkCache['obj']=obj;
    else
        obj = linkCache['obj'];

    if(lst != null)
        linkCache['lst']=lst;
    else
        lst = linkCache['lst'];

    if(obj == null) return;
    if(lst == null || lst.length ==0)
    {
        obj.innerHTML="";
        return;
    }
    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";

    var pall = Math.floor((lst.length-1)/parent.W3CNF.PAGE_SIZE)+1;
    if(page == null || page< 1) page = 1;
    if(page>pall) page = pall;
    
    pageCache['page']=page; // cache
    
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
    
    // draw box
    var buff = [];
    var bxid = "W3GUI_LINK_BOX_";
    for(var i=0;i<size;i++)
    {
    	buff.push("<div id='"+bxid+lst[poff+i]+"'>");
    	buff.push("<img alt='loading "+lst[poff+i]+"' title='"+lst[poff+i]+"' src='../../data/image/loading-circle-red-s.gif' />");
    	buff.push("</div>");
    }
    // draw page
    buff.push("<div class='a9w3_text_page_box'>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
    {
    	buff.push("<a href='javascript:parent.W3GUI.editArticle()'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-new.png' title='edit'  border=0 /></a>");
    	buff.push("&nbsp;&nbsp;");
    }
    for(var j=0;j<show.length;j++)
    {
        if(j>0 && show[j]-show[j-1]>1)buff.push("--");

        if(show[j]!=page)
            buff.push("<a href='javascript:drawArticleLinkView("+show[j]+")' class='a9w3_link_infos'>"+show[j]+"</a>");
        else
            buff.push("<span class='a9w3_text_infos'>"+page+"</span>");
        
        buff.push(" ");
    }
    buff.push("</div>");
    obj.innerHTML=buff.join("");
	
	//
    for(var i=0;i<size;i++)
    {
        parent.W3GUI.getArticleItem(lst[poff+i],function(ai){
        	var buff = [];
            buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
            buff.push("<tr height='2'><td></td></tr>");
            buff.push("<tr>");
            buff.push("<td onmouseover='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"\"' onmouseout='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"none\"'>");
            buff.push("<a href='javascript:parent.W3GUI.showArticle(\""+ai.id+"\")' class='a9w3_link_title'>"+parent.W3TXT.text2html(ai.title)+"</a></td>");
            buff.push("</tr>");
            buff.push("<tr>");
            var cdt = ai.ctime
            if(cdt != null)cdt = cdt.substring(0,cdt.lastIndexOf(' '));
            buff.push("<td class='a9w3_text_plain'>");
            if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
            {
            	buff.push("<a href='javascript:parent.W3GUI.editArticle(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 /></a>");
            	buff.push("&nbsp;<a href='javascript:parent.W3GUI.deleteArticle(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete'  border=0 /></a>&nbsp;&nbsp;");
            }
            buff.push("<img src='../../data/image/icon-list-ctime.png' title='created' /> "+cdt);
            buff.push("&nbsp;<img src='../../data/image/icon-list-sizeb.png' title='size' /> "+ai.sizeb);
            buff.push("&nbsp;<img src='../../data/image/icon-list-views.png' title='view' /> "+ai.views);
            buff.push("</td>");
            buff.push("</tr>");
            if(ai.lable ==null || ai.lable.length ==0)
            {
                ai.lable=[parent.W3CNF.ARTICLE_LABEL.getValue("000")];
            }
            buff.push("<tr>");
            buff.push("<td><img src='../../data/image/icon-list-label.png' title='label'/> ");
            for(var k=0;k<ai.lable.length;k++)
            {
            	buff.push("<a href='javascript:showPage(\"label\",\""+parent.W3CNF.ARTICLE_LABEL.getKey(ai.lable[k])+"\")' class='a9w3_link_infos'>"+ai.lable[k]+"</a>. ");
            }
            buff.push("</td>");
            buff.push("</tr>");
            buff.push("<tr>");
            buff.push("<td style='display:none' id='ITEM_"+ai.id+"' class='a9w3_text_plain'>"+parent.W3TXT.text2html(ai.brief)+"</td>");
            buff.push("</tr>");
            buff.push("<tr height='2'><td></td></tr>");
            buff.push("</table>");
            document.getElementById(bxid+ai.id).innerHTML=buff.join("");
        });
    }
}

//////////// page /////////////

// label
function showLabel(par,page){
    parent.W3GUI.getArticleLabelList(function(ls){
        if(par == null && ls != null && ls.length>0){
            var rn = Math.random()
            rn = Math.round(rn*ls.length)
            par = ls[rn];
        }
        drawArticleListLabelView(par,document.getElementById("ARTLISTS"),ls);
        parent.W3GUI.getArticleLabelLink(par,function(ls2){
            drawArticleLinkView(page,document.getElementById("ARTLINKS"),ls2);
        });
    });
}
// month
function showMonth(par,page){
    parent.W3GUI.getArticleMonthList(function(ls){
        if(par == null && ls != null && ls.length>0){
            par = ls[ls.length-1];
        }
        drawArticleListMonthView(par,document.getElementById("ARTLISTS"),ls);
        parent.W3GUI.getArticleMonthLink(par,function(ls2){
            drawArticleLinkView(page,document.getElementById("ARTLINKS"),ls2);
        });
    });
}
// total
function showTotal(page){
    parent.W3GUI.getArticleTotalLink(function(ls){
        document.getElementById("ARTLISTS").innerHTML="";
        drawArticleLinkView(page,document.getElementById("ARTLINKS"),ls);
    });
}
// showpage
function showPage(t,p)
{
    if(t !="label" && t != "month") t = "total";
    
    // cache
    pageCache['type']=t;
    pageCache['name']=p;
    pageCache['page']=1;
    
    var buff = [];
    buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%'>");
    buff.push("<tr height='20'>");
    if(t == "total")
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='total' src='../../data/image/type-total.png' border=0/></span></td>");
    else
        buff.push("<td style='text-align:center;'><a href='javascript:showPage()' class='a9w3_type_link'><img alt='total' src='../../data/image/type-total.png' border=0/></a></td>");
    
    if(t == "label")
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='label' src='../../data/image/type-label.png' border=0/></span></td>");
    else
        buff.push("<td style='text-align:center;'><a href='javascript:showPage(\"label\")' class='a9w3_type_link'><img alt='label' src='../../data/image/type-label.png' border=0/></a></td>");
    
    if (t == "month")
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='label' src='../../data/image/type-month.png' border=0/></span></td>");
    else
        buff.push("<td style='text-align:center;'><a href='javascript:showPage(\"month\")' class='a9w3_type_link'><img alt='month' src='../../data/image/type-month.png' border=0/></a></td>");
    
    buff.push("</tr>");
    buff.push("</table>");
    document.getElementById("ARTTYPES").innerHTML=buff.join("");
    
    update();
}

// update
function update()
{
    if(pageCache['type'] == "label") showLabel(pageCache['name'],pageCache['page']);
    else if (pageCache['type'] == "month") showMonth(pageCache['name'],pageCache['page']);
    else showTotal(pageCache['page']);
}

//////////// init /////////////
var par = self.location.href;
var pos = par.indexOf('?');
if(pos < 0)
    showPage();
else
    showPage("label",par.substr(pos+1));

