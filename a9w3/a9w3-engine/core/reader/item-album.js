function init(){
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0){
        var id = url.substr(pos+1);
        parent.W3GUI.getGalleryItem(id,function(ai){
            document.getElementById("PICTURE").src=parent.W3CNF.USERHOME+"gallery/data/"+ai.id+"."+ai.ftype;
            document.getElementById("CTIME").innerHTML=ai.ctime;
            document.getElementById("PIXEL").innerHTML=ai.pixel;
            document.getElementById("SIZEB").innerHTML=ai.sizeb;
            document.getElementById("VIEWS").innerHTML=ai.views;
            if(ai.lable ==null || ai.lable.length ==0){
                ai.lable=[parent.W3GUI.GALLERY_LABEL.getValue("000")];
            }
            var lb = "";
            for(var k=0;k<ai.lable.length;k++){
                lb +=ai.lable[k]+"&nbsp;";
            }
            document.getElementById("LABEL").innerHTML=lb;
            document.getElementById("BRIEF").innerHTML=parent.W3TXT.html2text(ai.brief);
        });
    }
}
//
init();

