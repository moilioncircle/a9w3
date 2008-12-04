/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaXMLRender = function()
{
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putHighlight(A9Dom.type.area_xml.element_comment,'#006600');
        __ascr__.putHighlight(A9Dom.type.area_xml.element_cdata,'#006633');
        __ascr__.putHighlight(A9Dom.type.area_xml.element_declaration,'#660033');
        __ascr__.putHighlight(A9Dom.type.area_xml.element_pi,'#660033');
        __ascr__.putHighlight(A9Dom.type.area_xml.element_doctype,'#993300');
        __ascr__.putHighlight(A9Dom.type.area_xml.element_markup,'#003399');
        __ascr__.putHighlight(A9Dom.type.area_xml.attribute_string,'#999999');
        
        __ascr__.putPairing(A9Dom.type.area_xml.bracket_ltgt,'ltgt');
    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}