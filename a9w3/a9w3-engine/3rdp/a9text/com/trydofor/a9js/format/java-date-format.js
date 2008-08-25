/**
 * <pre>
 * UTF8(BOM)  GPL  trydofor.com  May.2007
 * ===========================================================
 * DateFormatClass
 * like the java's SimpleDateFormat.
 *
 * Letter  Date or Time Component  Presentation    Examples          UserDic
 * y       Year                    Year            1996; 96
 * M       Month in year           Month           July; Jul; 07     *
 * d       Day in month            Number          10
 * E       Day in week             Text            Tuesday; Tue; 2   *
 * a       Am/pm marker            Text            pm,p              *
 * H       Hour in day (0-23)      Number          0
 * h       Hour in am/pm (1-12)    Number          12
 * m       Minute in hour          Number          30
 * s       Second in minute        Number          55
 * S       Millisecond             Number          978
 * 
 *
 * Date and Time Pattern               Result
 * "yyyy.MM.dd 'at' HH:mm:ss"          2001.07.04 at 12:08:56
 * "EEE, MMM d, ''yy"                  Wed, Jul 4, '01
 * "h:mm a"                            12:08 p
 * "hh 'o''clock' aa"                  12 o'clock pm
 * "yyyyy.MMMMM.dd hh:mm aaa"          2001.July.04 12:08 pm
 * "EEE, d MMM yyyy HH:mm:ss"          Wed, 4 Jul 2001 12:08:56
 * "yyMMddHHmmss"                      010704120856
 * "'''ad'''yyyy'year'MM'month'dd''"   'ad'2007year06month16'
 * "MM'yyyy''yyyy'yyyy"                06yyyy'yyyy2007
 *
 * var formater = new DateFormat(&lt;pattern&gt;,&lt;locale&gt;);
 * 
 * formater.format(date)
 *     将日期格式化成设定的格式.
 *     formatStr: 
 *     date:      需要格式化的日期,为空时,使用当前时间
 *                格式:
 * </pre>
 * @public 
 * @param <pattern> 格式化字符串(参考上面说明)
 * @param <locale2symbols>  locale zh_CN,symbols 替换默认的显示 {monthSymbols:[[简称,全程],],weekSymbols:[[简称,全称],],ampmSymbols:[[简称,全称],]}
 * <code>{
 *                     monthSymbols:[
 *                         ['Sun','Sunday'],
 *                         ['Mon','Monday'],
 *                         ['Tue','Tuesday'],
 *                         ['Wed','Wednesday'],
 *                         ['Thu','Thursday'],
 *                         ['Fri','Friday'],
 *                         ['Sat','Saturday']
 *                         ],
 *                      weekSymbols:[
 *                         ['Jan','January'],
 *                         ['Feb','Feburary'],
 *                         ['Mar','March'],
 *                         ['Apr','April'],
 *                         ['May','May'],
 *                         ['Jun','June'],
 *                         ['Jul','July'],
 *                         ['Aug','August'],
 *                         ['Sep','September'],
 *                         ['Oct','October'],
 *                         ['Nov','November'],
 *                         ['Dec','December']
 *                         ],
 *                      ampmSymbols:[['a','am'],['p','pm']]
 *                 }
 * </code>
 * @author trydofor.com
 * @author jindw
 */
function JavaDateFormat(pattern,symbols){
    if(symbols){
        if('string' == typeof symbols){
            if(":debug"){
                symbols = symbols.replace(/_.*/,function(c){
                    return c.toUpperCase()
                })
            }
            symbols = this.lang[symbols] || this.lang[symbols.replace(/_.*/,'')];
        }
        for(var n in symbols){
            this[n] =  symbols[n];
        }
    }
    var match;
    var result = [];
    var keys = ["z"];
    for(var n in this.replacerMap){
        keys.push(n);
        keys.push('+|');
    }
    keys.push("'(?:''|[^'])*'|(..*?)");  
    keys = new RegExp(keys.join(''),'g');
    while(match = keys.exec(pattern)){
        var item = match[0];
        var fn = this.replacerMap[item.charAt()];
        if(fn){
            result.unshift([fn,item.length])
        }else{
            item = item.replace(/^'|(')'|'$/g,'$1');
            //alert(item+'&'+match[0])
            //if('string' == typeof result[0]){
            //    result[0] = (result[0] + item);
            //}else{
                result.unshift(item);
            //}
        }
    }
    this.template = result;
    //alert(result)
}

JavaDateFormat.prototype = {
    /**
     * 格式化函数
     * @public
     * @param <Date>date 需要格式化的日期,为空时,使用当前时间
     * @return <String> 格式化日期字符串
     */
    format:function(date){
        var template = this.template;
        var result = [];
        var i = template.length;
        while(i--){
            var item = template[i];
            if(item instanceof Array){
                result.push(item[0].call(this,date,item[1]))
            }else{
                result.push(item);
            }
        }
        return result.join('')
    },
    replacerMap : {
        'y' : function(date,size){
            date = date.getFullYear().toString();
            return size==2?date.substr(2):date;
        },
        'M' : function(date,size){
            date = date.getMonth();
            if(size>2){
                var minSize = this.monthSymbols[this.monthSymbols.length-1][0].length;
                return this.monthSymbols[date][size>3?1:0]
            }else{
                return d2(date+1,size);
            }
        },
        'd' : function(date,size){
            date = date.getDate();
            return d2(date,size);
        },
        'E' :function(date,size){
            date = date.getDay();
            var minSize = this.weekSymbols[this.weekSymbols.length-1][0].length;
            return this.weekSymbols[date][size>minSize?1:0];
        },
        'a' : function(date,size){
            return this.ampmSymbols[date.getHours()<12?0:1];
        },
        'H' : function(date,size){
            date = date.getHours();
            return d2(date,size);
        },
        'h' : function(date,size){
            date = date.getHours();
            if(date>12){
                date -= 12;
            }
            return d2(date,size);
        },
        'm' : function(date,size){
            date = date.getMinutes();
            return d2(date,size);
        },
        's' : function(date,size){
            date = date.getSeconds();
            return d2(date,size);
        },
        'S' : function(date,size){
            date = date.getMilliseconds().toString();
            return size>2 ? date : date.substr(0,size);
        }
    },
    lang : {
        en: {
            //eraSymbols : ['BC',"AD"],
            weekSymbols  : [
                ['Sun','Sunday'],
                ['Mon','Monday'],
                ['Tue','Tuesday'],
                ['Wed','Wednesday'],
                ['Thu','Thursday'],
                ['Fri','Friday'],
                ['Sat','Saturday']
            ],
            monthSymbols : [
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
            ampmSymbols  : ['am','pm']
        },
        zh: {
            //eraSymbols : ['公元前',"公元"],
            weekSymbols  : [
                ['一','星期－'],
                ['二','星期二'],
                ['三','星期三'],
                ['四','星期四'],
                ['五','星期五'],
                ['六','星期六'],
                ['日','星期日']
            ],
            monthSymbols : [
                ['一','－月'],
                ['二','二月'],
                ['三','三月'],
                ['四','四月'],
                ['五','五月'],
                ['六','六月'],
                ['七','七月'],
                ['八','八月'],
                ['九','九月'],
                ['十','十月'],
                ['十一','十一月'],
                ['十二','十二月'],
            ],
            ampmSymbols  : ['上午','下午']
        }
    }
}
function d2(d,size){
    return size>1? d>9 ?d:'0'+d
           :d;
}
var langProperties = JavaDateFormat.prototype.lang.zh
for(var n in langProperties){
    JavaDateFormat.prototype[n] =  langProperties[n];
}