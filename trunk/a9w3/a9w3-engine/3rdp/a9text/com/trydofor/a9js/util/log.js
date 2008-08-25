/**
UTF8(BOM)  LGPL  trydofor.com  Feb.2008
===========================================================
logger
*/

var Logger = {};

Logger.stdout = null;
Logger.level = Logger.WARN;

//
Logger.OFF   = -1;
Logger.ALL   = 0;
Logger.DEBUG = 10;
Logger.INFO  = 20;
Logger.WARN  = 30;
Logger.FATAL = 40;

Logger.debug = function(mess,mark)
{
    Logger.log(mess,Logger.DEBUG,mark);
}

Logger.info = function(mess,mark)
{
    Logger.log(mess,Logger.INFO,mark);
}

Logger.warn = function(mess,mark)
{
    Logger.log(mess,Logger.WARN,mark);
}

Logger.fatal = function(mess,mark)
{
    Logger.log(mess,Logger.FATAL,mark);
}

Logger.log = function(mess,level,mark)
{
    if(typeof(level) != "number") level = Logger.ALL;
    if(Logger.level == Logger.OFF || level < Logger.level) return;
    //
    var text = "ALL  ";
    if(level >= Logger.FATAL)
        text = "FATAL";
    else if(level >= Logger.WARN)
        text = "WARN ";
    else if(level >= Logger.INFO)
        text = "INFO ";
    else if(level >= Logger.DEBUG)
        text = "DEBUG";

    if(mark != null && mark !="") text+=" @ "+ mark;
    text = "<b>"+text+"</b> "+mess;
    try{
        if(typeof(Logger.stdout) != "function")
        {
            var win = window.open("","A9Console","width=680,height=600,resizable,scrollbars=yes");
            win.document.write("<meta content='text/html; charset=utf-8' http-equiv='content-type'><body style='font-size:12px'></body>");
            win.document.close();
            Logger.stdout = function(mes)
            {
                win.document.body.innerHTML += "<pre>"+mes+"</pre>";
            }
        }
        Logger.stdout(text);
    }catch(e){
        alert(text);
    }
}