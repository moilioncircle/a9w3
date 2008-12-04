/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaJavaParser = function()
{
    A9Dom.type.area_java = {
        comment_doc:    "area_java.comment_doc",
        comment_single: "area_java.comment_single",
        comment_multi:  "area_java.comment_multi",
        bracket_sm:     "area_java.bracket_sm",
        bracket_md:     "area_java.bracket_md",
        bracket_bg:     "area_java.bracket_bg",
        type_string:    "area_java.type_string",
        type_char:      "area_java.type_char",
        word_keyword:   "area_java.word_keyword",
        word_bldtype:   "area_java.word_bldtype"
    };

    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putOprchar(';<>=?!&%^-+*/,:');
        __ascp__.putMulQuote(A9Dom.type.area_java.comment_doc,'/**','*/');
        __ascp__.putMulQuote(A9Dom.type.area_java.comment_multi,'/*','*/');
        __ascp__.putMulQuote(A9Dom.type.area_java.type_string,'"','"',true,'\\');
        __ascp__.putMulQuote(A9Dom.type.area_java.type_char,"'","'",true,'\\');
        __ascp__.putOneQuote(A9Dom.type.area_java.comment_single,'//');
        __ascp__.putPairing(A9Dom.type.area_java.bracket_sm,'(',')');
        __ascp__.putPairing(A9Dom.type.area_java.bracket_md,'[',']');
        __ascp__.putPairing(A9Dom.type.area_java.bracket_bg,'{','}');
        
        __ascp__.putKeyword(A9Dom.type.area_java.word_bldtype,['boolean','byte','char','const','double','final','float','int','long','short','static','void']);
        __ascp__.putKeyword(A9Dom.type.area_java.word_keyword,['abstract','boolean','break','byte','case','catch','char',
                                                               'class','continue','default','do','double','else','extends',
                                                               'false','final','finally','float','for','if','implements',
                                                               'import','instanceof','int','interface','long','native','new',
                                                               'null','package','private','protected','public','return','short',
                                                               'static','super','switch','synchronized','this','throw','throws',
                                                               'transient','true','try','void','volatile','while','const','goto']);
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'java' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}