/**
UTF8(BOM)  LGPL  trydofor.com  Feb.2008
===========================================================
tools for tracing
*/

var PageInfo = function()
{
    var path = null;
    var name = null;
    var info = null;
    var args = {};
    
    function parse(url)
    {
        var theURL = url == null?self.location.href:url;
        
        var questPos = theURL.indexOf('?');
        var sharpPos = theURL.indexOf('#');
        
        var argsPos = questPos;
        if(argsPos < 0 ) argsPos = sharpPos;
        if(questPos >=0 && sharpPos >=0) argsPos = sharpPos<questPos?sharpPos:questPos;
        
        var pureUrl = argsPos<0?theURL:theURL.substring(0,argsPos);
        var slashPos = pureUrl.lastIndexOf('/') + 1;
        
        path = theURL.substring(0,slashPos);
        name = argsPos>slashPos ? theURL.substring(slashPos,argsPos):theURL.substr(slashPos);
        
        // URL_ARGS
        if(argsPos > slashPos)
        {
            var queryString = theURL.substr(argsPos+1);
            var equalPos = 0;
            var keyValArray = queryString.split("&");
            
            for( var i = 0 ; i < keyValArray.length; i++)
            {
                equalPos = keyValArray[i].indexOf("=");
                if(equalPos > 0)
                    args[keyValArray[i].substring(0,equalPos)] = keyValArray[i].substr(equalPos+1);
                else
                    args[keyValArray[i]] = "";
            }
            
            info = queryString;
        }
    }
    
    //
    this.parse = parse;
    this.path = path;
    this.name = name;
    this.info = info;
    this.args = args;
}
