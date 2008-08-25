/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaSQLRender = function()
{
    A9Dom.type.area_sql = {
        bracket_sm:     "area_sql.bracket_sm",
        bracket_md:     "area_sql.bracket_md",
        bracket_bg:     "area_sql.bracket_bg",
        type_string:    "area_sql.type_string",
        type_escape:    "area_sql.type_escape",
        type_number:    "area_sql.type_number",
        word_keyword:   "area_sql.word_keyword",
        word_type:      "area_sql.word_type",
        word_function:  "area_sql.word_function",
        word_comment:   "area_sql.word_comment"
    };
    
    var __ascr__ = new AreaSyntaxCodeRender();
    {
        __ascr__.putPairing(A9Dom.type.area_sql.bracket_sm,'sm');
        __ascr__.putPairing(A9Dom.type.area_sql.bracket_md,'md');
        __ascr__.putPairing(A9Dom.type.area_sql.bracket_bg,'bg');
        
        __ascr__.putHighlight(A9Dom.type.area_sql.type_string,'#990000');
        __ascr__.putHighlight(A9Dom.type.area_sql.type_escape,'#000000');
        __ascr__.putHighlight(A9Dom.type.area_sql.type_number,'#FF6699');
        __ascr__.putHighlight(A9Dom.type.area_sql.word_comment,'#CCCCCC');
        __ascr__.putHighlight(A9Dom.type.area_sql.word_keyword,'#000099',true);
        __ascr__.putHighlight(A9Dom.type.area_sql.word_type,'#009900',true);
        __ascr__.putHighlight(A9Dom.type.area_sql.word_function,'#009900',true);
    }
    
    // public
    this.render = function(a9dom,func){
        __ascr__.render(a9dom,func);
    }
}