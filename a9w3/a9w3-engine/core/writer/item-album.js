var docPath = "";
var albumId = "";
var regexpId=/^\d{4}\/\d{10}$/;

function onDataChose(obj){
    if(!checkImageOnly(obj.value)) return;
    tryPreview(obj.value,true);
}

function tryPreview(path,islocal){
    if(path==null) return;
    path = path.replace(/\\/g,'/');
    if(path.indexOf('/')<0) return;
	
	var img = document.getElementById("__PICTURE__");
    img.src=islocal?"file://localhost/"+path:path;
}

function onAddLabel(){
    var lb = document.getElementById("__LBLNME__").value;
    if(lb == "" || lb == "default") return;
    var obj = document.getElementById("LABEL");
    var txt = obj.value;
    if(txt == ""){
        obj.value = lb;
    }else if (txt.indexOf(lb+" ") < 0 && txt.lastIndexOf(lb) != txt.length-lb.length){
        obj.value += " " + lb;
    }
}

function onDeleteAlbum(){
    parent.W3GUI.deletePicture(albumId);
}

function onSaveAlbum(){
    if(document.getElementById("BRIEF").value ==""){
        alert(parent.W3CNF.getI18nString("info.item.empty"));
        document.getElementById("BRIEF").focus();
        return;
    }

    var url = parent.W3CNF.getServerURL("album.edit.commit");
    url = parent.W3GUI.wrapUID(url)+"&PID="+albumId;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();
}

function onDataResponse(){
    var rtv = "";
    if(__DATA_POSTER__.document.readyState){// onreadystatechange
        if(__DATA_POSTER__.document.readyState == "complete"){
            rtv = __DATA_POSTER__.document.body.innerHTML;
            __DATA_POSTER__.document.body.innerHTML = "";
        }
    }else{ // onload
        rtv = __DATA_POSTER__.document.body.innerHTML;
        __DATA_POSTER__.document.body.innerHTML = "";
    }
    
    rtv = parent.W3TXT.trimEmpty(rtv);
    if(rtv != ""){
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
        if(checkReplyCode(rtv)){
            return;
        }else{
	        if(regexpId.test(rtv)){
	            albumId = rtv;
	            rtv="info.success";
	            updateUI();
	        }
	        
	        if(rtv == "info.success"){
	            parent.W3GUI.commitPicture();
	        }
	        
	        alert(parent.W3CNF.getI18nString(rtv));
        }
    }
}

function updateUI(){
    //label
    var lblMap = parent.W3GUI.GALLERY_LABEL.getKeyValClone();
    var lblObj = document.getElementById("__LBLNME__");
    var len = lblObj.length;
    for(var i=1;i<len;i++){
        lblObj.remove(1);
    }
    for(var k in lblMap){
        var opt=document.createElement("OPTION");
        opt.text=lblMap[k];
        opt.value=lblMap[k];
        try{
            lblObj.add(opt,null);
        }catch(e){
            lblObj.add(opt);
        }
    }
    
    if(albumId == null || !regexpId.test(albumId)){
	    document.getElementById("FILE").disabled=false;
	    document.getElementById("__BTN_DELETE__").disabled=true;
    }else{
    	document.getElementById("FILE").disabled=true;
    	document.getElementById("__BTN_DELETE__").disabled=false;
    	docPath = parent.W3CNF.USERHOME+"gallery/data/"+albumId.substring(0,albumId.indexOf("/")+1);
	    parent.W3GUI.getGalleryItem(albumId,function(ai){
	        tryPreview(parent.W3CNF.USERHOME+"gallery/data/"+ai.id+"."+ai.ftype,false);
	        document.getElementById("LABEL").value=ai.lable.join(" ");
	        document.getElementById("BRIEF").value=parent.W3TXT.line2text(ai.brief);
	    });
    }
}

function init(){
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0 && regexpId.test(url.substr(pos+1))){
        albumId = url.substr(pos+1);
    }
    updateUI();
}
//
init();

