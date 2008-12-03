/**
UTF8(BOM)  LGPL  trydofor.com  Mar.2008
===========================================================
*/
if(typeof(__A9TEXT_AAES__) =='undefined')
var __A9TEXT_AAES__ = {
    desImpl:new AESClass(),
    b64Impl:new B64Class(),
    decrypt:function(obj)
    {
        if(obj == null) return;
        var encryptStr = obj.innerHTML;
            encryptStr=encryptStr.replace(/<.+?>/gim,'');// html tag
            encryptStr=encryptStr.replace(/--.+\s/gi,'');// ruler
            encryptStr=encryptStr.replace(/\s/g,'');// blank
        if(encryptStr.length>0){
            var passwd = window.prompt('please input your passwd','');
            if(passwd != null && passwd != ''){
                var decryptStr = __A9TEXT_AAES__.desImpl.decrypt(__A9TEXT_AAES__.b64Impl.decode(encryptStr),passwd,256);
                var win = window.open('','A9Text_AES','height=200,width=400,toolbar=no,menubar=no,location=no,status=no,resizable=yes');
                win.document.write("<meta content='text/html; charset=utf-8' http-equiv='content-type'>");
                win.document.write("<body style='font-size:12px'><pre>"+decryptStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+"</pre></body>");
                win.document.close();
            }
        }
    }
}