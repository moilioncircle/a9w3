/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaJavaRender = function()
{
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putHighlight(A9Dom.type.area_java.comment_doc,'#3366cc');
        __ascr__.putHighlight(A9Dom.type.area_java.comment_single,'#006600');
        __ascr__.putHighlight(A9Dom.type.area_java.comment_multi,'#006633');
        __ascr__.putHighlight(A9Dom.type.area_java.type_string,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_java.type_char,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_java.word_keyword,'#660033',true);
        __ascr__.putHighlight(A9Dom.type.area_java.word_bldtype,'#660033',true);
        
        __ascr__.putPairing(A9Dom.type.area_java.bracket_sm,'sm');
        __ascr__.putPairing(A9Dom.type.area_java.bracket_md,'md');
        __ascr__.putPairing(A9Dom.type.area_java.bracket_bg,'bg');

    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}