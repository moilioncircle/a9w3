var itemvw = function(ai){
    var buff = [];
    buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
    buff.push("<tr height='2'><td></td></tr>");
    buff.push("<tr>");
    buff.push("<td>");

    buff.push("<table width='100%'  border='0' cellspacing='0' cellpadding='2'><tr>");
    buff.push("<td class='a9w3_picture_box' onmouseover='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"\"' onmouseout='document.getElementById(\"ITEM_"+ai.id+"\").style.display=\"none\"'>");
    buff.push("<a href='javascript:parent.W3GUI.showPicture(\""+ai.id+"\")' class='a9w3_link_infos'>");
    buff.push("<img src='"+parent.W3CNF.USERHOME+"gallery/mini/"+ai.id+".jpg' border=1 /> ");
    buff.push("</a>");
    buff.push("</td>");
    buff.push("<td><table width='100%' border='0' cellspacing='0' cellpadding='0' class='a9w3_text_plain'>");
    buff.push("<tr><td>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
        buff.push("<img onclick='parent.W3GUI.editPicture(\""+ai.id+"\")' onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 />");
        buff.push("<img onclick='parent.W3GUI.deletePicture(\""+ai.id+"\")' onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete' border=0 />");
        buff.push("<img onclick='this.src=\"../../data/image/icon-list-top-\"+(parent.W3GUI.topPicture(\""+ai.id+"\")?\"t\":\"f\")+\".png\"' onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-top-"+(parent.W3GUI.isTopPicture(ai.id)?'t':'f')+".png' title='top' border=0 />");
    }
    var cdt = ai.ctime
    if(cdt != null)cdt = cdt.substring(0,cdt.lastIndexOf(' ')).substr(2);
    buff.push("<a href='javascript:parent.W3GUI.showPictureURL(\""+ai.id+"\",\""+ai.ftype+"\")'><img src='../../data/image/icon-list-url.png' title='url' border=0 /></a>&nbsp;");
    buff.push("<img src='../../data/image/icon-list-star-"+(parent.W3GUI.isStarPicture(ai.id)?"t":"f")+".png' onclick='this.src=\"../../data/image/icon-list-star-\"+(parent.W3GUI.starPicture(\""+ai.id+"\")?\"t\":\"f\")+\".png\"' style='cursor:hand' title='stars' border=0 />&nbsp;");
    buff.push("</td></tr>");
    buff.push("<tr><td><a href='javascript:parent.W3GUI.seeHitLogPicture(\""+ai.id+"\")'><img src='../../data/image/icon-list-views.png' title='view' border=0 /></a> "+ai.views+"</td></tr>");
    buff.push("<tr><td><img src='../../data/image/icon-list-ctime.png' title='created' /> "+cdt+"</td></tr>");
    buff.push("<tr><td><img src='../../data/image/icon-list-pixel.png' title='pixel' /> "+ai.pixel+"</td></tr>");
    buff.push("<tr><td><img src='../../data/image/icon-list-sizeb.png' title='size' /> "+ai.sizeb+"</td></tr>");
    buff.push("<tr><td><img src='../../data/image/icon-list-label.png' title='label'/> ");
    if(ai.lable ==null || ai.lable.length ==0){
        ai.lable=[parent.W3GUI.GALLERY_LABEL.getValue("000")];
    }
    for(var k=0;k<ai.lable.length;k++){
        buff.push("<a href='javascript:showPage(\"label\",\""+parent.W3GUI.GALLERY_LABEL.getKey(ai.lable[k])+"\")' class='a9w3_link_infos'>"+ai.lable[k]+"</a> ");
    }
    buff.push("</td></tr>");
    buff.push("</table></td>");
    buff.push("</tr></table>");
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
    'VAR_FUNNEW':'parent.W3GUI.editPicture',
    'VAR_PCOUNT':parent.W3CNF.PAGE_SIZE_ALBUM,
    'FNC_LABELV':parent.W3GUI.GALLERY_LABEL,
    'FNC_TTLLNK':parent.W3GUI.getGalleryTotalLink,
    'FNC_LBLLST':parent.W3GUI.getGalleryLabelList,
    'FNC_LBLLNK':parent.W3GUI.getGalleryLabelLink,
    'FNC_MNTLST':parent.W3GUI.getGalleryMonthList,
    'FNC_MNTLNK':parent.W3GUI.getGalleryMonthLink,
    'FNC_STRLNK':parent.W3GUI.getGalleryStarsLink,
    'FNC_ITEMAI':parent.W3GUI.getGalleryItem,
    'FNC_ITEMVW':itemvw
};

init();