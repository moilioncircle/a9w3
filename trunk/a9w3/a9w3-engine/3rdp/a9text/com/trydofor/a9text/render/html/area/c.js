/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaCRender = function()
{
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putHighlight(A9Dom.type.area_c.word_preinst,'#006633');
        __ascr__.putHighlight(A9Dom.type.area_c.word_comment,'#CCCCCC');
        __ascr__.putHighlight(A9Dom.type.area_c.type_string,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_c.type_char,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_c.word_keyword,'#660033',true);
        __ascr__.putHighlight(A9Dom.type.area_c.word_type,'#660033',true);
        
        __ascr__.putPairing(A9Dom.type.area_c.bracket_sm,'sm');
        __ascr__.putPairing(A9Dom.type.area_c.bracket_md,'md');
        __ascr__.putPairing(A9Dom.type.area_c.bracket_bg,'bg');

    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}