/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaB64Parser = function()
{
    A9Dom.type.area_b64 = {line:'area_b64.line',word:'area_b64.word'};
    
    var linesize = 64;
    var wordsize = 8;
    ////
    this.parse = function(a9dom,func)
    {
        //
        var text = a9dom.getText();
        if(text == null || text == "") return;
        
        text = text.replace(/\s+/g,'');

        for(var i=0;i<text.length;i+=linesize){
            var line = (i+linesize<text.length)?text.substr(i,linesize):text.substr(i);
            var b64Line = a9dom.newChild(A9Dom.type.area_b64.line);
            b64Line.setText(line);
            for(var j=0;j<line.length;j+=wordsize){
                var word = (j+wordsize<line.length)?line.substr(j,wordsize):line.substr(j);
                var b64Word = b64Line.newChild(A9Dom.type.area_b64.word);
                b64Word.setText(word);
            }
        }
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
}