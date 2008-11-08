var W3CNF = {};

/** const */
W3CNF.PAGE_SIZE = 5;
W3CNF.A9W3_READER = "reader";
W3CNF.A9W3_WRITER = "writer";
W3CNF.A9W3_RTMODE = W3CNF.A9W3_WRITER;

/** sync */
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

W3CNF.CONF = new CnfReaderClass();
W3CNF.CONF.loadFormFile(W3CNF.USERHOME+"profile/config.htm");

W3CNF.LANG = W3CNF.CONF.getValue("lang");

/** async */
W3CNF.UPLOAD = new CnfReaderClass();
//W3CNF.UPLOAD.loadFormFile(W3CNF.USERHOME+"a9w3-server/upload.htm");
A9Loader.asyncLoadText(function(u,t){
    W3CNF.UPLOAD.clear();
    W3CNF.UPLOAD.loadFromText(t);
},W3CNF.A9W3HOME+"a9w3-server/upload.htm");
//
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

W3CNF.getI18nString = function(){
    var en = new CnfReaderClass();
    en.loadFormFile(W3CNF.A9W3HOME+"a9w3-engine/i18n/en.htm");
    
    var lc = en;
    if(W3CNF.LANG != 'en'){
        lc = new CnfReaderClass();
        A9Loader.asyncLoadText(function(u,t){
            lc.loadFromText(t)
        },W3CNF.A9W3HOME+"a9w3-engine/i18n/"+W3CNF.LANG+".htm");
    }
    
    return function(key){
        var str = lc.getValue(key);
        if(str == null || str.length ==0) str = en.getValue(key);
        return key+"\n"+str;
    }
}();
