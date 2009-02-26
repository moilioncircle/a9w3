var itemvw = function(ai){
    var buff = [];
    buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
    buff.push("<tr height='2'><td></td></tr>");
    buff.push("<tr>");
    buff.push("<td onmouseover='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"\"' onmouseout='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"none\"'>");
    buff.push("<a href='javascript:parent.W3GUI.showArticleURL(\""+ai.id+"\")'><img src='../../data/image/icon-list-url.png' title='url' border=0 /></a>&nbsp;");
    buff.push("<a href='javascript:parent.W3GUI.showArticle(\""+ai.id+"\")' class='a9w3_link_title'>"+parent.W3TXT.html2text(ai.title)+"</a></td>");
    buff.push("</tr>");
    buff.push("<tr>");
    var cdt = ai.ctime
    if(cdt != null)cdt = cdt.substring(0,cdt.lastIndexOf(' '));
    buff.push("<td class='a9w3_text_plain'>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
        buff.push("<a href='javascript:parent.W3GUI.editArticle(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 /></a>");
        buff.push("&nbsp;<a href='javascript:parent.W3GUI.deleteArticle(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete'  border=0 /></a>&nbsp;");
    }
    buff.push("<img src='../../data/image/icon-list-ctime.png' title='created' /> "+cdt);
    buff.push("&nbsp;<img src='../../data/image/icon-list-sizeb.png' title='size' /> "+ai.sizeb);
    buff.push("&nbsp;<a href='javascript:parent.W3GUI.seeHitLogArticle(\""+ai.id+"\")'><img src='../../data/image/icon-list-views.png' title='view' border=0 /></a> "+ai.views);
    buff.push("</td>");
    buff.push("</tr>");
    if(ai.lable ==null || ai.lable.length ==0){
        ai.lable=[parent.W3GUI.ARTICLE_LABEL.getValue("000")];
    }
    buff.push("<tr>");
    buff.push("<td><img src='../../data/image/icon-list-label.png' title='label'/> ");
    for(var k=0;k<ai.lable.length;k++){
        buff.push("<a href='javascript:showPage(\"label\",\""+parent.W3GUI.ARTICLE_LABEL.getKey(ai.lable[k])+"\")' class='a9w3_link_infos'>"+ai.lable[k]+"</a> ");
    }
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("<tr>");
    buff.push("<td style='display:none' id='ITEM_"+ai.id+"' class='a9w3_text_plain'>"+parent.W3TXT.html2text(parent.W3TXT.line2text(ai.brief))+"</td>");
    buff.push("</tr>");
    buff.push("<tr height='2'><td></td></tr>");
    buff.push("</table>");
    drawCommonItem(ai.id,buff.join(""));
};

var INITOBJ = {
    'VAR_EMPTYF':'parent.W3GUI.editArticle',
    'VAR_PCOUNT':parent.W3CNF.PAGE_SIZE_PAPER,
    'FNC_LABELV':parent.W3GUI.ARTICLE_LABEL,
    'FNC_TTLLNK':parent.W3GUI.getArticleTotalLink,
    'FNC_LBLLST':parent.W3GUI.getArticleLabelList,
    'FNC_LBLLNK':parent.W3GUI.getArticleLabelLink,
    'FNC_MNTLST':parent.W3GUI.getArticleMonthList,
    'FNC_MNTLNK':parent.W3GUI.getArticleMonthLink,
    'FNC_ITEMAI':parent.W3GUI.getArticleItem,
    'FNC_ITEMVW':itemvw
};

init();