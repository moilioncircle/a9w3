function drawLinksItemView(obj,map)
{

    if(obj == null || map == null)
    {
        obj.innerHTML="";
        return;
    }
    
    var buff = [];
    buff.push("<ol>");
    var i = 0;
    for(var k in map)
    {
        i++;
        buff.push("<li>");
        buff.push("<a href='"+map[k]+"' target='_blank' class='a9w3_link_infos'>"+parent.W3TXT.text2html(k)+"</a>");
        if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER)
        {
        	buff.push("&nbsp;<a href='javascript:parent.W3GUI.editLinks("+i+")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-edit.png' title='edit'  border=0 /></a>");
        	buff.push("&nbsp;<a href='javascript:parent.W3GUI.deleteLinks("+i+")'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete' border=0 /></a>");
        }
        buff.push("</li>");
    }
    buff.push("</ol>");
    
    obj.innerHTML=i>0?buff.join(""):"";
}

// total
function showPage(){
    parent.W3GUI.getLinksItem(function(map){
        drawLinksItemView(document.getElementById("LINKITEM"),map);
    });
}
// update
function update()
{
    showPage();
}

//////////// init /////////////
showPage();
