/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
DateFormatClass
like the java's SimpleDateFormat.

Letter  Date or Time Component  Presentation    Examples          UserDic
y       Year                    Year            1996; 96
M       Month in year           Month           July; Jul; 07     *
d       Day in month            Number          10
E       Day in week             Text            Tuesday; Tue; 2   *
a       Am/pm marker            Text            pm,p              *
H       Hour in day (0-23)      Number          0
h       Hour in am/pm (1-12)    Number          12
m       Minute in hour          Number          30
s       Second in minute        Number          55
S       Millisecond             Number          978

Date and Time Pattern               Result
"yyyy.MM.dd 'at' HH:mm:ss"          2001.07.04 at 12:08:56
"EEE, MMM d, ''yy"                  Wed, Jul 4, '01
"h:mm a"                            12:08 p
"hh 'o''clock' aa"                  12 o'clock pm
"yyyyy.MMMMM.dd hh:mm aaa"          2001.July.04 12:08 pm
"EEE, d MMM yyyy HH:mm:ss"          Wed, 4 Jul 2001 12:08:56
"yyMMddHHmmss"                      010704120856
"'''ad'''yyyy'year'MM'month'dd''"   'ad'2007year06month16'
"MM'yyyy''yyyy'yyyy"                06yyyy'yyyy2007


String format(formatStr,date,userDic)
    将日期格式化成设定的格式.
    formatStr: 格式化字符串(参考上面说明)
    date:      需要格式化的日期,为空时,使用当前时间
    userDic:   替换默认的显示(ampm,month,week)
               格式:
               userDic = {M:[[简称,全程],],E:[[简称,全称],],a:[[简称,全称],]}
                userDic = {
                    M:[
                        ['Sun','Sunday'],
                        ['Mon','Monday'],
                        ['Tue','Tuesday'],
                        ['Wed','Wednesday'],
                        ['Thu','Thursday'],
                        ['Fri','Friday'],
                        ['Sat','Saturday']
                        ],
                     E:[
                        ['Jan','January'],
                        ['Feb','Feburary'],
                        ['Mar','March'],
                        ['Apr','April'],
                        ['May','May'],
                        ['Jun','June'],
                        ['Jul','July'],
                        ['Aug','August'],
                        ['Sep','September'],
                        ['Oct','October'],
                        ['Nov','November'],
                        ['Dec','December']
                        ],
                     a:[['a','am'],['p','pm']]
                }

*/

var DateFormatClass = function()
{
    var __week__  = [
        ['Sun','Sunday'],
        ['Mon','Monday'],
        ['Tue','Tuesday'],
        ['Wed','Wednesday'],
        ['Thu','Thursday'],
        ['Fri','Friday'],
        ['Sat','Saturday']
        ];
    var __month__ = [
        ['Jan','January'],
        ['Feb','Feburary'],
        ['Mar','March'],
        ['Apr','April'],
        ['May','May'],
        ['Jun','June'],
        ['Jul','July'],
        ['Aug','August'],
        ['Sep','September'],
        ['Oct','October'],
        ['Nov','November'],
        ['Dec','December']
        ];
    var __ampm__  = [['a','am'],['p','pm']];
    
    //
    function __parseField__(date,userDic)
    {
        var monthName = __month__;
        var weekName  = __week__;
        var ampmName  = __ampm__;
        
        if(typeof userDic == 'object')
        {
            if(typeof userDic.M  != 'undefined') monthName = userDic.M;
            if(typeof userDic.E  != 'undefined') weekName  = userDic.E;
            if(typeof userDic.a  != 'undefined') ampmName  = userDic.a;
        }
        
        var filedVal = 
        [
            [/yyyy+/,   date.getFullYear()],
            [/yy/,      (date.getFullYear()+"").substr(2)],
            [/MMMM+/,   monthName[date.getMonth()][1]],
            [/MMM/,     monthName[date.getMonth()][0]],
            [/MM/,      date.getMonth()<9?'0'+(date.getMonth()+1):(date.getMonth()+1)],
            [/M/,       date.getMonth()+1],
            [/dd+/,     date.getDate()<10?'0'+date.getDate():date.getDate()],
            [/d/,       date.getDate()],
            [/EEEE+/,   weekName[date.getDay()][1]],
            [/EEE+/,    weekName[date.getDay()][0]],
            [/E/,       date.getDay()],
            [/aa+/,     date.getHours()<12?ampmName[0][1]:ampmName[1][1]],
            [/a/,       date.getHours()<12?ampmName[0][0]:ampmName[1][0]],
            [/HH+/,     date.getHours()<10?'0'+date.getHours():date.getHours()],
            [/H/,       date.getHours()],
            [/hh+/,     ((date.getHours()<12?date.getHours():date.getHours()-11)+100+"").substr(1)],
            [/h/,       date.getHours()<12?date.getHours():date.getHours()-11],
            [/mm+/,     date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()],
            [/m/,       date.getMinutes()],
            [/ss+/,     date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()],
            [/s/,       date.getSeconds()],
            [/SSS+/,    date.getMilliseconds()],
            [/SS/,      (date.getMilliseconds()+"").substring(0,2)],
            [/S/,       (date.getMilliseconds()+"").substring(0,1)]
        ];
        //document.writeln(filedVal);
        return filedVal;
    }
    
    function __parseFormat__(str)
    {
        if(str.indexOf("'")<0) return [[true,str]];
        
        var squotepos = [];
        
        if(str.charAt(0) == "'") squotepos.push(0);
        
        for(var i = 1; i<str.length;i++)
        {
            if(str.charAt(i) == "'")
            {
                if(str.charAt(i-1) == "'" && squotepos[squotepos.length-1] > 0)
                {
                    squotepos[squotepos.length-1] = -squotepos[squotepos.length-1];
                    squotepos.push(-i);
                }
                else
                {
                    squotepos.push(i);
                }
            }
        }
        // check
        if(squotepos.length %2 != 0) throw "the count of \"'\" must be even(2*n)";
        var even = 0;
        for(var i = 0; i<squotepos.length;i++)
        {
            if(squotepos[i] >= 0) even++;
        }
        if(even % 2 != 0) throw "\"'\" error:"+str;
        //
        var parts = [];
        var trans = (squotepos[0] > 0 || even == 0);
        var start = trans?0:1;
        for(var i = 0; i<squotepos.length;i++)
        {
            if(squotepos[i] <= 0) continue;
            
            parts.push([trans,str.substring(start,squotepos[i])]);
            start = squotepos[i]+1;
            trans = !trans;
        }
        if(start < str.length -1)
        {
            parts.push([trans,str.substr(start)]);
        }
        //document.writeln(parts);
        return parts;
    }
    
    function __render__(str,fieldsParts)
    {
        var result = "";
        var matched = false;
        do
        {
            var minPos = str.length;
            var index  = -1;
            matched    = false;
            for(var i = 0; i<fieldsParts.length; i++)
            {
                var pos = str.search(fieldsParts[i][0]);
                if(pos >=0 && pos < minPos)
                {
                    matched = true;
                    minPos  = pos;
                    index   = i;
                }
            }
            
            if(matched)
            {
                var mstrs = str.match(fieldsParts[index][0]);
                result += str.substring(0,minPos)+fieldsParts[index][1];
                str = str.substr(minPos+mstrs[0].length);
            }
            
        }while(matched)
            
        result += str;
        return result;
    }
    
    function __format__(formatStr,date,userDic)
    {
        if(typeof formatStr != 'string')  throw "need format string.";
        if(date != null && !date instanceof Date) throw "need date.";
        if(date == null) date = new Date();
        
        var formatParts = __parseFormat__(formatStr);
        var fieldsParts = __parseField__(date,userDic);
        
        var result = "";
        for(var i = 0; i<formatParts.length;i++)
        {
            var str = formatParts[i][1]
            if(formatParts[i][0]) // trans
                result += __render__(str,fieldsParts);
            else
                result += str;
        }
        
        return result.replace(/''/g,"'");
    }
    ////////
    this.format = __format__;
}
