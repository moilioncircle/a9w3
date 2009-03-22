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
    ART_STR_LNK : "StarArticle",
    ADD_STR_LNK : "StarAddress",
    GLY_STR_LNK : "StarGallery",
    ART_ALL_LNK : W3GUI.KEY_PREFIX.ART+"All.Link",
    ART_TTL_LNK : W3GUI.KEY_PREFIX.ART+"Total.Link",
    ART_TOP_LNK : W3GUI.KEY_PREFIX.ART+"Top.Link",
    ART_LBL_LST : W3GUI.KEY_PREFIX.ART+"Label.List",
    ART_LBL_LNK : W3GUI.KEY_PREFIX.ART+"Label.Link.",
    ART_MNT_LST : W3GUI.KEY_PREFIX.ART+"Month.List",
    ART_MNT_LNK : W3GUI.KEY_PREFIX.ART+"Month.Link.",
    ART_ITM     : W3GUI.KEY_PREFIX.ART+"Item.",
    ADD_ALL_LNK : W3GUI.KEY_PREFIX.ADD+"All.Link",
    ADD_TTL_LNK : W3GUI.KEY_PREFIX.ADD+"Total.Link",
    ADD_TOP_LNK : W3GUI.KEY_PREFIX.ADD+"Top.Link",
    ADD_LBL_LST : W3GUI.KEY_PREFIX.ADD+"Label.List",
    ADD_LBL_LNK : W3GUI.KEY_PREFIX.ADD+"Label.Link.",
    ADD_MNT_LST : W3GUI.KEY_PREFIX.ADD+"Month.List",
    ADD_MNT_LNK : W3GUI.KEY_PREFIX.ADD+"Month.Link.",
    ADD_ITM     : W3GUI.KEY_PREFIX.ADD+"Item.",
    GLY_ALL_LNK : W3GUI.KEY_PREFIX.GLY+"All.Link",
    GLY_TTL_LNK : W3GUI.KEY_PREFIX.GLY+"Total.Link",
    GLY_TOP_LNK : W3GUI.KEY_PREFIX.GLY+"Top.Link",
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
            eval("infoText="+infoText+"();");
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
        html+= "<td width='220'><a href='javascript:W3GUI.showHome()'><img src='"+icon+"' border='0'/></a></td>";
        html+= "<td style='vertical-align:middle;text-align:left;'>"+text+"</td>";
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

W3GUI.showHome = function(){
    try{
        W3GUI.LISTWINOBJW.location = W3CNF.CONF.getValue("page.list.url");
        W3GUI.ITEMWINOBJW.location = W3CNF.CONF.getValue("page.item.url");
    }catch(e){
    }
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

/** * **/
// total link
W3GUI.getCommonTotalLink = function(topk,ttlk,allk,url,func){
    W3GUI._initTopLink_(topk);
    W3GUI._callbackArray_(ttlk,url,function(ls){
        if(W3GUI.POOL[allk] == null){
            var arr=[];
            for(var i=0;i<W3GUI.POOL[topk].length;i++){
                if(W3GUI.POOL[topk][i] != ''){
                    arr.push(W3GUI.POOL[topk][i]);
                }
            }
            
            for(var j=0;j<ls.length;j++){
                var more = false;
                for(var i=0;i<W3GUI.POOL[topk].length;i++){
                    if(W3GUI.POOL[topk][i] == ls[j]){
                        more = true;
                        break;
                    }
                }
                if(!more) arr.push(ls[j]);
            }

            W3GUI.POOL[allk]=arr;
        }
        func(W3GUI.POOL[allk]);
    });
}
W3GUI.getArticleTotalLink = function(func){
    var topk=W3GUI.KEY.ART_TOP_LNK;
    var ttlk=W3GUI.KEY.ART_TTL_LNK;
    var allk=W3GUI.KEY.ART_ALL_LNK;
    var url = W3CNF.USERHOME+"indexer/article/total/item.htm";
    W3GUI.getCommonTotalLink(topk,ttlk,allk,url,func);
}
W3GUI.getAddressTotalLink = function(func){
    var topk=W3GUI.KEY.ADD_TOP_LNK;
    var ttlk=W3GUI.KEY.ADD_TTL_LNK;
    var allk=W3GUI.KEY.ADD_ALL_LNK;
    var url = W3CNF.USERHOME+"indexer/address/total/item.htm";
    W3GUI.getCommonTotalLink(topk,ttlk,allk,url,func);
}
W3GUI.getGalleryTotalLink = function(func){
    var topk=W3GUI.KEY.GLY_TOP_LNK;
    var ttlk=W3GUI.KEY.GLY_TTL_LNK;
    var allk=W3GUI.KEY.GLY_ALL_LNK;
    var url = W3CNF.USERHOME+"indexer/gallery/total/item.htm";
    W3GUI.getCommonTotalLink(topk,ttlk,allk,url,func);
}

// label list
W3GUI.getCommonLabelList = function(key,label){
    if(W3GUI.POOL[key] == null){
        var kv  = label.getKeyValClone();
        var arr = [];
        for(var k in kv){
            arr.push(k);
        }
        W3GUI.POOL[key] = arr;
    }
}
W3GUI.getArticleLabelList = function(func){
    W3GUI.getCommonLabelList(W3GUI.KEY.ART_LBL_LST,W3GUI.ARTICLE_LABEL);
    func(W3GUI.POOL[W3GUI.KEY.ART_LBL_LST]);
}
W3GUI.getAddressLabelList = function(func){
    W3GUI.getCommonLabelList(W3GUI.KEY.ADD_LBL_LST,W3GUI.ADDRESS_LABEL);
    func(W3GUI.POOL[W3GUI.KEY.ADD_LBL_LST]);
}
W3GUI.getGalleryLabelList = function(func){
    W3GUI.getCommonLabelList(W3GUI.KEY.GLY_LBL_LST,W3GUI.GALLERY_LABEL);
    func(W3GUI.POOL[W3GUI.KEY.GLY_LBL_LST]);
}
// label link
W3GUI.getArticleLabelLink = function(id,func){
    var key = W3GUI.KEY.ART_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/article/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getAddressLabelLink = function(id,func){
    var key = W3GUI.KEY.ADD_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/address/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryLabelLink = function(id,func){
    var key = W3GUI.KEY.GLY_LBL_LNK+id;
    var url = W3CNF.USERHOME+"indexer/gallery/label/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}

// month list
W3GUI.getArticleMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/article/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ART_MNT_LST,url,func);
}
W3GUI.getAddressMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/address/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.ADD_MNT_LST,url,func);
}
W3GUI.getGalleryMonthList = function(func){
    var url = W3CNF.USERHOME+"indexer/gallery/month/item.htm";
    W3GUI._callbackArray_(W3GUI.KEY.GLY_MNT_LST,url,func);
}
// month link
W3GUI.getAddressMonthLink = function(id,func){
    var key = W3GUI.KEY.ADD_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/address/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getArticleMonthLink = function(id,func){
    var key = W3GUI.KEY.ART_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/article/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}
W3GUI.getGalleryMonthLink = function(id,func){
    var key = W3GUI.KEY.GLY_MNT_LNK+id;
    var url = W3CNF.USERHOME+"indexer/gallery/month/"+id+"/item.htm";
    W3GUI._callbackArray_(key,url,func);
}

// stars link
W3GUI.getArticleStarsLink = function(func){
    W3GUI._readCookie_(W3GUI.KEY.ART_STR_LNK,func);
}
W3GUI.getAddressStarsLink = function(func){
    W3GUI._readCookie_(W3GUI.KEY.ADD_STR_LNK,func);
}
W3GUI.getGalleryStarsLink = function(func){
    W3GUI._readCookie_(W3GUI.KEY.GLY_STR_LNK,func);
}

//
W3GUI.getBoardLink = function(func){
    var url = W3CNF.USERHOME+"helpers/board/00000000000000000.htm";
    W3GUI._callbackArray_(null,url,func);
}
W3GUI.getNoticeLink = function(func){
    var url = W3CNF.USERHOME+"helpers/notice/00000000000000.htm";
    W3GUI._callbackArray_(W3GUI.KEY.NTC_LNK,url,func);
}

// item 
W3GUI.getArticleItem = function(id,func){
    var key = W3GUI.KEY.ART_ITM+id;
    var urls = [W3CNF.USERHOME+"article/"+id+"/head.htm",
                W3CNF.USERHOME+"helpers/status/read/article/"+id+"-hit.htm"];
    W3GUI._callbackObject_(id,W3TXT.articleItem,key,urls,func);
}
W3GUI.getAddressItem = function(id,func){
    var key = W3GUI.KEY.ADD_ITM+id;
    var urls = [W3CNF.USERHOME+"address/"+id+".htm"];
    W3GUI._callbackObject_(id,W3TXT.addressItem,key,urls,func);
}
W3GUI.getGalleryItem = function(id,func){
    var key = W3GUI.KEY.GLY_ITM+id;
    var urls = [W3CNF.USERHOME+"gallery/info/"+id+".htm",
                W3CNF.USERHOME+"helpers/status/read/gallery/"+id+"-hit.htm"];
    W3GUI._callbackObject_(id,W3TXT.galleryItem,key,urls,func);
}
W3GUI.getBoardItem = function(id,func){
    var key = W3GUI.KEY.BRD_ITM+id;
    var urls = [W3CNF.USERHOME+"helpers/board/"+id+".htm"];
    W3GUI._callbackObject_(id,W3TXT.messageItem,key,urls,func);
}
W3GUI.getNoticeItem = function(id,func){
    var key = W3GUI.KEY.NTC_ITM+id;
    var urls = [W3CNF.USERHOME+"helpers/notice/"+id+"/head.htm"];
    W3GUI._callbackObject_(id,W3TXT.noticeItem,key,urls,func);
}
// data
W3GUI.getArticleData = function(id,func){
    var url = W3CNF.USERHOME+"article/"+id+"/data/index.htm";
    W3GUI._callbackArray_(null,url,func);
}
W3GUI.getNoticeData = function(id,func){
    var url = W3CNF.USERHOME+"helpers/notice/"+id+"/data/index.htm";
    W3GUI._callbackArray_(null,url,func);
}

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

/** switch view */
W3GUI.showArticle = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.USERHOME+"article/"+id+"/body.htm";
    readerTracer(id,"paper.view.tracer");
}
W3GUI.showPicture = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/item-album.htm?"+id;
    readerTracer(id,"album.view.tracer");
}
W3GUI.showNotice = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.USERHOME+"helpers/notice/"+id+"/body.htm";
}

W3GUI.showArticleURL = function(id){
    var url = W3CNF.USERHOME+"article/"+id+"/body.htm";
    if(window.prompt("do you want to open in new window ?",url)){
        window.open(url);
    }
}
W3GUI.showPictureURL = function(id,tp){
    var url = W3CNF.USERHOME+"gallery/data/"+id+"."+tp;
    if(window.prompt("do you want to open in new window ?",url)){
        window.open(url);
    }
}
W3GUI.showNoticeURL = function(id){
    var url = W3CNF.USERHOME+"helpers/notice/"+id+"/body.htm";
    if(window.prompt("do you want to open in new window ?",url)){
        window.open(url);
    }
}
// stars @return status
W3GUI.starArticle = function(id){
    return W3GUI._writeCookie_(W3GUI.KEY.ART_STR_LNK,id);
}
W3GUI.starPicture = function(id){
    return W3GUI._writeCookie_(W3GUI.KEY.GLY_STR_LNK,id);
}
W3GUI.starAddress = function(id){
    return W3GUI._writeCookie_(W3GUI.KEY.ADD_STR_LNK,id);
}
W3GUI.isStarArticle = function(id){
    return W3GUI._isStarItem_(W3GUI.KEY.ART_STR_LNK,id);
}
W3GUI.isStarPicture = function(id){
    return W3GUI._isStarItem_(W3GUI.KEY.GLY_STR_LNK,id);
}
W3GUI.isStarAddress = function(id){
    return W3GUI._isStarItem_(W3GUI.KEY.ADD_STR_LNK,id);
}
W3GUI._isStarItem_ = function(key,id){
    if(key == null) return false;
    
    if(W3GUI.POOL[key] == null){
        W3GUI._readCookie_(key,null);
    }
    for(var i=0;i<W3GUI.POOL[key].length;i++){
        if(W3GUI.POOL[key][i] == id) return true;
    }
    return false;
}

W3GUI._readCookie_ = function(key,func){
    if(key == null){alert("key@_starCookie_ is null");return;}
    var ckkeys = [W3GUI.KEY.ART_STR_LNK,W3GUI.KEY.ADD_STR_LNK,W3GUI.KEY.GLY_STR_LNK];
    try{
        if(W3GUI.POOL[key] == null){
            // get cookie
            var ckarr = document.cookie.split(/; */);
            for(var i=0;i<ckarr.length;i++){
                var pos = ckarr[i].indexOf('=');
                if(pos<0) continue;
                var k = ckarr[i].substr(0,pos).replace(/\s*/g,'');
                var v = unescape(ckarr[i].substr(pos+1));
                for(var j=0;j<ckkeys.length;j++){
                    if(k==ckkeys[j]){
                        W3GUI.POOL[k]=v.split("|");
                        break;
                    }
                }
            }
            for(var i=0;i<ckkeys.length;i++){
                if(W3GUI.POOL[ckkeys[i]] == null){
                    W3GUI.POOL[ckkeys[i]] = [];
                }
            }
        }
    }catch(e){
        alert(e);
        for(var i=0;i<ckkeys.length;i++){
            W3GUI.POOL[ckkeys[i]] = [];
        }
    }
    if(func != null){
        func(W3GUI.POOL[key]);
    }
}
W3GUI._writeCookie_ = function(key,id){
    if(key == null) return false;
    var isStar = false;
    if(W3GUI.POOL[key] == null){
        W3GUI._readCookie_(key,null);
    }
    var arr = [];
    for(var i=0;i<W3GUI.POOL[key].length;i++){
        if(W3GUI.POOL[key][i] == id){
            isStar = true;
        }
        arr.push(W3GUI.POOL[key][i]);
    }
    if(!isStar){
        arr.push(id);
    }
    
    W3GUI.POOL[key]=arr;
    
    var ckkeys = [W3GUI.KEY.ART_STR_LNK,W3GUI.KEY.ADD_STR_LNK,W3GUI.KEY.GLY_STR_LNK];
    var ckbuff = [];
    for(var i=0;i<ckkeys.length;i++){
        ckbuff.push(ckkeys[i]+"="+escape(W3GUI.POOL[ckkeys[i]].join("|"))); // key:escape(val)
    }
    var days  = 360;
    var expd = new Date();
        expd.setTime(expd.getTime() + days*24*60*60*1000);
    var expstr = ";expires=" + expd.toGMTString();
    try{
        for(var i=0;i<ckbuff.length;i++){
            document.cookie = ckbuff[i]+expstr;
        }
    }catch(e){
        alert(e);
        return false;
    }
    return !isStar;
}

// top
W3GUI.topArticle = function(id){
    return W3GUI._topItem_(W3GUI.KEY.ART_TOP_LNK,id,'paper.edit.settop');
}
W3GUI.topPicture = function(id){
    return W3GUI._topItem_(W3GUI.KEY.GLY_TOP_LNK,id,'album.edit.settop');
}
W3GUI.topAddress = function(id){
    return W3GUI._topItem_(W3GUI.KEY.ADD_TOP_LNK,id,'links.edit.settop');
}
W3GUI.isTopArticle = function(id){
    return W3GUI._isTopItem_(W3GUI.KEY.ART_TOP_LNK,id);
}
W3GUI.isTopPicture = function(id){
    return W3GUI._isTopItem_(W3GUI.KEY.GLY_TOP_LNK,id);
}
W3GUI.isTopAddress = function(id){
    return W3GUI._isTopItem_(W3GUI.KEY.ADD_TOP_LNK,id);
}

W3GUI._isTopItem_ = function(key,id){
    if(key == null) return false;
    W3GUI._initTopLink_(key);
    for(var i=0;i<W3GUI.POOL[key].length;i++){
        if(W3GUI.POOL[key][i] == id) return true;
    }
    return false;
}

W3GUI._topItem_ = function(key,id,code){
    if(key == null) return false;
    W3GUI._initTopLink_(key);
    var isTop = false;
    var arr = [];
    for(var i=W3GUI.POOL[key].length-1;i>=0;i--){
        if(W3GUI.POOL[key][i] == id){
            isTop = true;
            continue;
        }
        arr.push(W3GUI.POOL[key][i]);
    }
    if(!isTop){
        arr.push(id);
    }
    
    var url = W3CNF.getServerURL(code);
    url = W3GUI.wrapUID(url)+"&PID="+id;
    
    var rtv = A9Loader.syncLoadText(url);
    rtv = W3TXT.trimEmpty(rtv);
    if(rtv == "info.success"){
        W3GUI.POOL[key] = arr.reverse();
        return !isTop;
    }else{
        alert(W3CNF.getI18nString(rtv));
    }
    return isTop;
}

W3GUI._initTopLink_ = function(key){
    if(key == null) return;
    if(W3GUI.POOL[key] == null){
        var url;
        if(key==W3GUI.KEY.ART_TOP_LNK){
            url = W3CNF.USERHOME+"indexer/article/total/top.htm";
        }else if(key==W3GUI.KEY.ADD_TOP_LNK){
            url = W3CNF.USERHOME+"indexer/address/total/top.htm";
        }else if(key==W3GUI.KEY.GLY_TOP_LNK){
            url = W3CNF.USERHOME+"indexer/gallery/total/top.htm";
        }else{
            W3GUI.POOL[key]=[];
            return;
        }
        var rtv = A9Loader.syncLoadText(url);
        var arr = [];
        if(rtv != null && rtv != ""){
            var tmp = rtv.split(/[\r\n]+/);
            for(var i=0; i<tmp.length; i++) {
                if(tmp[i] != "")
                arr.push(W3TXT.line2text(tmp[i]));
            }
        }
        W3GUI.POOL[key]=arr;
    }
}

// hitlog
W3GUI.seeHitLogArticle = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/item-hitlog.htm?article/"+id;
}
W3GUI.seeHitLogPicture = function(id){
    W3GUI.ITEMWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/item-hitlog.htm?gallery/"+id;
}

/** admin */
W3GUI.onAdminLogin = function(){
    W3CNF.A9W3_RTMODE = W3CNF.A9W3_WRITER;
    W3GUI.LISTWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/writer/list-admin.htm";
}
W3GUI.onAdminLogout = function(){
    W3CNF.A9W3_RTMODE = W3CNF.A9W3_READER;
    W3GUI.LISTWINOBJW.location=W3CNF.A9W3HOME+"a9w3-engine/view/reader/list-admin.htm";
}
// edit
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
    rtv = W3TXT.trimEmpty(rtv);
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

/** */
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
                        var val = tmp[i].substr(pos+1).replace(/^[ \t]+/g,"");
                        map[key] = val;
                    }
                }else{
                    ts[x] = W3TXT.trimEmpty(ts[x]);
                    map["views"] = (/^\d+$/.test(ts[x]))?ts[x]:0;
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

W3GUI.changeCss = function(obj,cname){
    obj.className = cname;
}

// sync init
W3GUI.asyncInit = function(func){
    var rUrls = [
        W3CNF.USERHOME+"profile/menu.htm",
        W3CNF.USERHOME+"helpers/status/info/stat.htm",
        W3CNF.USERHOME+"indexer/article/label/item.htm",
        W3CNF.USERHOME+"indexer/gallery/label/item.htm",
        W3CNF.USERHOME+"indexer/address/label/item.htm"
    ];
    var rCnfs = [
        W3GUI.MENU,
        W3GUI.STAT,
        W3GUI.ARTICLE_LABEL,
        W3GUI.GALLERY_LABEL,
        W3GUI.ADDRESS_LABEL
    ];
    A9Loader.asyncLoadText(function(urls,txts){
        for(var i=0;i<urls.length;i++){
            for(var j=0;j<rUrls.length;j++){
                if(rUrls[j]==urls[i]){
                    rCnfs[j].loadFromText(txts[i]);
                    break;
                }
            }
        }
        // callback
        if(func != null){
            func();
        }
    },rUrls
    );
}