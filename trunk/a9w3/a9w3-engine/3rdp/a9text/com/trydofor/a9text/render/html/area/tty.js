/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaTTYRender = function()
{
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putHighlight(A9Dom.type.area_tty.word_stdout,'#333399');
        __ascr__.putHighlight(A9Dom.type.area_tty.word_stderr,'#993333');
        __ascr__.putHighlight(A9Dom.type.area_tty.word_comment,'#339933');
        __ascr__.putHighlight(A9Dom.type.area_syntax_code.word_literal,'#000000',true);
    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}