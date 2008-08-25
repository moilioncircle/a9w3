/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaJsParser = function()
{
    A9Dom.type.area_js = {
        comment_doc:    "area_js.comment_doc",
        comment_single: "area_js.comment_single",
        comment_multi:  "area_js.comment_multi",
        bracket_sm:     "area_js.bracket_sm",
        bracket_md:     "area_js.bracket_md",
        bracket_bg:     "area_js.bracket_bg",
        type_string:    "area_js.type_string",
        type_char:      "area_js.type_char",
        word_keyword:   "area_js.word_keyword",
        word_bldtype:   "area_js.word_bldtype"
    };

    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putOprchar(';<>=?!&%^-+*/,:');
        __ascp__.putMulQuote(A9Dom.type.area_js.comment_doc,'/**','*/');
        __ascp__.putMulQuote(A9Dom.type.area_js.comment_multi,'/*','*/');
        __ascp__.putMulQuote(A9Dom.type.area_js.type_string,'"','"',true,'\\');
        __ascp__.putMulQuote(A9Dom.type.area_js.type_char,"'","'",true,'\\');
        __ascp__.putOneQuote(A9Dom.type.area_js.comment_single,'//');
        __ascp__.putPairing(A9Dom.type.area_js.bracket_sm,'(',')');
        __ascp__.putPairing(A9Dom.type.area_js.bracket_md,'[',']');
        __ascp__.putPairing(A9Dom.type.area_js.bracket_bg,'{','}');
        
        __ascp__.putKeyword(A9Dom.type.area_js.word_bldtype,['escape','isFinite','isNaN','Number','parseFloat','parseInt','reload','taint','unescape','untaint','write']);
        __ascp__.putKeyword(A9Dom.type.area_js.word_keyword,['if','else','for','in','while','do','continue','break','with','try','catch','finally','switch',
                                                            'case','new','var','function','return','delete','true','false','void','throw','typeof','const','default']);
        
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'js' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}