/**
UTF8(BOM)  LGPL  trydofor.com  Mar.2008
===========================================================
String hash(data)
*/

var SHA1Class = function()
{
    var charBit = 8;
    
    function sha1_binary(str)
    {
        var w = Array(80);
        var a = 0x67452301;
        var b = 0xefcdab89;
        var c = 0x98badcfe;
        var d = 0x10325476;
        var e = 0xc3d2e1f0;
        var x = strToBigEndianArray(str);
        var strBit = str.length * charBit;
        x[strBit >> 5] |= 0x80 << (24 - (strBit & 0x1f));
        x[((strBit + 64 >> 9) << 4) + 15] = strBit;
        var len = x.length;
        for (var i=0; i<len; i+=16)
        {
            var aa = a, bb = b, cc = c, dd = d, ee = e;
            var j = 0;
            for (; j<16; j++)
            {
                w[j] = x[i + j];
                var t = modularAdd(modularAdd(rotateLeft(a, 5), (b & c) | ((~b) & d)),
                modularAdd(modularAdd(e, w[j]), 0x5A827999));
                e = d;
                d = c;
                c = rotateLeft(b, 30);
                b = a;
                a = t;
            }
            for (; j<20; j++)
            {
                w[j] = rotateLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = modularAdd(modularAdd(rotateLeft(a, 5), (b & c) | ((~b) & d)),
                modularAdd(modularAdd(e, w[j]), 0x5A827999));
                e = d;
                d = c;
                c = rotateLeft(b, 30);
                b = a;
                a = t;
            }
            for (; j<40; j++)
            {
                w[j] = rotateLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = modularAdd(modularAdd(rotateLeft(a, 5), b ^ c ^ d),
                modularAdd(modularAdd(e, w[j]), 0x6ED9EBA1));
                e = d;
                d = c;
                c = rotateLeft(b, 30);
                b = a;
                a = t;
            }
            for (; j<60; j++)
            {
                w[j] = rotateLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = modularAdd(modularAdd(rotateLeft(a, 5), (b & c) | (d & (b | c))),
                modularAdd(modularAdd(e, w[j]), 0x8F1BBCDC));
                e = d;
                d = c;
                c = rotateLeft(b, 30);
                b = a;
                a = t;
            }
            for (; j<80; j++)
            {
                w[j] = rotateLeft(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = modularAdd(modularAdd(rotateLeft(a, 5), b ^ c ^ d),
                modularAdd(modularAdd(e, w[j]), 0xCA62C1D6));
                e = d;
                d = c;
                c = rotateLeft(b, 30);
                b = a;
                a = t;
            }
            a=modularAdd(a,aa);
            b=modularAdd(b,bb);
            c=modularAdd(c,cc);
            d=modularAdd(d,dd);
            e=modularAdd(e,ee);
        }
        return Array(a, b, c, d, e);
    }
    
    function bigEndianArrayToHex(ar)
    {
        var charHex = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
        var str = "";
        var len = ar.length;
        for(var i = 0, tmp = len << 2; i < tmp; i++)
        {
            str += charHex[((ar[i>>2] >> (((3 - (i & 3)) << 3) + 4)) & 0xF)] +
            charHex[((ar[i>>2] >> ((3 - (i & 3)) << 3)) & 0xF)];
        }
        return str;
    }
    
    function strToBigEndianArray(str)
    {
        var x = Array();
        var mask = (1 << charBit) - 1;
        var len = str.length;
        var i=0;
        for (var j=0; j < len; i+=charBit)
        {
            x[i>>5] |= (str.charCodeAt(j++) & mask) << (32 - charBit - (i & 0x1f));
        }
        return x;
    }
    
    function modularAdd(a, b)
    {    
        var lowerSum = (a & 0xffff) + (b & 0xffff);
        var upperSum = (a >> 16) + (b >> 16) + (lowerSum >> 16);
        return (upperSum << 16) + (lowerSum & 0xffff);
    }
    
    function rotateLeft(val, n)
    {
        return (val << n) | (val >>> (32 - n));
    }
    
    // public
    this.hash = function(str){
        return bigEndianArrayToHex(sha1_binary(str));
    }
}
