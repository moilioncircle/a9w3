/**
UTF8(BOM)  LGPL  trydofor.com  Mar. 2008
===========================================================
* @see http://www.movable-type.co.uk/scripts/aes.html
*/

var B64Class = function()
{
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    
    function encodeBase64(str) {
       var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
       
       str = utf16to8(str);
    
       do {
          o1 = str.charCodeAt(i++);
          o2 = str.charCodeAt(i++);
          o3 = str.charCodeAt(i++);
          
          bits = o1<<16 | o2<<8 | o3;
          
          h1 = bits>>18 & 0x3f;
          h2 = bits>>12 & 0x3f;
          h3 = bits>>6 & 0x3f;
          h4 = bits & 0x3f;
          
          if (isNaN(o3)) h4 = 64;
          if (isNaN(o2)) h3 = 64;
          
          enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
       } while (i < str.length);
       
       return enc;
    }
    
    function decodeBase64(str) {
       var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';
    
       do {
          h1 = b64.indexOf(str.charAt(i++));
          h2 = b64.indexOf(str.charAt(i++));
          h3 = b64.indexOf(str.charAt(i++));
          h4 = b64.indexOf(str.charAt(i++));
          
          bits = h1<<18 | h2<<12 | h3<<6 | h4;
          
          o1 = bits>>16 & 0xff;
          o2 = bits>>8 & 0xff;
          o3 = bits & 0xff;
          
          if (h3 == 64)      enc += String.fromCharCode(o1);
          else if (h4 == 64) enc += String.fromCharCode(o1, o2);
          else               enc += String.fromCharCode(o1, o2, o3);
       } while (i < str.length);
    
       return utf8to16(enc);
    }
    
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for(i = 0; i < len; i++){
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)){
                out += str.charAt(i);
            }else if (c > 0x07FF){
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }else{
                out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
        }
        return out;
    }

    function utf8to16(str){
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = str.length;
        i = 0;
        
        while(i < len){
            c = str.charCodeAt(i++);
            switch(c >> 4){ 
                 case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                   // 0xxxxxxx
                   out += str.charAt(i-1);
                   break;
                 case 12: case 13:
                   // 110x xxxx   10xx xxxx
                   char2 = str.charCodeAt(i++);
                   out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                   break;
                 case 14:
                   // 1110 xxxx  10xx xxxx  10xx xxxx
                   char2 = str.charCodeAt(i++);
                   char3 = str.charCodeAt(i++);
                   out += String.fromCharCode(((c & 0x0F) << 12) |
                                  ((char2 & 0x3F) << 6) |
                                  ((char3 & 0x3F) << 0));
                  break;
            }
        }
        return out;
    }
    
    // public
    this.encode = encodeBase64;
    this.decode = decodeBase64;
}
