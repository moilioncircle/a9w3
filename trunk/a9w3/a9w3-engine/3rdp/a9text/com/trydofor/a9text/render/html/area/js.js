/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaJsRender = function()
{
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putHighlight(A9Dom.type.area_js.comment_doc,'#3366cc');
        __ascr__.putHighlight(A9Dom.type.area_js.comment_single,'#006600');
        __ascr__.putHighlight(A9Dom.type.area_js.comment_multi,'#006633');
        __ascr__.putHighlight(A9Dom.type.area_js.type_string,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_js.type_char,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_js.word_keyword,'#660033',true);
        __ascr__.putHighlight(A9Dom.type.area_js.word_bldtype,'#660033',true);
        
        __ascr__.putPairing(A9Dom.type.area_js.bracket_sm,'sm');
        __ascr__.putPairing(A9Dom.type.area_js.bracket_md,'md');
        __ascr__.putPairing(A9Dom.type.area_js.bracket_bg,'bg');

    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}