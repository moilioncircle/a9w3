/**
UTF8(BOM)  LGPL  trydofor.com  Sep.2007
===========================================================
config file (properties) reader

void loadFormFile(file)
    load a xml from file

void loadFromText(text)
    load a xml from string

String getValue(key)
    get the value by key
    key : (NOT null)

String getKey(val)
    get the key(s) by val
    val : (NOT null)
    
String getKeyArray(val)
    get the key(s) in array
    val : (NOT null)
    
void put(key,val)
    put key val map
    
Object getKeyValClone()
    get the private keyval map

void clear()
	clear all key-values
*/

var CnfReaderClass = function()
{
    var __kvMap__ = {};
    var __vkMap__ = {};
    
    function __loadFormFile__(file)
    {
        var __xmlhttp__ = ['MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
        var xmlhttp = null;
        if (window.ActiveXObject) // IE
        {
            for (var i=0;i<__xmlhttp__.length;i++)
                try { xmlhttp = new ActiveXObject( __xmlhttp__[i] );break;}catch(e){};
        }
        else // Mozilla, Firefox, Opera, etc.
        {
            xmlhttp =new XMLHttpRequest();
        }
        
        if(xmlhttp == null) throw "your browser do not support XMLHttpRequest!";
        
        xmlhttp.open("get",file,false);
        xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        xmlhttp.send(null);
        
        __loadFromText__(xmlhttp.responseText);
        delete xmlhttp;
    }
    
    function __loadFromText__(text)
    {
        if(text == null || text == "") return;
        
        var __regexp_comment__ = /^[ \t]*#/;
        var __regexp_keyval__ = /^[ \t]*([^= \t]+)[ \t]*=[ \t]*(.*)$/;
        
        var lines = text.split(/[\r\n]+/);
        for(var i=0;i<lines.length;i++)
        {
            if(__regexp_comment__.test(lines[i])) continue;
            if(__regexp_keyval__.test(lines[i]))
            {
            	var key = RegExp.$1;
            	var val = RegExp.$2.replace(/[ \t]+$/,'');
                __putKeyVal__(key,val);
            }
        }
    }
    function __putKeyVal__(key,val)
    {
        if(key == null) return;
        
        __kvMap__[key] = val;
        var hv = __vkMap__[val];
        if(hv == null){
            __vkMap__[val] = key;
        }else if (typeof(hv) == 'string'){
            __vkMap__[val] = [hv,key];
        }else{
            __vkMap__[val].push(key);
        }
    }
    //
    this.loadFromText = __loadFromText__;
    this.loadFormFile = __loadFormFile__;
    this.put = __putKeyVal__;
    
    this.getValue = function(key)
    {
        if(key == null) return null;
        return __kvMap__[key];
    }
    
    this.getKey = function(val)
    {
        if(val == null) return null;
        return __vkMap__[val];
    }
    
    this.getKeyArray = function(val)
    {
        if(val == null) return null;
        var hv = __vkMap__[val];
        if(hv == null){
            return [];
        }else if (typeof(hv) == 'string'){
            return [hv];
        }else{
            return hv;
        }
    }
    
    this.getKeyValClone = function()
    {
        var map = {};
        for(var k in __kvMap__)
        {
            map[k] = __kvMap__[k];
        }
        return map;
    }
    
    this.clear = function()
    {
    	__kvMap__ = {};
    	__vkMap__ = {};
    }
}
