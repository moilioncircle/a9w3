/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaXMLParser = function()
{
    A9Dom.type.area_xml = {
        element_comment: "area_xml.element_comment",
        element_cdata: "area_xml.element_cdata",
        element_declaration:  "area_xml.element_declaration",
        element_pi:  "area_xml.element_pi",
        element_doctype:  "area_xml.element_doctype",
        element_markup:  "area_xml.element_markup",
        attribute_string:  "area_xml.attribute_string",
        bracket_ltgt:  "area_xml.bracket_ltgt"
    };
    
    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_comment,'<!--','-->');
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_cdata,'<![CDATA[',']]>');
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_declaration,'<?xml','?>');
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_pi,'<?','?>');
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_doctype,'<!DOCTYPE','>');
        __ascp__.putMulQuote(A9Dom.type.area_xml.element_markup,'<!','>');
        __ascp__.putMulQuote(A9Dom.type.area_xml.attribute_string,'"','"',true);
        __ascp__.putMulQuote(A9Dom.type.area_xml.attribute_string,"'","'",true);
        __ascp__.putPairing(A9Dom.type.area_xml.bracket_ltgt,'<','>');
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'xml' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}