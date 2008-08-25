/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaCParser = function()
{
    A9Dom.type.area_c = {
        bracket_sm:     "area_c.bracket_sm",
        bracket_md:     "area_c.bracket_md",
        bracket_bg:     "area_c.bracket_bg",
        type_string:    "area_c.type_string",
        type_char:      "area_c.type_char",
        word_keyword:   "area_c.word_keyword",
        word_type:      "area_c.word_type",
        word_comment:   "area_c.word_comment",
        word_preinst:   "area_c.word_preinst"
    };

    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putOprchar(';<>=?!&%^-+*/,:');
        __ascp__.putMulQuote(A9Dom.type.area_c.word_comment,'/*','*/');
        __ascp__.putMulQuote(A9Dom.type.area_c.type_string,'"','"',true,'\\');
        __ascp__.putMulQuote(A9Dom.type.area_c.type_char,"'","'",true,'\\');
        __ascp__.putOneQuote(A9Dom.type.area_c.word_comment,'//');
        __ascp__.putOneQuote(A9Dom.type.area_c.word_preinst,'#');
        __ascp__.putPairing(A9Dom.type.area_c.bracket_sm,'(',')');
        __ascp__.putPairing(A9Dom.type.area_c.bracket_md,'[',']');
        __ascp__.putPairing(A9Dom.type.area_c.bracket_bg,'{','}');

        var word_type = ['auto',
            'char',
            'const',
            'double',
            'float',
            'int',
            'long',
            'register',
            'restrict',
            'short',
            'signed',
            'static',
            'unsigned',
            'void',
            'volatile',
            '_Imaginary',
            '_Complex',
            '_Bool'];
        var word_keyword  = ['break',
            'case',
            'continue',
            'default',
            'do',
            'else',
            'enum',
            'extern',
            'for',
            'goto',
            'if',
            'inline',
            'return',
            'sizeof',
            'struct',
            'switch',
            'typedef',
            'union',
            'while'];
        
        __ascp__.putKeyword(A9Dom.type.area_c.word_type,word_type);
        __ascp__.putKeyword(A9Dom.type.area_c.word_keyword,word_keyword);
        
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'c' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}