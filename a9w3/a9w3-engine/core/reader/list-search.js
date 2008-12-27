function onSearch(prefix){
    var fm = document.getElementById(prefix+"_FORM");
    document.getElementById(prefix+"_WORD").value=document.getElementById("KEYWORD").value;
    fm.target="_BLANK";
    fm.submit();
}

function init(){
    var siteval = parent.W3CNF.CONF.getValue("search.site");
    for(var i=1;;i++){
        var obj = document.getElementById("SITE_NAME_"+i);
        if(obj == null) break;
        obj.value=siteval;
    }
}
init();