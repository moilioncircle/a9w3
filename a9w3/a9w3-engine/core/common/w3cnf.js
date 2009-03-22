var W3CNF = {};

/** const */
W3CNF.PAGE_SIZE_ALBUM  = 5;
W3CNF.PAGE_SIZE_PAPER  = 10;
W3CNF.PAGE_SIZE_BOARD  = 10;
W3CNF.PAGE_SIZE_LINKS  = 10;
W3CNF.PAGE_SIZE_NOTICE = 10;

W3CNF.A9W3_READER = "reader";
W3CNF.A9W3_WRITER = "writer";
W3CNF.A9W3_RTMODE = W3CNF.A9W3_READER;

W3CNF.A9W3HOME = function(){
    var rs = A9Loader.getPagePath();
    var cp = A9Loader.getCorePath();
    var i = cp.indexOf("a9w3-engine");

    if(i>0){
    	rs =(cp.indexOf(rs)<0?rs:"")+cp.substring(0,i);
        if(rs.charAt(rs.length-1)!='/') rs = rs+"/";
    }
    return rs;
}();

/** sync */
W3CNF.USER = function(){
    var userCnf = new CnfReaderClass();
    userCnf.loadFormFile(W3CNF.A9W3HOME+"a9w3-engine/conf/users.htm");
    var kvmap = userCnf.getKeyValClone();
    
    var user = null;
    
    // get user from querystring
    if(kvmap['querykey'] != null && kvmap['querykey'] != ""){
        var key = kvmap['querykey'];
        var url = self.location.href;
        var pos = url.indexOf(key);
        if(pos>=0){
            var p1=url.indexOf('=',pos+key.length);
            var p2=url.indexOf('&',pos+key.length);
            
            if(p1>0){
                user = url.substring(p1+1,p2>0?p2:url.length);
            }
        }
    }
    
    // get user from hostname
    if(user == null && location.protocol != "file:"){
        var token = "user.";
        var htn = self.location.hostname;
        for(var us in kvmap){
            if(us.indexOf(token) !=0) continue;
            var reg = new RegExp(kvmap[us], "gi");
            if(reg.test(htn)){
               user = us.substr(token.length);
               break; 
            }
        }        
    }
    
    return user == null?kvmap['default']:user;
}();

W3CNF.USERHOME = W3CNF.A9W3HOME+"a9w3-auhome/"+W3CNF.USER+"/";

/** sync and test speed */
W3CNF.transSysVar = function(text){
    if(text == null) return text;
    if(text.indexOf('${USER_HOME}')>=0){
        text = text.replace(/\$\{USER_HOME\}/g,W3CNF.USERHOME.substr(0,W3CNF.USERHOME.length-1)); // without '/'
    }
    return text;
}
var tmsta = (new Date()).getTime();
var uconf = A9Loader.syncLoadText(W3CNF.USERHOME+"profile/config.htm");
    uconf = W3CNF.transSysVar(uconf);
var tmcst = (new Date()).getTime()-tmsta;
W3CNF.SPEED_CHAR_BS = tmcst>0?Math.ceil(uconf.length*1000/tmcst):-1;

W3CNF.CONF = new CnfReaderClass();
W3CNF.CONF.loadFromText(uconf);
W3CNF.LANG = W3CNF.CONF.getValue("lang");

/** async */
W3CNF.UPLOAD = new CnfReaderClass();
A9Loader.asyncLoadText(function(u,t){
    W3CNF.UPLOAD.clear();
    W3CNF.UPLOAD.loadFromText(t);
},W3CNF.A9W3HOME+"a9w3-server/upload.htm");

/** async */
W3CNF.getServerURL = function(){
    var sf = new CnfReaderClass();
    A9Loader.asyncLoadText(function(u,t){
        sf.loadFromText(t)
    },W3CNF.A9W3HOME+"a9w3-server/server.htm");
    
    return function(key){
        var url = sf.getValue(key);
        if(url == null || url.length ==0) return "#";
        
        if(!/https?:\/+/.test(url)){
            url = W3CNF.A9W3HOME+url;
        }
        return url;
    }
}();

/** async */
W3CNF.getI18nString = function(){
    var lc = new CnfReaderClass();
    A9Loader.asyncLoadText(function(u,t){
        lc.loadFromText(t)
    },W3CNF.A9W3HOME+"a9w3-engine/i18n/"+W3CNF.LANG+".htm");
    
    return function(key){
        var str = lc.getValue(key);
        if(str == null || str.length ==0) str = "key not found:\n"+key;
        return str;
    }
}();
