/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaTTYParser = function()
{
    A9Dom.type.area_tty = {
        word_stdout:  "area_tty.word_stdout",
        word_stderr:  "area_tty.word_stderr",
        word_comment: "area_tty.word_comment"
    };
    
    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putMulQuote(A9Dom.type.area_tty.word_comment,'/*','*/');
        __ascp__.putOneQuote(A9Dom.type.area_tty.word_comment,'#');
        __ascp__.putOneQuote(A9Dom.type.area_tty.word_comment,"//");
        __ascp__.putOneQuote(A9Dom.type.area_tty.word_stdout,/(^ *>)/,false);
        __ascp__.putOneQuote(A9Dom.type.area_tty.word_stderr,/(^ *@)/,false);
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'tty' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}