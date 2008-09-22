var docPath = null;
var albumId = null;
var regexpId=/^\d{4}\/\d{13}$/;

function onDataChose(obj)
{
    var img = document.getElementById("__PICTURE__");
    img.src="file://localhost/"+obj.value;
}

function onAddLabel()
{
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

function onDeleteAlbum()
{
    var url = parent.W3CNF.getServerURL("album.edit.delete");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&AID="+albumId;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&AID="+albumId;
    
    var rtv = parent.A9Loader.syncLoadText(url);
    if(rtv == "info.success")
    {
        alert("ok");
    }
    alert(parent.W3CNF.getI18nString(rtv));
}

function onSaveAlbum()
{
    var url = parent.W3CNF.getServerURL("album.edit.commit");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&AID="+albumId;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&AID="+albumId;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action=url;
    fm.submit();

}

function onDataResponse()
{
    var rtv = "";
    if(__DATA_POSTER__.document.readyState)// onreadystatechange
    {
        if(__DATA_POSTER__.document.readyState == "complete")
        {
            rtv = __DATA_POSTER__.document.body.innerHTML;
            __DATA_POSTER__.document.body.innerHTML = "";
        }
    }
    else // onload
    {
        rtv = __DATA_POSTER__.document.body.innerHTML;
        __DATA_POSTER__.document.body.innerHTML = "";
    }
    
    if(rtv != "")
    {
        alert(rtv);
        __DATA_POSTER__.location="about:blank";// avoid recommit when refresh
    }
}

function init()
{
    var url = self.location.href;
    var pos = url.indexOf("?");
    if(pos>0 && regexpId.test(url.substr(pos+1)))
	{
        albumId = url.substr(pos+1);
        docPath = parent.W3CNF.USERHOME+"gallery/data/"+albumId.substring(0,albumId.indexOf("/")+1);
        
        //label
        var lblMap = parent.W3CNF.GALLERY_LABEL.getKeyValClone();
        var lblObj = document.getElementById("__LBLNME__");
        for(var k in lblMap)
        {
            var opt=document.createElement("OPTION");
            opt.text=lblMap[k];
            opt.value=lblMap[k];
            try{
                lblObj.add(opt,null);
            }catch(e){
                lblObj.add(opt);
            }
        }
        document.getElementById("__BTN_DELETE__").disabled=false;
        document.getElementById("FILE").disabled=true;
        parent.W3GUI.getGalleryItem(albumId,function(ai){
            document.getElementById("__PICTURE__").src=parent.W3CNF.USERHOME+"gallery/data/"+ai.id+"."+ai.ftype;
            document.getElementById("LABEL").value=ai.lable.join(" ");
            document.getElementById("BRIEF").value=parent.W3TXT.text2html(ai.brief);
        });
    }
}

//
init();

