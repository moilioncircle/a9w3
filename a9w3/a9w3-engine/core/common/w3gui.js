var W3GUI = {};

W3GUI.LISTWINNAME = "A9W3_LIST_WIN";
W3GUI.ITEMWINNAME = "A9W3_ITEM_WIN";
W3GUI.LISTWINOBJW = null;
W3GUI.ITEMWINOBJW = null;

W3GUI.ARTICLE_LABEL = new CnfReaderClass();
W3GUI.GALLERY_LABEL = new CnfReaderClass();
W3GUI.ADDRESS_LABEL = new CnfReaderClass();
W3GUI.MENU = new CnfReaderClass();
W3GUI.STAT = new CnfReaderClass();

W3GUI.POOL = {};
W3GUI.KEY_PREFIX = {
	ART:"Article.",
	ADD:"Address.",
	GLY:"Gallery.",
	BRD:"Board.",
	LNK:"Links.",
	NTC:"Notice."
};
W3GUI.KEY = {
    ART_TTL_LNK : W3GUI.KEY_PREFIX.ART+"Total.Link",
    ART_LBL_LST : W3GUI.KEY_PREFIX.ART+"Label.List",
    ART_LBL_LNK : W3GUI.KEY_PREFIX.ART+"Label.Link.",
    ART_MNT_LST : W3GUI.KEY_PREFIX.ART+"Month.List",
    ART_MNT_LNK : W3GUI.KEY_PREFIX.ART+"Month.Link.",
    ART_ITM     : W3GUI.KEY_PREFIX.ART+"Item.",
    ADD_TTL_LNK : W3GUI.KEY_PREFIX.ADD+"Total.Link",
    ADD_LBL_LST : W3GUI.KEY_PREFIX.ADD+"Label.List",
    ADD_LBL_LNK : W3GUI.KEY_PREFIX.ADD+"Label.Link.",
    ADD_MNT_LST : W3GUI.KEY_PREFIX.ADD+"Month.List",
    ADD_MNT_LNK : W3GUI.KEY_PREFIX.ADD+"Month.Link.",
    ADD_ITM     : W3GUI.KEY_PREFIX.ADD+"Item.",
    GLY_TTL_LNK : W3GUI.KEY_PREFIX.GLY+"Total.Link",
    GLY_LBL_LST : W3GUI.KEY_PREFIX.GLY+"Label.List",
    GLY_LBL_LNK : W3GUI.KEY_PREFIX.GLY+"Label.Link.",
    GLY_MNT_LST : W3GUI.KEY_PREFIX.GLY+"Month.List",
    GLY_MNT_LNK : W3GUI.KEY_PREFIX.GLY+"Month.Link.",
    GLY_ITM     : W3GUI.KEY_PREFIX.GLY+"Item.",
    BRD_LNK     : W3GUI.KEY_PREFIX.BRD+"Link",
    BRD_INF     : W3GUI.KEY_PREFIX.BRD+"Info",
    BRD_ITM     : W3GUI.KEY_PREFIX.BRD+"Item.",
    LNK_ITM     : W3GUI.KEY_PREFIX.LNK+"Item",
    NTC_LNK     : W3GUI.KEY_PREFIX.NTC+"Link",
    NTC_ITM     : W3GUI.KEY_PREFIX.NTC+"Item."
};

/** home */
W3GUI.drawMenu = function(){
    var html = "<table width='100%'  border='0' cellspacing='6' cellpadding='0'>";
    for (var i=1;;i++){
        var infoText = W3CNF.CONF.getValue("menu.item-"+i+".info.text");
        var infoType = W3CNF.CONF.getValue("menu.item-"+i+".info.type");
        
        if(infoText == null) break;
        
        if(infoType == "function"){
            infoText = eval(infoText);
        }else if (infoType == "config.menu"){
            infoText = W3GUI.MENU.getValue(infoText);
        }else if (infoType == "config.stat"){
            infoText = getMenuInfoByStat(infoText);
        }else{
        	// string
        }
        
        var linkText = W3CNF.CONF.getValue("menu.item-"+i+".link.text");
        var linkType = W3CNF.CONF.getValue("menu.item-"+i+".link.type");
        
        if(linkType == "string"){
           linkText = W3GUI.LISTWINNAME+".location=unescape('"+escape(linkText)+"');";
        }else{
        	// function
        }

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

W3GUI.drawLogo = function(){
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

W3GUI.drawPage = function(){
    document.title=W3CNF.CONF.getValue("page.name");
    document.getElementById("A9W3_LIST").innerHTML="<iframe frameborder='0' id='"+W3GUI.LISTWINNAME+"' name='"+W3GUI.LISTWINNAME+"' src='"+
        W3CNF.CONF.getValue("page.list.url")+"'></iframe>";
        
    document.getElementById("A9W3_ITEM").innerHTML="<iframe frameborder='0' id='"+W3GUI.ITEMWINNAME+"' name='"+W3GUI.ITEMWINNAME+"' src='"+
        W3CNF.CONF.getValue("page.item.url")+"'></iframe>";
    
    W3GUI.LISTWINOBJW = eval(W3GUI.LISTWINNAME);
    W3GUI.ITEMWINOBJW = eval(W3GUI.ITEMWINNAME);
}

W3GUI.changeCss = function(obj,cname){
    obj.className = cname;
}

/** event */
W3GUI.menuEvent = function(){
    var active=null;
    var overcss="a9w3_menu_over";
    var outcss="a9w3_menu_out";
    var clickcss="a9w3_menu_focus";
    
    function onOver(obj){
        if(active == obj) return;
        obj.className = overcss;
    }
    
    function onOut(obj){
        if(active == obj) return;
        obj.className = outcss;
    }
    
    function onClick(obj,action){
        if(active == obj) return;
        if(active != null) active.className = outcss;
        obj.className = clickcss;
        active = obj;
        eval(unescape(action));
    }
    
    return {'onOver':onOver,'onOut':onOut,'onClick':onClick};
}();

// article
W3GUI.getArticleTotalLink = function(func){
    var url = W3CNF.USERHOME+"indexer/article/total/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ART_TTL_LNK,url,func);
}
W3GUI.getArticleLabelList = function(func){
    if(W3GUI.POOL[W3GUI.KEY.ART_LBL_LST] == null){
        var kv  = W3GUI.ARTICLE_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.ART_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.ART_LBL_LST]);
}
W3GUI.getArticleLabelLink = function(id,func){
    var key = W3GUI.KEY.ART_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/article/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/article/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ART_MNT_LST,url,func);
}
W3GUI.getArticleMonthLink = function(id,func){
    var key = W3GUI.KEY.ART_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/article/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleItem = function(id,func){
    var key = W3GUI.KEY.ART_ITM+id;
    var urls = [W3CNF.USERHOME+"article/"+id+"/head.htm",
                W3CNF.USERHOME+"helpers/status/read/article/"+id+"-hit.htm"];
    W3GUI._callbackObject_(id,W3TXT.articleItem,key,urls,func);
}
W3GUI.getArticleData = function(id,func){
    var url = W3CNF.USERHOME+"article/"+id+"/data/index.htm";
    W3GUI._callbackArray_(null,url,func);
}

// address
W3GUI.getAddressTotalLink = function(func){
    var url = W3CNF.USERHOME+"indexer/address/total/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ADD_TTL_LNK,url,func);
}
W3GUI.getAddressLabelList = function(func){
    if(W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST] == null){
        var kv  = W3GUI.ADDRESS_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST]);
}
W3GUI.getAddressLabelLink = function(id,func){
    var key = W3GUI.KEY.ADD_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/address/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getAddressMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/address/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ADD_MNT_LST,url,func);
}
W3GUI.getAddressMonthLink = function(id,func){
    var key = W3GUI.KEY.ADD_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/address/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getAddressItem = function(id,func){
    var key = W3GUI.KEY.ADD_ITM+id;
    var urls = [W3CNF.USERHOME+"address/"+id+".htm"];
    W3GUI._callbackObject_(id,W3TXT.addressItem,key,urls,func);
}

// gallery
W3GUI.getGalleryTotalLink = function(func){
    var url = W3CNF.USERHOME+"indexer/gallery/total/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.GLY_TTL_LNK,url,func);
}
W3GUI.getGalleryLabelList = function(func){
    if(W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST] == null){
        var kv  = W3GUI.GALLERY_LABEL.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST] = arr;
    }
    func(W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST]);
}
W3GUI.getGalleryLabelLink = function(id,func){
    var key = W3GUI.KEY.GLY_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/gallery/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/gallery/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.GLY_MNT_LST,url,func);
}
W3GUI.getGalleryMonthLink = function(id,func){
    var key = W3GUI.KEY.GLY_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/gallery/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryItem = function(id,func){
    var key = W3GUI.KEY.GLY_ITM+id;
    var urls = [W3CNF.USERHOME+"gallery/info/"+id+".htm",
                W3CNF.USERHOME+"helpers/status/read/gallery/"+id+"-hit.htm"];
    W3GUI._callbackObject_(id,W3TXT.galleryItem,key,urls,func);
}

// board
W3GUI.getBoardInfo = function(func){
    var url = W3CNF.USERHOME+"profile/board.htm";
    var key = W3GUI.KEY.BRD_INF;
    if(W3GUI.POOL[key] == null){
        A9Loader.asyncLoadText(function(u,t){
            W3GUI.POOL[key] = t;
            func(t);
        },W3GUI.avoidClientCache(url));
    }else{
        func(W3GUI.POOL[key]);
    }
}
W3GUI.getBoardLink = function(func){
    var url = W3CNF.USERHOME+"helpers/board/00000000000000000.htm";
    W3GUI._callbackArray_(null,url,func);
}
W3GUI.getBoardItem = function(id,func){
    var key = W3GUI.KEY.BRD_ITM+id;
    var urls = [W3CNF.USERHOME+"helpers/board/"+id+".htm"];
    W3GUI._callbackObject_(id,W3TXT.messageItem,key,urls,func);
}

// notice
W3GUI.getNoticeLink = function(func){
    var url = W3CNF.USERHOME+"helpers/notice/00000000000000.htm";
    W3GUI._callbackArray_(W3GUI.KEY.NTC_LNK,url,func);
}
W3GUI.getNoticeItem = function(id,func){
    var key = W3GUI.KEY.NTC_ITM+id;
    var urls = [W3CNF.USERHOME+"helpers/notice/"+id+"/head.htm"];
    W3GUI._callbackObject_(id,W3TXT.noticeItem,key,urls,func);
}
W3GUI.getNoticeData = function(id,func){
    var url = W3CNF.USERHOME+"helpers/notice/"+id+"/data/index.htm";
    W3GUI._callbackArray_(null,url,func);
}

/** switch view */
W3GUI.showArticle = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.USERHOME+"article/"+id+"/body.htm";
    readerTracer(id,"paper.view.tracer");
}
W3GUI.showPicture = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/item-album.htm?"+id;
    readerTracer(id,"album.view.tracer");
}

/** admin */
W3GUI.editArticle = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-paper.htm?"+id;
}
W3GUI.editPicture = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-album.htm?"+id;
}
W3GUI.editAddress = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-links.htm?"+id;
}
W3GUI.editNotice = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/item-notice.htm?"+id;
}

// commit
W3GUI.commitArticle = function(){
    W3GUI.ARTICLE_LABEL.clear();
    W3GUI.ARTICLE_LABEL.loadFormFile(W3GUI.avoidClientCache(W3CNF.USERHOME+"indexer/article/label/item.htm"));
	W3GUI.commitCommon("list-paper.htm",W3GUI.KEY_PREFIX.ART);

}
W3GUI.commitAddress = function(){
    W3GUI.ADDRESS_LABEL.clear();
    W3GUI.ADDRESS_LABEL.loadFormFile(W3GUI.avoidClientCache(W3CNF.USERHOME+"indexer/address/label/item.htm"));
	W3GUI.commitCommon("list-links.htm",W3GUI.KEY_PREFIX.ADD);
}
W3GUI.commitPicture = function(){
    W3GUI.GALLERY_LABEL.clear();
    W3GUI.GALLERY_LABEL.loadFormFile(W3GUI.avoidClientCache(W3CNF.USERHOME+"indexer/gallery/label/item.htm"));
	W3GUI.commitCommon("list-album.htm",W3GUI.KEY_PREFIX.GLY);
}
W3GUI.commitNotice = function(){
	W3GUI.commitCommon("list-notice.htm",W3GUI.KEY_PREFIX.NTC);
}
W3GUI.commitCommon = function(url,key){
    if(key != null){
	    for(var pk in W3GUI.POOL){
	        if(pk.indexOf(key) >= 0){
	           W3GUI.POOL[pk] = null;
	        }
	    }
    }
    
    if(url != null){
        if((W3GUI.LISTWINOBJW.location+"").indexOf(url)>0){
            W3GUI.LISTWINOBJW.update();
        }
    }
}
// delete
W3GUI.deleteArticle = function(id){
    if(!W3GUI.deleteCommon("paper.edit.delete",id,W3GUI.KEY_PREFIX.ART)) return;
    W3GUI.LISTWINOBJW.update();
}
W3GUI.deleteAddress = function(id){
    if(!W3GUI.deleteCommon("links.delete",id,W3GUI.KEY_PREFIX.ADD)) return;
    W3GUI.LISTWINOBJW.update();
}
W3GUI.deletePicture = function(id){
    if(!W3GUI.deleteCommon("album.edit.delete",id,W3GUI.KEY_PREFIX.GLY)) return;
    W3GUI.LISTWINOBJW.update();
}
W3GUI.deleteBoard = function(id){
    if(!W3GUI.deleteCommon("board.delete",id,W3GUI.KEY_PREFIX.BRD)) return;
    W3GUI.ITEMWINOBJW.update();
    if((W3GUI.LISTWINOBJW.location+"").indexOf("list-board.htm")>0){
        W3GUI.LISTWINOBJW.update();
    }
}
W3GUI.deleteNotice = function(id){
    if(!W3GUI.deleteCommon("notice.edit.delete",id,W3GUI.KEY_PREFIX.NTC)) return;
    W3GUI.LISTWINOBJW.update();
}

W3GUI.deleteCommon = function(code,pid,key){
    if(code==null || pid == null){
        alert(W3CNF.getI18nString("warn.nullval"));
        return false;
    }
    if(!window.confirm(W3CNF.getI18nString("info.delete.confirm"))){
        return false;
    }
    
    var url = W3CNF.getServerURL(code);
    url = W3GUI.wrapUID(url)+"&PID="+pid;
    
    var rtv = A9Loader.syncLoadText(url);
    if(rtv == "info.success"){
    	if(key != null){
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
        }
        return true;
    }else{
        alert(W3CNF.getI18nString(rtv));
        return false;
    }
}

/** private */
W3GUI._callbackObject_ = function(id,clzz,key,urls,func){
    if(key == null){alert("key@_callbackObject_ is null");return;}
    if(W3GUI.POOL[key] == null){
        A9Loader.asyncLoadText(function(us,ts){
            var map = {};
            
            if(id != null) map['id']=id;
            var vwtkn = "helpers/status/read/";
            for(var x=0;x<ts.length;x++){
                if(ts[x] == null) continue;
                
                if(us[x].indexOf(vwtkn)<0){
                    var tmp = ts[x].split(/[\r\n]/);
                    for(var i=0; i<tmp.length; i++){
                        var pos = tmp[i].indexOf("=");
                        if(pos <0) continue;
                        var key = tmp[i].substr(0,pos).replace(/^[ \t]+/g,"").replace(/[ \t]+$/g,"");
                        var val = tmp[i].substr(pos+1);
                        map[key] = val;
                    }
                }else{
                    map["views"] = (ts[x]==null||ts[x]=="")?0:ts[x];
                }
            }
            W3GUI.POOL[key] = clzz == null?map:new clzz(map);
            func(W3GUI.POOL[key]);
        },W3GUI.avoidClientCache(urls));
    }else{
        func(W3GUI.POOL[key]);
    }
}

W3GUI._callbackArray_ = function(key,url,func){
    if(key == null || W3GUI.POOL[key] == null){
        A9Loader.asyncLoadText(function(u,t){
            var arr = [];
            if(t != null && t != ""){
                var tmp = t.split(/[\r\n]+/);
                var arr = [];
                for(var i=0; i<tmp.length; i++) {
                    if(tmp[i] != "")
                    arr.push(W3TXT.line2text(tmp[i]));
                }
            }
            if(key != null) {
                W3GUI.POOL[key] = arr.reverse();
                func(W3GUI.POOL[key]);
            }else{
                func(arr.reverse());
            }
        },W3GUI.avoidClientCache(url));
    }else{
        func(W3GUI.POOL[key]);
    }
}
W3GUI.avoidClientCache = function(urls){
    if(urls == null) return null;
    var tm = new Date().getTime();
    if(typeof(urls) == "string"){
        urls = urls+(urls.indexOf("?")>0?"&":"?")+tm;
    }else{
        for(var i=0;i<urls.length;i++){
            urls[i] = urls[i]+(urls[i].indexOf("?")>0?"&":"?")+tm;
        }
    }
    return urls;
}

W3GUI.wrapUID = function(urls){
    if(urls == null) return null;
    var tm = new Date().getTime();
    if(typeof(urls) == "string"){
        urls += (urls.indexOf("?")>0?"&":"?")+"UID="+W3CNF.USER;
    }else{
        for(var i=0;i<urls.length;i++){
            urls[i] += (urls[i].indexOf("?")>0?"&":"?")+"UID="+W3CNF.USER;
        }
    }
    return urls;
}

W3GUI._getDocumentByObject_ = function(obj){
    if(obj == null) return null;
    
    var doc = obj.parentNode
    while(doc != null && doc.getElementById == null){
        doc = doc.parentNode;
    }
    return doc;
}

//
W3GUI.asyncLoadText = function(func,url){
    A9Loader.asyncLoadText(function(u,t){
        func(t);
    },url);
}

function readerTracer(pid,code){
    var url = W3CNF.getServerURL(code);
    url += (url.indexOf("?")>0?"&":"?")+"UID="+W3CNF.USER+"&PID="+pid;
    A9Loader.asyncLoadText(function(u,t){
    },W3GUI.avoidClientCache(url));
}
function getMenuInfoByStat(prefix){
	var mt = W3GUI.STAT.getValue(prefix+".mtime");
	if(mt == null){
		mt = "";
	}else{
		mt = mt.replace(/\D+/g,"");
		mt = mt.substr(2,6);
	}
	var cn = W3GUI.STAT.getValue(prefix+".count");
	if(cn == null) cn = 0;
	return mt+"<br />"+cn;
}

// init
W3GUI.MENU.loadFormFile(W3CNF.USERHOME+"profile/menu.htm");
W3GUI.STAT.loadFormFile(W3CNF.USERHOME+"helpers/status/info/stat.htm");
W3GUI.ARTICLE_LABEL.loadFormFile(W3CNF.USERHOME+"indexer/article/label/item.htm");
W3GUI.GALLERY_LABEL.loadFormFile(W3CNF.USERHOME+"indexer/gallery/label/item.htm");
W3GUI.ADDRESS_LABEL.loadFormFile(W3CNF.USERHOME+"indexer/address/label/item.htm");