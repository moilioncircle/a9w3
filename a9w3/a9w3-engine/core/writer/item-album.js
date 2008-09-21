function onAddLabel()
{
    var lb = document.getElementById("__LBLNME__").value;
    if(lb == "" || lb == "default") return;
    var obj = document.getElementById("__LABEL__");
    var txt = obj.value;
    if(txt == ""){
        obj.value = lb;
    }else if (txt.indexOf(lb)<0){
        obj.value = txt +", "+lb;
    }
}

function onDataUpload()
{
    if(isNewPaper()) return;

    var url = parent.W3CNF.getServerURL("paper.data.upload");
    if(url.indexOf("?")>0)
        url = url+"&UID="+parent.W3CNF.USER+"&PID="+paperId;
    else
        url = url+"?UID="+parent.W3CNF.USER+"&PID="+paperId;

    var fm = document.getElementById("__DATA_FORM__");
    fm.action = url;
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
    if(pos>0){
        var id = url.substr(pos+1);
        parent.W3GUI.getGalleryItem(id,function(ai){
            document.getElementById("PICTURE").src=parent.W3CNF.USERHOME+"gallery/data/"+ai.id+"."+ai.ftype;
            document.getElementById("CTIME").innerHTML=ai.ctime;
            document.getElementById("PIXEL").innerHTML=ai.pixel;
            document.getElementById("SIZEB").innerHTML=ai.sizeb;
            document.getElementById("VIEWS").innerHTML=ai.views;
            if(ai.lable ==null || ai.lable.length ==0)
            {
                ai.lable=[parent.W3CNF.GALLERY_LABEL.getValue("000")];
            }
            var lb = "";
            for(var k=0;k<ai.lable.length;k++)
            {
                lb +=ai.lable[k]+"&nbsp;";
            }
            document.getElementById("LABEL").innerHTML=lb;
            document.getElementById("BRIEF").innerHTML=parent.W3TXT.text2html(ai.brief);
        });
    }
}

//
init();

