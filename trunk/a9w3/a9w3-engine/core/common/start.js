/** pool */
A9W3POOL = {};
/** init */
W3GUI.asyncInit(function(){
    W3GUI.drawLogo();
    W3GUI.drawMenu();
    W3GUI.drawPage();
}
);
function showA9W3Ad(){
    var adobj = document.getElementById("__A9W3_AD__");
    if(adobj.style.visibility !='visible'){
        adobj.style.visibility='visible';
        window.setTimeout(hideA9W3Ad,3000);
    }
}

function hideA9W3Ad(){
    document.getElementById("__A9W3_AD__").style.visibility='hidden';
}

// test speed
if(W3CNF.SPEED_CHAR_BS>0 && W3CNF.SPEED_CHAR_BS<5000){ //<5k/s
    // low speed warn
    var html = "<div id='__SPEED_WARN__' class='a9w3_warn_box' onClick=\"this.style.visibility='hidden'\">";
        html+= "(-_-!) low speed ("+W3CNF.SPEED_CHAR_BS+"b/s) ... ";
        html+= "</div>";
    document.write(html);
    window.setTimeout(function(){
        document.getElementById("__SPEED_WARN__").style.visibility='hidden';
    },9000);
}