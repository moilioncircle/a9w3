/**
UTF8(BOM)  LGPL  trydofor.com  Mar.2008
===========================================================
*/
if(typeof(__A9TEXT_ASCP__) =='undefined')
var __A9TEXT_ASCP__ = {
    activedId:null,
    activedFg:'#FFFFFF',
    activedBg:'#FF0000',
    originalFg:'',
    originalBg:'',
    matchPairing:function(obj){
        if(__A9TEXT_ASCP__.activedId != null){
            document.getElementById('H'+__A9TEXT_ASCP__.activedId).style.color=__A9TEXT_ASCP__.originalFg;
            document.getElementById('H'+__A9TEXT_ASCP__.activedId).style.backgroundColor=__A9TEXT_ASCP__.originalBg;
            document.getElementById('F'+__A9TEXT_ASCP__.activedId).style.color=__A9TEXT_ASCP__.originalFg;
            document.getElementById('F'+__A9TEXT_ASCP__.activedId).style.backgroundColor=__A9TEXT_ASCP__.originalBg;
        }
        if(obj.id.substr(1) == __A9TEXT_ASCP__.activedId) {__A9TEXT_ASCP__.activedId = null; return;}
        __A9TEXT_ASCP__.activedId = obj.id.substr(1);
        __A9TEXT_ASCP__.originalBg = obj.style.backgroundColor?obj.style.backgroundColor:'#FFFFFF';
        __A9TEXT_ASCP__.originalFg = obj.style.color?obj.style.color:'#000000';
        document.getElementById('H'+__A9TEXT_ASCP__.activedId).style.color=__A9TEXT_ASCP__.activedFg;
        document.getElementById('H'+__A9TEXT_ASCP__.activedId).style.backgroundColor=__A9TEXT_ASCP__.activedBg;
        document.getElementById('F'+__A9TEXT_ASCP__.activedId).style.color=__A9TEXT_ASCP__.activedFg;
        document.getElementById('F'+__A9TEXT_ASCP__.activedId).style.backgroundColor=__A9TEXT_ASCP__.activedBg;
    }
};
