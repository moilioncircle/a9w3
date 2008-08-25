/**
UTF8(BOM)  LGPL  trydofor.com  Feb.2008
===========================================================
tools for tracing
*/

var Tracer = {};

    
Tracer.equals = function (left,right)
{
    if(left == null && right == null) return true;
    if((typeof left) != (typeof right)) return false;
    if(left == right)              return true;
    if(typeof left == 'boolean')   return left == right;
    if(typeof left == 'number')    return left == right;
    if(typeof left == 'string')    return left == right;
    if(typeof left == 'function')  return left == right;
    if(typeof left == 'undefined') return true;
    
    for(var k in left)  //'object'
        if(!__isEqual__(left[k],right[k])) return false
    //
    return true;
}

Tracer.getString = function (object,indent)
{
    if(object == null) return null;
    
    var str = "", ins = "";
    
    if(!(typeof indent =="number"))  indent =0;
    for(var i=0;i<indent;i++) ins += "    ";
    
    if(typeof object == "object")
    {
        for(var key in object)
        str += "\n"+ins + key+": "+__getString__(object[key],indent+1)
    }
    else
    {
        str += __replaceAll__(""+object,/[\r\n]+/,'');
    }
    return str;
}