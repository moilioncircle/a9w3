var itemvw = function(ai){
    var buff = [];
    buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
    buff.push("<tr height='2'><td></td></tr>");
    buff.push("<tr>");
    buff.push("<td onmouseover='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"\"' onmouseout='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"none\"'>");
    buff.push("<a href=\""+ai.addrs+"\" class='a9w3_link_title' target='_blank'>"+parent.W3TXT.html2text(ai.title)+"</a></td>");
    buff.push("</tr>");
    buff.push("<tr>");
    var cdt = ai.ctime
    if(cdt != null)cdt = cdt.substring(0,cdt.lastIndexOf(' '));
    buff.push("<td class='a9w3_text_plain'>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
        buff.push("<a href='javascript:parent.W3GUI.editAddress(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 /></a>");
        buff.push("&nbsp;<a href='javascript:parent.W3GUI.deleteAddress(\""+ai.id+"\")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete'  border=0 /></a>&nbsp;");
    }
    buff.push("<img src='../../data/image/icon-list-ctime.png' title='created' /> "+cdt);
    buff.push("</td>");
    buff.push("</tr>");
    if(ai.lable ==null || ai.lable.length ==0){
        ai.lable=[parent.W3GUI.ADDRESS_LABEL.getValue("000")];
    }
    buff.push("<tr>");
    buff.push("<td><img src='../../data/image/icon-list-label.png' title='label'/> ");
    for(var k=0;k<ai.lable.length;k++){
        buff.push("<a href='javascript:showPage(\"label\",\""+parent.W3GUI.ADDRESS_LABEL.getKey(ai.lable[k])+"\")' class='a9w3_link_infos'>"+ai.lable[k]+"</a> ");
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
    'VAR_EMPTYF':'parent.W3GUI.editAddress',
    'VAR_PCOUNT':parent.W3CNF.PAGE_SIZE_LINKS,
    'FNC_LABELV':parent.W3GUI.ADDRESS_LABEL,
    'FNC_TTLLNK':parent.W3GUI.getAddressTotalLink,
    'FNC_LBLLST':parent.W3GUI.getAddressLabelList,
    'FNC_LBLLNK':parent.W3GUI.getAddressLabelLink,
    'FNC_MNTLST':parent.W3GUI.getAddressMonthList,
    'FNC_MNTLNK':parent.W3GUI.getAddressMonthLink,
    'FNC_ITEMAI':parent.W3GUI.getAddressItem,
    'FNC_ITEMVW':itemvw
};

init();