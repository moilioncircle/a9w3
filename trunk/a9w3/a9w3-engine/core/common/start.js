/** pool */
A9W3POOL = {};
/** init */
W3GUI.asyncInit(function(){
    W3GUI.drawLogo();
    W3GUI.drawMenu();
    W3GUI.drawPage();
}
);

// test speed
if(W3CNF.SPEED_CHAR_BS>0 && W3CNF.SPEED_CHAR_BS<1000){ //<1k/s
    // low speed warn
    var html = "<div id='__SPEED_WARN__' style=\"border-bottom:1px solid red;position:absolute;left:0px;top:0px;width:100%;height:20px;z-index:100;background-color:#efefef;text-align:center;color:#FF0000;font-size:12px;padding-top:4px\" onClick=\"this.style.visibility='hidden'\">";
        html+= "(-_-!) low speed ("+W3CNF.SPEED_CHAR_BS+"b/s) ... ";
        html+= "</div>";
    document.write(html);
    window.setTimeout(function(){
        document.getElementById("__SPEED_WARN__").style.visibility='hidden';
    },9000);
}