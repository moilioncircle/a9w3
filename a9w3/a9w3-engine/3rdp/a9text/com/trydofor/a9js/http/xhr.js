/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
Void setMaxActive(i)
Void setMinActive(i)
设置最大和最小活动的XMLHttpRequest数目

String doSyncRequest(method, url, data)
String doSyncGet(url,data)
String doSyncPost(url,data)

Void doAsyncRequest(method, url, callback, data)
Void doAsyncGet( url, callback,data)
Void doAsyncPost( url, callback, data)
    *callback = function(url,text)
*/

var XmlHttpRequestClass = function()
{
    var __maxActive__    = 3;
    var __minActive__    = 1;
    var __syncXHR__      = null;
    var __activeXHR__    = [];
    var __requestQueue__ = [];
    
    /* 私有方法，尝试创建新的XMLHttpRequest */
    function __createXmlHttpRequest__()
    {
        if ( window.XMLHttpRequest )    // Gecko
        {
            return new XMLHttpRequest() ;
        }
        else if ( window.ActiveXObject )// IE
        {
            var activeXo = ['MSXML2.XMLHTTP','Microsoft.XMLHTTP'] ;
            for ( var i = 0 ; i < activeXo.length ; i++ )
            try {return new ActiveXObject( activeXo[i] );}catch (e){};
        }
        else
        {
            throw "can not create XMLHttpRequest";
        }
    }
    
    /* 私有方法，调度请求的指挥棒 */
    function __requestManager__(reqObj)
    {
        if(reqObj.resText == null) // 新消息
        {
            if(__requestQueue__.length > 0) // 有消息排队
            {
                __requestQueue__.push(reqObj);
            }
            else
            {
                var xhrObj = null;
                for(var i=0;i<__activeXHR__.length;i++)
                {
                    if(__activeXHR__[i].readyState == 4 || __activeXHR__[i].readyState == 0)
                    {
                        xhrObj = __activeXHR__[i];
                        break;
                    }
                }
                if(xhrObj != null)
                {
                    __doAsyncRequest__(xhrObj,reqObj);
                }
                else
                {
                    if(__activeXHR__.length <= __maxActive__)
                    {
                        xhrObj = __createXmlHttpRequest__();
                        __activeXHR__.push(xhrObj);
                        __doAsyncRequest__(xhrObj,reqObj);
                    }
                    else
                    {
                        __requestQueue__.push(reqObj);
                    }
                }
            }
        }
        else // 回复消息
        {
            try{
                reqObj.callback(reqObj.url,reqObj.resText);
            }catch(e){};
            
            if(__requestQueue__.length > 0) // 有消息队列
            {
                var xhrObj = null;
                for(var i=0;i<__activeXHR__.length;i++)
                {
                    if(__activeXHR__[i].readyState == 4 || __activeXHR__[i].readyState == 0)
                    {
                        xhrObj = __activeXHR__[i];
                        break;
                    }
                }
                if(xhrObj != null)
                {
                    __doAsyncRequest__(xhrObj,__requestQueue__.shift());
                }
            }
            else
            {
                var idleCnt = 0;
                for(var i=0;i<__activeXHR__.length;i++)
                    if(__activeXHR__[i].readyState == 4 || __activeXHR__[i].readyState == 0)
                        idleCnt ++;
                if(idleCnt > __minActive__ && idleCnt ==__activeXHR__.length)
                    for(var i=0;i<idleCnt - __minActive__;i++)
                    {
                        var xhrObj = __activeXHR__.shift();
                        delete xhrObj;
                    }
            }
        }
    }
    
    /* 私有方法，进行XMLHttpRequest请求 */
    function __doAsyncRequest__(xhrObj,reqObj)
    {
        xhrObj.onreadystatechange = function()
        {
            if ( xhrObj.readyState == 4 )
            {
                if (xhrObj.status == 0 || xhrObj.status == 200 || xhrObj.status == 304 )
                {
                    reqObj.resText = xhrObj.responseText==null?"":xhrObj.responseText;
                    xhrObj.abort(); // 在iE里必须设置,否则readyState在下次使用的时候永远是4
                    __requestManager__(reqObj);
                }
                else
                {
                    throw "req-url:"+reqObj.url+"(" + xhrObj.statusText + ":" + xhrObj.status + ")";
                }
            }
        }
        xhrObj.open(reqObj.method, reqObj.url,true);
        xhrObj.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        xhrObj.send(reqObj.data);
    }

    /* 公有方法，设置最大和最小活动的XMLHttpRequest数量*/
    this.setMaxActive = function(i){if(typeof i == "number") __maxActive__ = i};
    this.setMinActive = function(i){if(typeof i == "number") __minActive__ = i};
    this.newXHRequest = __createXmlHttpRequest__;

    /* 公有方法，进行异步Http请求 */
    this.doAsyncRequest = function( method, url, callback, data)
    {
        var reqObj = {};
        reqObj.method   = method;
        reqObj.url      = url;
        reqObj.callback = callback;
        reqObj.data     = data;
        reqObj.resText  = null;
        
        __requestManager__(reqObj);
    }

    /* 公有方法，进行异步Get请求 */
    this.doAsyncGet = function( url, callback,data)
    {
        this.doAsyncRequest('GET',url,callback,data);
    }
    
    /* 公有方法，进行异步Post请求 */
    this.doAsyncPost = function( url, callback, data)
    {
        this.doAsyncRequest('POST',url,callback,data);
    }
    
    /* 公有方法，同步的Http请求 */
    this.doSyncRequest = function(method,url,data)
    {
        if(__syncXHR__ == null) __syncXHR__ = __createXmlHttpRequest__();
        //
        try
        {
            __syncXHR__.open(method,url,false);
            __syncXHR__.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
            __syncXHR__.send(data);
            return __syncXHR__.responseText;
        }
        finally
        {
            __syncXHR__.abort();
        }
    }
    
    /* 公有方法，同步的GET请求 */
    this.doSyncGet = function(url,data)
    {
         return this.doSyncRequest("GET",url,data)
    }
    
    this.doSyncPost = function(url,data)
    {
         return this.doSyncRequest("POST",url,data)
    }
    
    this.toString = function()
    {
        var str = "XmlHttpRequestClass:";
        str += "\n max active:"+__maxActive__;
        str += "\n min active:"+__minActive__;
        str += "\n sync XHR:"+__syncXHR__;
        str += "\n activeXHR size:"+__activeXHR__.length;
        str += "\n requestQueue size:"+__requestQueue__.length;
        return str;
    };

}
