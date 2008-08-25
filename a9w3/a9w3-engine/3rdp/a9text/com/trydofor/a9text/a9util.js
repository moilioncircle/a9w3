/**
UTF8(BOM)  LGPL  trydofor.com  Jun.2007
===========================================================
String A9Util.getFile(file,dir)
    获得相对路径到绝对路径的转换.
String A9Util.getDir(file)
    获得文件所在的目录,如果是目录,返回本身.
String A9Util.htm2txt(str,mode)
    html转义特殊字符(&gt;&lt;&quot;&nbsp;&amp;)转换.
String A9Util.txt2htm(str,mode)
    转换到html转义特殊字符(&gt;&lt;&quot;&nbsp;&amp;).
String A9Util.trimBoth(line)
    去掉左右两边的空白.
String A9Util.trimLeft(line)
    去掉左边的空白.
String A9Util.trimRight(line)
    去掉右边的空白.
String A9Util.valueBlank(line)
    等效空格处理.
String A9Util.shiftBlank(line,num)
    去掉左侧num数量的等效空白.
mumber A9Util.calTier(text)
    计算缩进层次.
boolean A9Util.isEscapeLine(para)
    是否为软换行.
String A9Util.trimEscape(text,pos)
    进行转义处理
boolean A9Util.isEscape(text,pos)
    是否为转义.
boolean A9Util.hasVariable(str)
    是否含有变量($).
String A9Util.getCRLF(text)
    获得文本换行符.
*/
var A9Util = {};

A9Util.getFile = function(file,dir)
{
    if(dir == null || dir == "" || file == null || file == "") 
        return file;
    
    if(file.indexOf('../') == 0 || file.indexOf('./') == 0)
    {
        var c = dir.charAt(dir.length -1);
        if(c !='/' && c != '\\') dir = dir+"/";
        
        return dir+file;
    }
    
    return file;
}

A9Util.getDir = function(file)
{
    if(file == null) return null;
    
    // dir    
    var c = file.charAt(file.length - 1);
    if(c == '/' || c == '\\') return file;
    
    // file
    var p1 = file.lastIndexOf('/');
    var p2 = file.lastIndexOf('\\');
    var p = p1>p2?p1:p2;
    
    return p<0?"":file.substring(0,p+1);
    
}

A9Util.htm2txt = function(str,mode)
{
    if(str == null || str == "" ) return str;
    
    if(mode == null || mode.indexOf('&gt;')>=0)
        str = str.replace(/&gt;/g,">");
    if(mode == null || mode.indexOf('&lt;')>=0)
        str = str.replace(/&lt;/g,"<");
    if(mode == null || mode.indexOf('&quot;')>=0)
        str = str.replace(/&quot;/g,'"');
    if(mode == null || mode.indexOf('&nbsp;')>=0)
        str = str.replace(/&nbsp;/g,' ');
    if(mode == null || mode.indexOf('&amp;')>=0)
        str = str.replace(/&amp;/g,"&");
    
    return str;
}

A9Util.txt2htm = function(str,mode)
{
    if(str == null || str == "" ) return str;
    
    if(mode == null || mode.indexOf('&')>=0)
        str = str.replace(/&/g,"&amp;");
    if(mode == null || mode.indexOf('<')>=0)
        str = str.replace(/</g,"&lt;");
    if(mode == null || mode.indexOf('>')>=0)
        str = str.replace(/>/g,"&gt;");
    if(mode == null || mode.indexOf('"')>=0)
        str = str.replace(/"/g,"&quot;");
    if(mode == null || mode.indexOf(' ')>=0)
    {
        str = str.replace(/ /g,"&nbsp;");
        str = str.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");    
    }
    return str;
}

A9Util.trimBoth  = function(line)
{
    if(line == null) return null;
    return A9Util.trimRight(A9Util.trimLeft(line));
}

A9Util.trimLeft  = function(line)
{
    if(line == null) return null;
    return line.replace(/^[ 　\t]+/,'');
}

A9Util.trimRight = function(line)
{
    if(line == null) return null;
    return line.replace(/[ 　\t]+$/,'');
}

A9Util.valueBlank = function(line)
{
    if(line == null) return null;
    return line.replace(/　/g,'  ').replace(/\t/g,'    ');
}

A9Util.shiftBlank = function(line, num)
{
    if(line == null) return line;
    if(num == null) return line;
    
    var j=0;
    for(var i=0; i<=num; i++)
    {
        var c = line.charAt(j);
        if( c == ' ') i+=1;
        else if (c == '\t') i+=4;
        else if (c == '　') i+=2;
        else break;
        j++;
    }
    return j>0?line.substr(j):line;
}

A9Util.calTier = function(text)
{
    if(text == null) return 0;
    
    var t = 0;
    var c = null;
    for(var i=0;i<text.length;i++)
    {
        c = text.charAt(i)
        if ( c == ' ') t += 1;
        else if  ( c == '\t') t += 4;
        else if  ( c == '　') t += 2;
        else break;
    }
    
    return t;
}

A9Util.isEscapeLine = function (para)
{
    if(para == null || para == '') return false;
    
    var lt = para.charAt(para.length -1);
    if(lt == ' ') return true;
    if(lt == '\\')
        for(var i=para.length -2 ; i>=0 ;i--)
            if(para.charAt(i) != lt)
                return  (para.length - i) % 2 == 0;
    //
    return false;
}

/**
 * text: text to trim
 * pos: the '\' index
 */
A9Util.trimEscape = function(text,pos)
{
    if(text == null || text == '') return text;
    if(pos < 0 || pos > text.length-1 ) return text;
    if(text.charAt(pos) != '\\') return text;
    
    //
    var b = 0;
    for(var i = pos; i >= 0; i--)
    {
        var c = text.charAt(i);
        if(c != '\\')
        {
            b = i+1;
            break;
        }
    }
    var c = parseInt((pos - b + 1)/2);
    return text.substring(0,b+c)+text.substr(pos+1);
}

A9Util.isEmpty = function (text)
{
    if(text == null || text == '') return true;
    return false;
}

A9Util.isBlank = function (text)
{
    if(text == null || text == '') return true;
    return /^[ 　\t]*$/.test(text);
}

A9Util.isEscape = function (text,pos,escc)
{
    if(text == null || text == '') return false;
    if(pos < 0 || pos > text.length-1 ) return false;
    
    if(escc == null) escc = '\\';
    
    if(text.charAt(pos) != escc)
       return false;
    if(pos == 0) 
       return true;
    
    for(var i = pos; i >= 0; i--)
        if(text.charAt(i) != escc && (pos - i) % 2 == 1)
              return true;
    
    return false;
}

A9Util.hasVariable = function (str)
{
    if(str == null || str == "") return false;
    var rgxp = /\$\{?\w+\}?/;
    var pos = str.search(rgxp);
    while(pos >=0)
    {
        if(A9Util.isEscape(str,pos-1))
        {
            str = str.substr(pos+1);
            pos = str.search(rgxp);
        }
        else
        {
            return true;
        }
    }
    return false;
}

A9Util.getCRLF = function(text)
{
    var crlf = "\r\n";
    if(text != null && text.indexOf("\r\n") < 0)
    {
        var r = text.indexOf("\r");
        var n = text.indexOf("\n");
        crlf = r>n ?"\r":"\n";
    }
    return crlf;
    
}
