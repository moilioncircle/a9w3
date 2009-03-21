var cacheObj = null;
var cacheLst = null;
var cachePge = null;

function drawBoardItemView(page,obj,lst){
    if(obj != null) cacheObj=obj;
    else obj = cacheObj;

    if(lst != null) cacheLst=lst;
    else lst = cacheLst;
        
    if(obj == null) return;
    if(lst == null || lst.length ==0){
        obj.innerHTML="<br />"+parent.W3CNF.getI18nString("info.list.empty");
        return;
    }

    //
    var pall = Math.floor((lst.length-1)/parent.W3CNF.PAGE_SIZE_BOARD)+1;
    if(page == null || page< 1) page = 1;
    if(page>pall) page = pall;
    
    cachePge = page; // cache
    
    var tmp = [1,2,page-1,page,page+1,pall-1,pall];
    var cur = 0;
    var show=[];
    for(var i=0;i<tmp.length;i++){
        if(tmp[i]>0 && tmp[i]<=pall && tmp[i]>cur){
            show.push(tmp[i]);
            cur = tmp[i];
        }
    }
    
    var buff = [];
    var poff = parent.W3CNF.PAGE_SIZE_BOARD*(page-1);
    var size = lst.length-poff>parent.W3CNF.PAGE_SIZE_BOARD?parent.W3CNF.PAGE_SIZE_BOARD:lst.length-poff;
    
    // draw box
    var buff = [];
    var bxid = "W3GUI_LINK_BOX_";
    for(var i=0;i<size;i++){
        buff.push("<div id='"+bxid+lst[poff+i]+"'>");
        buff.push("<img alt='loading "+lst[poff+i]+"' title='"+lst[poff+i]+"' src='../../data/image/loading-circle-red-s.gif' />");
        buff.push("</div>");
    }
    
    // draw page
    buff.push("<div class='a9w3_text_page_box'>");
    for(var j=0;j<show.length;j++){
        if(j>0 && show[j]-show[j-1]>1)buff.push("--");

        if(show[j]!=page){
            buff.push("<a href='javascript:drawBoardItemView("+show[j]+")' class='a9w3_link_infos'>"+show[j]+"</a>");
        }else{
            buff.push("<span class='a9w3_text_infos'>"+page+"</span>");
        }
        buff.push(" ");
    }
    buff.push("</div>");
    obj.innerHTML=buff.join("");
    
    // load link
    for(var i=0;i<size;i++){
        parent.W3GUI.getBoardItem(lst[poff+i],function(ai){
            var buff = [];
            buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%' class='a9w3_article_item'>");
            buff.push("<tr height='5'><td></td></tr>");
            buff.push("<tr><td>");
            if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
                buff.push("<img onclick='parent.W3GUI.deleteBoard(\""+ai.id+"\")' onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-delete.png' title='delete' border=0 />");
            }
            buff.push("<img src='../../data/image/icon-list-posts.png' />&nbsp;"+parent.W3TXT.html2text(parent.W3TXT.line2text(ai.user))+"&nbsp;<span class='a9w3_text_plain'>("+ai.time+" / "+ai.from+")<span></td></tr>");
            buff.push("<tr><td><pre>"+parent.W3TXT.html2text(parent.W3TXT.line2text(ai.text))+"</pre></td></tr>");
            buff.push("</table>");
            
            document.getElementById(bxid+ai.id).innerHTML=buff.join("");
        });
    }
}

// total
function showPage(page){
    parent.W3GUI.getBoardLink(function(ls){
        drawBoardItemView(page,document.getElementById("BOARDITEM"),ls);
    });
}

// update
function update(){
    showPage(cachePge);
}

//////////// init /////////////
showPage();
