var W3GUI = {};

W3GUI.LISTWINNAME = "A9W3_LIST_WIN";
W3GUI.ITEMWINNAME = "A9W3_ITEM_WIN";
W3GUI.LISTWINOBJW = null;
W3GUI.ITEMWINOBJW = null;

W3GUI.POOL = {};
W3GUI.KEY = {
    ART_TTL_LNK : "Article.Total.Link",
    ART_LBL_LST : "Article.Label.List",
    ART_LBL_LNK : "Article.Label.Link.",
    ART_MNT_LST : "Article.Month.List",
    ART_MNT_LNK : "Article.Month.Link.",
    ART_ITM     : "Article.Item.",
    ADD_TTL_LNK : "Address.Total.Link",
    ADD_LBL_LST : "Address.Label.List",
    ADD_LBL_LNK : "Address.Label.Link.",
    ADD_MNT_LST : "Address.Month.List",
    ADD_MNT_LNK : "Address.Month.Link.",
    ADD_ITM     : "Address.Item.",
    GLY_TTL_LNK : "Gallery.Total.Link",
    GLY_LBL_LST : "Gallery.Label.List",
    GLY_LBL_LNK : "Gallery.Label.Link.",
    GLY_MNT_LST : "Gallery.Month.List",
    GLY_MNT_LNK : "Gallery.Month.Link.",
    GLY_ITM     : "Gallery.Item.",
    //BRD_LNK     : "Board.Link", // do not cache it
    BRD_ITM     : "Board.Item.",
    LNK_ITM     : "Links.Item",
    NTC_LNK     : "Notice.Link",
    NTC_ITM     : "Notice.Item."
};

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
    
    W3GUI.LISTWINOBJW = eval(W3GUI.LISTWINNAME);
    W3GUI.ITEMWINOBJW = eval(W3GUI.ITEMWINNAME);
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

/** 
list: a list of label/month. (indexer/article/label/item.txt)
link: a link to item in the list. (indexer/article/label/001/item.txt)
item: a target of link. (a9admin/article/2008/0502140800/head.txt)
*/

// article
W3GUI.getArticleTotalLink = function(func)
{
	var url = W3CNF.USERHOME+"indexer/article/total/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.ART_TTL_LNK,url,func);
}
W3GUI.getArticleLabelList = function(func)
{
    if(W3GUI.POOL[W3GUI.KEY.ART_LBL_LST] == null)
    {
        var kv  = W3CNF.ARTICLE_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.ART_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.ART_LBL_LST]);
}
W3GUI.getArticleLabelLink = function(id,func)
{
	var key = W3GUI.KEY.ART_LBL_LNK+id;
	var url = W3CNF.USERHOME+"indexer/article/label/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleMonthList = function(func)
{
	var url = W3CNF.USERHOME+"indexer/article/month/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.ART_MNT_LST,url,func);
}
W3GUI.getArticleMonthLink = function(id,func)
{
	var key = W3GUI.KEY.ART_MNT_LNK+id;
	var url = W3CNF.USERHOME+"indexer/article/month/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleItem = function(id,func)
{
	var key = W3GUI.KEY.ART_ITM+id;
	var urls = [W3CNF.USERHOME+"article/"+id+"/head.txt",
				W3CNF.USERHOME+"helpers/status/read/article/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.articleItem,key,urls,func);
}
W3GUI.getArticleData = function(id,func)
{
    var url = W3CNF.USERHOME+"article/"+id+"/data/index.txt";
    W3GUI._callbackArray_(null,url,func);
}

// address
W3GUI.getAddressTotalLink = function(func)
{
	var url = W3CNF.USERHOME+"indexer/address/total/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.ADD_TTL_LNK,url,func);
}
W3GUI.getAddressLabelList = function(func)
{
    if(W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST] == null)
    {
        var kv  = W3CNF.ADDRESS_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST]);
}
W3GUI.getAddressLabelLink = function(id,func)
{
	var key = W3GUI.KEY.ADD_LBL_LNK+id;
	var url = W3CNF.USERHOME+"indexer/address/label/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getAddressMonthList = function(func)
{
	var url = W3CNF.USERHOME+"indexer/address/month/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.ADD_MNT_LST,url,func);
}
W3GUI.getAddressMonthLink = function(id,func)
{
	var key = W3GUI.KEY.ADD_MNT_LNK+id;
	var url = W3CNF.USERHOME+"indexer/address/month/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getAddressItem = function(id,func)
{
	var key = W3GUI.KEY.ADD_ITM+id;
	var urls = [W3CNF.USERHOME+"address/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.addressItem,key,urls,func);
}

// gallery
W3GUI.getGalleryTotalLink = function(func)
{
	var url = W3CNF.USERHOME+"indexer/gallery/total/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.GLY_TTL_LNK,url,func);
}
W3GUI.getGalleryLabelList = function(func)
{
    if(W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST] == null)
    {
        var kv  = W3CNF.GALLERY_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST]);
}
W3GUI.getGalleryLabelLink = function(id,func)
{
	var key = W3GUI.KEY.GLY_LBL_LNK+id;
	var url = W3CNF.USERHOME+"indexer/gallery/label/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryMonthList = function(func)
{
	var url = W3CNF.USERHOME+"indexer/gallery/month/item.txt";
	W3GUI._callbackArray_(W3GUI.KEY.GLY_MNT_LST,url,func);
}
W3GUI.getGalleryMonthLink = function(id,func)
{
	var key = W3GUI.KEY.GLY_MNT_LNK+id;
	var url = W3CNF.USERHOME+"indexer/gallery/month/"+id+"/item.txt";
	W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryItem = function(id,func)
{
	var key = W3GUI.KEY.GLY_ITM+id;
	var urls = [W3CNF.USERHOME+"gallery/info/"+id+".txt",
				W3CNF.USERHOME+"helpers/status/read/gallery/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.galleryItem,key,urls,func);
}

// board
W3GUI.getBoardLink = function(func)
{
	var url = W3CNF.USERHOME+"helpers/board/00000000000000000.txt";
	W3GUI._callbackArray_(null,url,func);
}
W3GUI.getBoardItem = function(id,func)
{
	var key = W3GUI.KEY.BRD_ITM+id;
	var urls = [W3CNF.USERHOME+"helpers/board/"+id+".txt"];
	W3GUI._callbackObject_(id,W3TXT.messageItem,key,urls,func);
}

// notice
W3GUI.getNoticeLink = function(func)
{
	var url = W3CNF.USERHOME+"helpers/notice/00000000000000000.txt";
	W3GUI._callbackArray_(W3GUI.KEY.NTC_LNK,url,func);
}
W3GUI.getNoticeItem = function(id,func)
{
	var key = W3GUI.KEY.NTC_ITM+id;
	var urls = [W3CNF.USERHOME+"helpers/notice/"+id+"/head.txt"];
	W3GUI._callbackObject_(id,W3TXT.noticeItem,key,urls,func);
}
W3GUI.getNoticeData = function(id,func)
{
    var url = W3CNF.USERHOME+"helpers/notice/"+id+"/data/index.txt";
    W3GUI._callbackArray_(null,url,func);
}

/** switch view */
W3GUI.showArticle = function(id)
{
	W3GUI.ITEMWINOBJW.location=W3CNF.USERHOME+"article/"+id+"/body.htm";
}
W3GUI.showPicture = function(id)
{
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/item-album.htm?"+id;
}

/** admin */
W3GUI.editArticle = function(id)
{
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-paper.htm?"+id;
}
W3GUI.editPicture = function(id)
{
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-album.htm?"+id;
}
W3GUI.editAddress = function(id)
{
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-links.htm?"+id;
}
W3GUI.editBoard = function(id)
{
	alert("edit Board:"+id);
}
W3GUI.editNotice = function(id)
{
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-notice.htm?"+id;
}

W3GUI.deleteArticle = function(id)
{
    if(!W3GUI.deleteCommon("paper.edit.delete",id,"Article.")) return;
}
W3GUI.deleteAddress = function(id)
{
    if(!W3GUI.deleteCommon("links.delete",id,"Address.")) return;
}
W3GUI.deletePicture = function(id)
{
    if(!W3GUI.deleteCommon("album.edit.delete",id,"Gallery.")) return;
}
W3GUI.deleteBoard = function(id)
{
	alert("delete Board:"+id);
}

W3GUI.deleteNotice = function(id)
{
    if(!W3GUI.deleteCommon("notice.edit.delete",id,"Notice.")) return;
}

W3GUI.deleteCommon = function(code,pid,key)
{
    if(code==null || pid == null)
    {
        alert(W3CNF.getI18nString("warn.nullval"));
        return false;
    }
    
    var url = W3CNF.getServerURL(code);
    if(url.indexOf("?")>0)
        url = url+"&UID="+W3CNF.USER+"&PID="+pid;
    else
        url = url+"?UID="+W3CNF.USER+"&PID="+pid;
    
    var rtv = A9Loader.syncLoadText(url);
    if(rtv == "info.success"){
        for(var pk in W3GUI.POOL){
            if(W3GUI.POOL[pk] instanceof Array){
                
                if(key != null && pk.indexOf(key) != 0) continue;
                
                var arr = [];
                for(var i=0;i<W3GUI.POOL[pk].length;i++){
                    if(W3GUI.POOL[pk][i] != pid){
                        arr.push(W3GUI.POOL[pk][i]);
                    }
                }
                W3GUI.POOL[pk] = arr;
            }
        }
        try{
            W3GUI.LISTWINOBJW.update();
        }catch(e){};
        
        return true;
    }else{
        alert(W3CNF.getI18nString(rtv));
        return false;
    }
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

