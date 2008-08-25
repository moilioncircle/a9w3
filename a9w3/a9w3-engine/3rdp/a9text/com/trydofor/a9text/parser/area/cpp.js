/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaCppParser = function()
{
    A9Dom.type.area_cpp = {
        bracket_sm:     "area_cpp.bracket_sm",
        bracket_md:     "area_cpp.bracket_md",
        bracket_bg:     "area_cpp.bracket_bg",
        type_string:    "area_cpp.type_string",
        type_char:      "area_cpp.type_char",
        word_keyword:   "area_cpp.word_keyword",
        word_type:      "area_cpp.word_type",
        word_exts:      "area_cpp.word_exts",
        word_preinst:   "area_cpp.word_preinst",
        word_comment:   "area_cpp.word_comment"
    };

    var __ascp__ = new AreaSyntaxCodeParser();
    {
        __ascp__.putOprchar(';<>=?!&%^-+*/,:');
        __ascp__.putMulQuote(A9Dom.type.area_cpp.word_comment,'/*','*/');
        __ascp__.putMulQuote(A9Dom.type.area_cpp.type_string,'"','"',true,'\\');
        __ascp__.putMulQuote(A9Dom.type.area_cpp.type_char,"'","'",true,'\\');
        __ascp__.putOneQuote(A9Dom.type.area_cpp.word_comment,'//');
        __ascp__.putOneQuote(A9Dom.type.area_cpp.word_preinst,'#');
        __ascp__.putPairing(A9Dom.type.area_cpp.bracket_sm,'(',')');
        __ascp__.putPairing(A9Dom.type.area_cpp.bracket_md,'[',']');
        __ascp__.putPairing(A9Dom.type.area_cpp.bracket_bg,'{','}');

        var word_type = ['auto',
            'bool',
            'char',
            'const',
            'double',
            'float',
            'int',
            'long',
            'mutable',
            'register',
            'short',
            'signed',
            'static',
            'unsigned',
            'void',
            'volatile',
            'uchar',
            'uint',
            'int8_t',
            'int16_t',
            'int32_t',
            'int64_t',
            'uint8_t',
            'uint16_t',
            'uint32_t',
            'uint64_t',
            'wchar_t'];
        var word_keyword  = ['asm',
            'break',
            'case',
            'catch',
            'class',
            'const_cast',
            'continue',
            'default',
            'delete',
            'do',
            'dynamic_cast',
            'else',
            'enum',
            'explicit',
            'export',
            'extern',
            'false',
            'friend',
            'for',
            'goto',
            'if',
            'inline',
            'namespace',
            'new',
            'operator',
            'private',
            'protected',
            'public',
            'qobject_cast',
            'reinterpret_cast',
            'return',
            'sizeof',
            'static_cast',
            'struct',
            'switch',
            'template',
            'this',
            'throw',
            'true',
            'try',
            'typedef',
            'typeid',
            'type_info',
            'typename',
            'union',
            'using',
            'virtual',
            'while',
            'and',
            'and_eq',
            'bad_cast',
            'bad_typeid',
            'bitand',
            'bitor',
            'compl',
            'not',
            'not_eq',
            'or',
            'or_eq',
            'xor',
            'xor_eq',
            'except',
            'finally',
            'xalloc'];
        var word_exts = ['K_DCOP',
            'SLOT',
            'SIGNAL',
            'Q_CLASSINFO',
            'Q_ENUMS',
            'Q_EXPORT',
            'Q_OBJECT',
            'Q_OVERRIDE',
            'Q_PROPERTY',
            'Q_SETS',
            'Q_SIGNALS',
            'Q_SLOTS',
            'Q_FOREACH',
            'Q_DECLARE_FLAGS',
            'Q_INIT_RESOURCE',
            'Q_CLEANUP_RESOURCE',
            'Q_GLOBAL_STATIC',
            'Q_GLOBAL_STATIC_WITH_ARGS',
            'Q_DECLARE_INTERFACE',
            'Q_DECLARE_TYPEINFO',
            'Q_DECLARE_SHARED',
            'Q_DECLARE_FLAGS',
            'Q_DECLARE_OPERATORS_FOR_FLAGS',
            'Q_FOREVER',
            'Q_DECLARE_PRIVATE',
            'Q_DECLARE_PUBLIC',
            'Q_D',
            'Q_Q',
            'Q_DISABLE_COPY',
            'Q_INTERFACES',
            'Q_FLAGS',
            'Q_SCRIPTABLE',
            'Q_INVOKABLE',
            'Q_GADGET',
            'Q_ARG',
            'Q_RETURN_ARG',
            'Q_ASSERT',
            'Q_ASSERT_X',
            'Q_PRIVATE_SLOT',
            'Q_DECLARE_METATYPE',
            'Q_NOREPLY',
            'TRUE',
            'FALSE',
            'connect',
            'disconnect',
            'emit',
            'signals',
            'slots',
            'foreach',
            'forever'];
        
        __ascp__.putKeyword(A9Dom.type.area_cpp.word_type,word_type);
        __ascp__.putKeyword(A9Dom.type.area_cpp.word_keyword,word_keyword);
        __ascp__.putKeyword(A9Dom.type.area_cpp.word_exts,word_exts);
        
    }
    ////
    this.parse = function(a9dom,func)
    {
       if(a9dom == null || 'cpp' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        __ascp__.parse(a9dom);
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}