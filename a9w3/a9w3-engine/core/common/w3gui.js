var W3GUI = {};

W3GUI.LISTWINNAME="A9W3_LIST_WIN";
W3GUI.ITEMWINNAME="A9W3_ITEM_WIN";

/** home */
W3GUI.drawMenu = function()
{
    var html = "<table width='100%'  border='0' cellspacing='6' cellpadding='0'>";
    for (var i=1;;i++)
    {
    	var infoText = W3CNF.CONF.getValue("menu.item-"+i+".info.text");
    	var infoType = W3CNF.CONF.getValue("menu.item-"+i+".info.type");
    	
    	if(infoText == null) break;
    	
    	if(infoType == "function")
    		infoText = eval(infoText);
        else if ((infoType == "config"))
            infoText = W3CNF.MENU.getValue(infoText);
    	
    	var linkText = W3CNF.CONF.getValue("menu.item-"+i+".link.text");
    	var linkType = W3CNF.CONF.getValue("menu.item-"+i+".link.type");
    	
    	if(linkType == "string")
    	   linkText = W3GUI.LISTWINNAME+".location=unescape('"+escape(linkText)+"');";
    	   
    	
    	var icon  = W3CNF.CONF.getValue("menu.item-"+i+".icon");
    	
        html+= "<tr>";
        html+= "<td class='a9w3_menu_info'>"+infoText+"</td>";
        html+= "<td><div class='a9w3_menu_out' onMouseOver='W3GUI.menuEvent.onOver(this)' onMouseOut='W3GUI.menuEvent.onOut(this)' onclick='W3GUI.menuEvent.onClick(this,\""+
        		escape(linkText)+"\")'><img src='"+
                icon+"'></div></td>";
        html+= "</tr>";
    }
    
    html+= "</table>";
    
    document.getElementById("A9W3_MENU").innerHTML=html;
}

W3GUI.drawLogo = function()
{
    var icon = W3CNF.CONF.getValue("logo.icon");
    var text = W3CNF.CONF.getValue("logo.text");
    
    var html = "<table width='100%' height='100%'  border='0' cellpadding='0' cellspacing='0'>";
        html+= "<tr>";
        html+= "<td width='220'><img src='"+icon+"' /></td>";
        html+= "<td style='vertical-align:middle;'>"+text+"</td>";
        html+= "</tr>";
        html+= "</table>";
    
    document.getElementById("A9W3_LOGO").innerHTML=html;
}

W3GUI.drawPage = function()
{
    document.title=W3CNF.CONF.getValue("page.name");
    document.getElementById("A9W3_LIST").innerHTML="<iframe frameborder='0' id='"+W3GUI.LISTWINNAME+"' name='"+W3GUI.LISTWINNAME+"' src='"+
        W3CNF.CONF.getValue("page.list.url")+"'></iframe>";
        
    document.getElementById("A9W3_ITEM").innerHTML="<iframe frameborder='0' id='"+W3GUI.ITEMWINNAME+"' name='"+W3GUI.ITEMWINNAME+"' src='"+
        W3CNF.CONF.getValue("page.item.url")+"'></iframe>";
}

W3GUI.changeCss = function(obj,cname)
{
    obj.className = cname;
}

/** event */
W3GUI.menuEvent = function()
{
    var active=null;
    var overcss="a9w3_menu_over";
    var outcss="a9w3_menu_out";
    var clickcss="a9w3_menu_focus";
    
    function onOver(obj)
    {
        if(active == obj) return;
        obj.className = overcss;
    }
    
    function onOut(obj)
    {
        if(active == obj) return;
        obj.className = outcss;
    }
    
    function onClick(obj,action)
    {
        if(active == obj) return;
        if(active != null) active.className = outcss;
        obj.className = clickcss;
        active = obj;
        eval(unescape(action));
    }
    
    return {'onOver':onOver,'onOut':onOut,'onClick':onClick};
}();

/** list data */
W3GUI.POOL = {};

// article
W3GUI.getArticleTotalLink = function(func)
{
	var key = "Article.Total.Link";
	var url = W3CNF.USERHOME+"indexer/article/total/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleLabelList = function(func)
{
	var key = "Article.Label.List";
    if(W3GUI.POOL[key] == null)
    {
        var kv  = W3CNF.ARTICLE_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[key] = arr;
    }
    func(W3GUI.POOL[key]);
}
W3GUI.getArticleLabelLink = function(id,func)
{
	var key = "Article.Label.Link."+id;
	var url = W3CNF.USERHOME+"indexer/article/label/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleMonthList = function(func)
{
	var key = "Article.Month.List";
	var url = W3CNF.USERHOME+"indexer/article/month/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleMonthLink = function(id,func)
{
	var key = "Article.Month.Link."+id;
	var url = W3CNF.USERHOME+"indexer/article/month/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleItem = function(id,func)
{
	var key = "Article.Item."+id;
	var urls = [W3CNF.USERHOME+"article/"+id+"/head.txt",
				W3CNF.USERHOME+"helpers/status/read/article/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.articleItem,key,urls,func);
}

W3GUI.getArticleData = function(id,func)
{
    var url = W3CNF.USERHOME+"article/"+id+"/data/index.txt";
    W3GUI._callbackArray_(null,url,func);
}

// gallery
W3GUI.getGalleryTotalLink = function(func)
{
	var key = "Gallery.Total.Link";
	var url = W3CNF.USERHOME+"indexer/gallery/total/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryLabelList = function(func)
{
	var key = "Gallery.Label.List";
    if(W3GUI.POOL[key] == null)
    {
        var kv  = W3CNF.GALLERY_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[key] = arr;
    }
    func(W3GUI.POOL[key]);
}
W3GUI.getGalleryLabelLink = function(id,func)
{
	var key = "Gallery.Label.Link."+id;
	var url = W3CNF.USERHOME+"indexer/gallery/label/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryMonthList = function(func)
{
	var key = "Gallery.Month.List";
	var url = W3CNF.USERHOME+"indexer/gallery/month/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryMonthLink = function(id,func)
{
	var key = "Gallery.Month.Link."+id;
	var url = W3CNF.USERHOME+"indexer/gallery/month/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}

W3GUI.getGalleryItem = function(id,func)
{
	var key = "Gallery.Item."+id;
	var urls = [W3CNF.USERHOME+"gallery/info/"+id+".txt",
				W3CNF.USERHOME+"helpers/status/read/gallery/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.galleryItem,key,urls,func);
}

// board
W3GUI.getBoardLink = function(func)
{
	var key = "Board.Link";
	var url = W3CNF.USERHOME+"helpers/board/00000000000000000.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getBoardItem = function(id,func)
{
	var key = "Board.Item."+id;
	var urls = [W3CNF.USERHOME+"helpers/board/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.messageItem,key,urls,func);
}

// links
W3GUI.getLinksItem = function(func)
{
	var key = "Links.Item";
	var urls = [W3CNF.USERHOME+"helpers/links/name-url-map.txt"];
	W3GUI._callbackObject_(null,null,key,urls,func);
}

// notice
W3GUI.getNoticeLink = function(func)
{
	var key = "Notice.Link";
	var url = W3CNF.USERHOME+"helpers/notice/00000000000000000.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getNoticeItem = function(id,func)
{
	var key = "Notice.Item."+id;
	var urls = [W3CNF.USERHOME+"helpers/notice/"+id+"/head.txt"];
	W3GUI._callbackObject_(id,W3TXT.noticeItem,key,urls,func);
}

/** switch view */
W3GUI.showArticle = function(id)
{
	eval(W3GUI.ITEMWINNAME+".location='"+W3CNF.USERHOME+"article/"+id+"/body.htm';");
}
W3GUI.showPicture = function(id)
{
	W3GUI.getGalleryItem(id,function(ai){
		var buff = [];
		buff.push("<br />");
		buff.push("<table  border='0' align='center' cellpadding='1' cellspacing='0'>");
		buff.push("<tr>");
		buff.push("<td style='border:1px solid #333333'><img src='"+W3CNF.USERHOME+"gallery/data/"+ai.id+"."+ai.ftype+"' style='border:1px solid #FFFFFF'></td>");
		buff.push("</tr>");
		buff.push("<tr><td>");
		buff.push("<br />");
		buff.push("<table width='100%'  border='0' cellspacing='0' cellpadding='0'>");
		buff.push("<tr><td><img src='"+W3CNF.A9W3HOME+"a9w3-engine/data/image/icon-list-ctime.png' title='created' /> "+ai.ctime);
		buff.push("&nbsp;&nbsp;<img src='"+W3CNF.A9W3HOME+"a9w3-engine/data/image/icon-list-pixel.png' title='pixel' /> "+ai.pixel);
		buff.push("&nbsp;&nbsp;<img src='"+W3CNF.A9W3HOME+"a9w3-engine/data/image/icon-list-sizeb.png' title='size' /> "+ai.sizeb);
		buff.push("&nbsp;&nbsp;<img src='"+W3CNF.A9W3HOME+"a9w3-engine/data/image/icon-list-views.png' title='view' /> "+ai.views+"</td></tr>");
		buff.push("<tr><td><img src='"+W3CNF.A9W3HOME+"a9w3-engine/data/image/icon-list-label.png' title='label'/> ");
		if(ai.lable ==null || ai.lable.length ==0)
		{
		    ai.lable=[W3CNF.GALLERY_LABEL.getValue("000")];
		}
		for(var k=0;k<ai.lable.length;k++)
		{
			buff.push(ai.lable[k]+"&nbsp;");
		}
		buff.push("</td></tr>");
		buff.push("<tr><td class='a9w3_text_plain'>"+W3TXT.text2html(ai.brief)+"</td></tr>");
		buff.push("</table>");
		buff.push("</td></tr>");
		buff.push("</table>");
		
		var doc = eval(W3GUI.ITEMWINNAME+".document");
		doc.write(buff.join(""));
		doc.close();
	});
}
/** admin */
W3GUI.deleteArticle = function(id)
{
	alert("delete article:"+id);
}
W3GUI.editArticle = function(id)
{
    eval(W3GUI.ITEMWINNAME+".location=\""+W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-paper.htm?"+id+"\";");
}
W3GUI.deletePicture = function(id)
{
	alert("delete picture:"+id);
}
W3GUI.editPicture = function(id)
{
	alert("edit picture:"+id);
}
W3GUI.deleteLinks = function(id)
{
	alert("delete Links:"+id);
}
W3GUI.editLinks = function(id)
{
	alert("edit Links:"+id);
}
W3GUI.deleteBoard = function(id)
{
	alert("delete Board:"+id);
}
W3GUI.editBoard = function(id)
{
	alert("edit Board:"+id);
}
W3GUI.deleteNotice = function(id)
{
	alert("delete Notice:"+id);
}
W3GUI.editNotice = function(id)
{
	alert("edit Notice:"+id);
}
/** private */
W3GUI._callbackObject_ = function(id,clzz,key,urls,func)
{
    if(W3GUI.POOL[key] == null)
    {
        A9Loader.asyncLoadText(function(us,ts){
            var map = {};
            
            if(id != null) map['id']=id;
            var vwtkn = "helpers/status/read/";
            for(var x=0;x<ts.length;x++)
            {
                if(ts[x] == null) continue;
                
                if(us[x].indexOf(vwtkn)<0)
                {
	                var tmp = ts[x].split(/[\r\n]/);
	                for(var i=0; i<tmp.length; i++) {
	                    var pos = tmp[i].indexOf("=");
	                    if(pos <0) continue;
	                    var key = tmp[i].substr(0,pos).replace(/^[ \t]+/g,"").replace(/[ \t]+$/g,"");
	                    var val = tmp[i].substr(pos+1);
	                    map[key] = val;
	                }
                }
                else
                {
                	map["views"] = (ts[x]==null||ts[x]=="")?0:ts[x];
                }
            }
            W3GUI.POOL[key] = clzz == null?map:new clzz(map);
            func(W3GUI.POOL[key]);
        },urls);
    }
    else
    {
        func(W3GUI.POOL[key]);
    }
}

W3GUI._callbackArray_ = function(key,url,func)
{
    if(key == null || W3GUI.POOL[key] == null)
    {
        A9Loader.asyncLoadText(function(u,t){
            var arr = [];
            if(t != null && t != "")
            {
                var tmp = t.split(/[\r\n]+/);
                var arr = [];
                for(var i=0; i<tmp.length; i++) {
                    if(tmp[i] != "")
                    arr.push(W3TXT.line2text(tmp[i]));
                }
            }
            if(key != null) W3GUI.POOL[key] = arr;
            func(arr);
        },url);
    }
    else
    {
        func(W3GUI.POOL[key]);
    }
}

W3GUI._getDocumentByObject_ = function(obj)
{
	if(obj == null) return null;
	
	var doc = obj.parentNode
	while(doc != null && doc.getElementById == null)
	{
		doc = doc.parentNode;
	}
	return doc;
}

//
W3GUI.asyncLoadText = function(func,url)
{
    A9Loader.asyncLoadText(function(u,t){
        func(t);
    },url);
}

