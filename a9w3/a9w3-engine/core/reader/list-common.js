/*
drawCommonItem(id,txt);
INITOBJ={};
*/

var INITOBJ = {
    'VAR_PCOUNT':0,
    'VAR_FUNNEW':'',
    'FNC_LABELV':null,
    'FNC_TTLLNK':null,
    'FNC_LBLLST':null,
    'FNC_LBLLNK':null,
    'FNC_MNTLST':null,
    'FNC_MNTLNK':null,
    'FNC_ITEMAI':null,
    'FNC_ITEMVW':null
};

/** list view  */
var listCache = {'obj':null,'lst':null};
var linkCache = {'obj':null,'lst':null};
var pageCache = {'type':null,'name':null,'page':1};
var filterStr = {'label':'','month':''};
var objectIds = {'LIST_ICN':'LIST_ICN','LIST_ALL':'LIST_ALL','LIST_FLT':'LIST_FLT','LIST_BOX':'W3GUI_LINK_BOX_'};

function switchListView(show){
    if(show){
        document.getElementById(objectIds.LIST_ALL).style.display="";
        document.getElementById(objectIds.LIST_ICN).src="../../data/image/icon-list-tobottom.png";
        document.getElementById(objectIds.LIST_FLT).value=(pageCache.type == 'label')?filterStr.label:filterStr.month;
    }else{
        document.getElementById(objectIds.LIST_ALL).style.display="none";
        document.getElementById(objectIds.LIST_ICN).src="../../data/image/icon-list-toright.png";
    }
}

function filterList(name){
    if(name == null || name == "") return true;
    var flts = [];
    if(pageCache.type == 'label'){
        flts = filterStr.label.split(/\s+/);
    }else{
        flts = filterStr.month.split(/\s+/);
    }
    var isFlt = true
    var ctFlt = 0;
    for(var i=0;i<flts.length;i++){
        if(flts[i]=="") continue;
        if(name.indexOf(flts[i])>=0){
            isFlt = false;
            break;
        }
        ctFlt++;
    }
    return isFlt && ctFlt>0;
}
function onInputFilter(event){
    var keynum = -1;
    if(window.event){
        keynum = event.keyCode;
    }else if(event.which){ // Netscape/Firefox/Opera
        keynum = event.which;
    }else{
        alert("Not Support");
    }
    if(keynum == 13){
        update();
        switchListView(true);
    }else{
        if(pageCache.type == 'label'){
            filterStr.label=document.getElementById(objectIds.LIST_FLT).value;
        }else{
            filterStr.month=document.getElementById(objectIds.LIST_FLT).value;
        }
    }
}

function drawCommonListLabelView(cur,obj,lst){
    if(obj != null) listCache['obj']=obj;
    else obj = listCache['obj'];
    
    if(lst != null) listCache['lst']=lst;
    else lst = listCache['lst'];
    
    if(obj == null) return;
    if(lst == null || lst.length ==0){
	    obj.innerHTML=emptyList();
        return;
    }

    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";
    
    var pos = 0;
    for(var i=0;i<lst.length;i++){
        if(cur == lst[i]){
            pos = i;
            break;
        }
    }
    cur = lst[pos];
    
    pageCache['name']=cur; // cache
    
    var show = [];
    if(pos>0) show.push(lst[pos-1]);
    show.push(cur);
    if(pos+1<lst.length) show.push(lst[pos+1]);
    
    var buff = [];
    buff.push("<table width='100%' border='0' cellspacing='0' cellpadding='0'  ");
    buff.push("onmouseover='switchListView(true)' ");
    buff.push("onmouseout='switchListView(false)'>");
    buff.push("<tr>");
    buff.push("<td width='12' class='a9w3_text_list_box'>");
    buff.push("<img id='"+objectIds.LIST_ICN+"' src='../../data/image/icon-list-toright.png' />");
    buff.push("</td>");
    buff.push("<td  class='a9w3_text_list_box'>");
    for(var i=0;i<show.length;i++){
        if(cur != show[i]){
            buff.push("<a href='javascript:{showPage(\"label\",\""+show[i]+"\")}' class='a9w3_link_infos'>"+INITOBJ['FNC_LABELV'].getValue(show[i])+"</a>");
        }else{
            buff.push(INITOBJ['FNC_LABELV'].getValue(show[i]));
        }
        buff.push(" ");
    }
    
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("<tr id='"+objectIds.LIST_ALL+"' style='display:none'>");
    buff.push("<td></td>");
    buff.push("<td class='a9w3_text_list_box'>");
    buff.push("<input type='text' id='"+objectIds.LIST_FLT+"' ondblclick='this.value=\"\"' onkeyup='onInputFilter(event)'  style='border:1px solid #996633;height:14px;width:60px;font-size:10px;color:#996633;margin:0px;padding:0px;'/> ");

    for(var i=0;i<lst.length;i++){
        var lblName = INITOBJ['FNC_LABELV'].getValue(lst[i]);
        if(filterList(lblName)) continue;
        if(cur != lst[i]){
            buff.push("<a href='javascript:{showPage(\"label\",\""+lst[i]+"\")}' class='a9w3_link_infos'>"+lblName+"</a>");
        }else{
            buff.push(lblName);
        }
        buff.push(" ");
    }
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("</table>");
    
    obj.innerHTML=buff.join("");
}

function drawCommonListMonthView(cur,obj,lst){
    if(obj != null) listCache['obj']=obj;
    else obj = listCache['obj'];
    

    if(lst != null) listCache['lst']=lst;
    else lst = listCache['lst'];
    
    
    if(obj == null) return;
    if(lst == null || lst.length ==0){
        obj.innerHTML=emptyList();
        return;
    }
    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";
    
    var pos = 0;
    for(var i=0;i<lst.length;i++){
        if(cur == lst[i]){
            pos = i;
            break;
        }
    }
    cur = lst[pos];
    
    pageCache['name']=cur; // cache
    
    var show = [];
    if(pos>0) show.push(lst[pos-1]);
    show.push(cur);
    if(pos+1<lst.length) show.push(lst[pos+1]);
    
    var buff = [];
    buff.push("<table width='100%' border='0' cellspacing='0' cellpadding='0'  ");
    buff.push("onmouseover='switchListView(true)' ");
    buff.push("onmouseout='switchListView(false)'>");
    buff.push("<tr>");
    buff.push("<td width='12' class='a9w3_text_list_box'>");
    buff.push("<img id='"+objectIds.LIST_ICN+"' src='../../data/image/icon-list-toright.png' />");
    buff.push("</td>");
    buff.push("<td  class='a9w3_text_list_box'>");
    for(var i=0;i<show.length;i++){
        if(cur != show[i]){
            buff.push("<a href='javascript:{showPage(\"month\",\""+show[i]+"\")}' class='a9w3_link_infos'>"+show[i]+"</a>");
        }else{
            buff.push(show[i]);
        }
        buff.push(" ");
    }
    
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("<tr id='"+objectIds.LIST_ALL+"' style='display:none'>");
    buff.push("<td></td>");
    buff.push("<td class='a9w3_text_list_box'>");
    buff.push("<input type='text' id='"+objectIds.LIST_FLT+"' ondblclick='this.value=\"\"' onkeyup='onInputFilter(event)'  style='border:1px solid #996633;height:14px;width:60px;font-size:10px;color:#996633;margin:0px;padding:0px;'/> ");
    for(var i=0;i<lst.length;i++){
        if(filterList(lst[i])) continue;
        if(cur != lst[i]){
            buff.push("<a href='javascript:{showPage(\"month\",\""+lst[i]+"\")}' class='a9w3_link_infos'>"+lst[i]+"</a>");
        }else{
            buff.push(lst[i]);
        }
        buff.push(" ");
    }
    buff.push("</td>");
    buff.push("</tr>");
    buff.push("</table>");
    
    obj.innerHTML=buff.join("");
}

function drawCommonLinkView(page,obj,lst){
    if(obj != null) linkCache['obj']=obj;
    else obj = linkCache['obj'];
    
    if(lst != null) linkCache['lst']=lst;
    else lst = linkCache['lst'];
    

    if(obj == null) return;
    if(lst == null || lst.length ==0){
        obj.innerHTML=emptyList();
        return;
    }
    //
    obj.innerHTML="<img alt='loading ...' src='../../data/image/loading-circle-red-s.gif' />";

    var pall = Math.floor((lst.length-1)/INITOBJ['VAR_PCOUNT'])+1;
    if(page == null || page< 1) page = 1;
    if(page>pall) page = pall;
    
    pageCache['page']=page; // cache
    
    var tmp = [1,2,page-1,page,page+1,pall-1,pall];
    var cur = 0;
    var show=[];
    for(var i=0;i<tmp.length;i++){
        if(tmp[i]>0 && tmp[i]<=pall && tmp[i]>cur){
            show.push(tmp[i]);
            cur = tmp[i];
        }
    }
    
    var poff = INITOBJ['VAR_PCOUNT']*(page-1);
    var size = lst.length-poff>INITOBJ['VAR_PCOUNT']?INITOBJ['VAR_PCOUNT']:lst.length-poff;
    
    // draw box
    var buff = [];
    for(var i=0;i<size;i++){
        buff.push("<div id='"+objectIds['W3GUI_LINK_BOX_']+lst[poff+i]+"'>");
        buff.push("<img alt='loading "+lst[poff+i]+"' title='"+lst[poff+i]+"' src='../../data/image/loading-circle-red-s.gif' />");
        buff.push("</div>");
    }
    // draw page
    buff.push("<div class='a9w3_text_page_box'>");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
        buff.push("<a href='javascript:"+INITOBJ['VAR_FUNNEW']+"()'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-new.png' title='edit'  border=0 /></a>");
    }

    for(var j=0;j<show.length;j++){
        if(j>0 && show[j]-show[j-1]>1)buff.push("--");

        if(show[j]!=page){
            buff.push("<a href='javascript:drawCommonLinkView("+show[j]+")' class='a9w3_link_infos'>"+show[j]+"</a>");
        }else{
            buff.push("<span class='a9w3_text_infos'>"+page+"</span>");
        }
        buff.push(" ");
    }
    buff.push("</div>");
    obj.innerHTML=buff.join("");
    
    //
    for(var i=0;i<size;i++){
        INITOBJ['FNC_ITEMAI'](lst[poff+i],INITOBJ['FNC_ITEMVW']);
    }
}

function drawCommonItem(itemId,html){
    document.getElementById(objectIds['W3GUI_LINK_BOX_']+itemId).innerHTML=html;
}

// label
function showLabel(par,page){
    INITOBJ['FNC_LBLLST'](function(ls){
        if(par == null && ls != null && ls.length>0){
            var rn = Math.random()
            rn = Math.round(rn*ls.length)
            par = ls[rn];
        }
        drawCommonListLabelView(par,document.getElementById("ARTLISTS"),ls);
        INITOBJ['FNC_LBLLNK'](par,function(ls2){
            drawCommonLinkView(page,document.getElementById("ARTLINKS"),ls2);
        });
    });
}
// month
function showMonth(par,page){
    INITOBJ['FNC_MNTLST'](function(ls){
        if(par == null && ls != null && ls.length>0){
            par = ls[0];
        }
        drawCommonListMonthView(par,document.getElementById("ARTLISTS"),ls);
        INITOBJ['FNC_MNTLNK'](par,function(ls2){
            drawCommonLinkView(page,document.getElementById("ARTLINKS"),ls2);
        });
    });
}
// total
function showTotal(page){
    INITOBJ['FNC_TTLLNK'](function(ls){
        document.getElementById("ARTLISTS").innerHTML="";
        drawCommonLinkView(page,document.getElementById("ARTLINKS"),ls);
    });
}
// stars
function showStars(page){
    INITOBJ['FNC_STRLNK'](function(ls){
        document.getElementById("ARTLISTS").innerHTML="";
        drawCommonLinkView(page,document.getElementById("ARTLINKS"),ls);
    });
}

// showpage
function showPage(t,p){
    if(t !="label" && t != "month" && t != "stars") t = "total";
    
    // cache
    pageCache['type']=t;
    pageCache['name']=p;
    pageCache['page']=1;
    
    var buff = [];
    buff.push("<table border='0' cellspacing='0' cellpadding='0' width='100%'>");
    buff.push("<tr height='20'>");
    if(t == "total"){
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='total' src='../../data/image/type-total.png' border=0/></span></td>");
    }else{
        buff.push("<td style='text-align:center;'><a href='javascript:showPage()' class='a9w3_type_link'><img alt='total' src='../../data/image/type-total.png' border=0/></a></td>");
    }
    if(t == "label"){
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='label' src='../../data/image/type-label.png' border=0/></span></td>");
    }else{
        buff.push("<td style='text-align:center;'><a href='javascript:showPage(\"label\")' class='a9w3_type_link'><img alt='label' src='../../data/image/type-label.png' border=0/></a></td>");
    }
    if (t == "month"){
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='month' src='../../data/image/type-month.png' border=0/></span></td>");
    }else{
        buff.push("<td style='text-align:center;'><a href='javascript:showPage(\"month\")' class='a9w3_type_link'><img alt='month' src='../../data/image/type-month.png' border=0/></a></td>");
    }
    if (t == "stars"){
        buff.push("<td style='text-align:center;'><span class='a9w3_type_on'><img alt='month' src='../../data/image/type-stars.png' border=0/></span></td>");
    }else{
        buff.push("<td style='text-align:center;'><a href='javascript:showPage(\"stars\")' class='a9w3_type_link'><img alt='stars' src='../../data/image/type-stars.png' border=0/></a></td>");
    }
    buff.push("</tr>");
    buff.push("</table>");
    document.getElementById("ARTTYPES").innerHTML=buff.join("");
    
    update();
}

// update
function update(){
    if(pageCache['type'] == "label") showLabel(pageCache['name'],pageCache['page']);
    else if (pageCache['type'] == "month") showMonth(pageCache['name'],pageCache['page']);
    else if (pageCache['type'] == "stars") showStars(pageCache['name'],pageCache['page']);
    else showTotal(pageCache['page']);
}

function emptyList(){
    var html ="<br />"+parent.W3CNF.getI18nString("info.list.empty");
    if(parent.W3CNF.A9W3_RTMODE == parent.W3CNF.A9W3_WRITER){
        html+="&nbsp;<a href='javascript:"+INITOBJ['VAR_FUNNEW']+"()'><img onmouseover='this.className=\"a9w3_admin_on\"' onmouseout='this.className=\"a9w3_admin_off\"' src='../../data/image/icon-list-new.png' title='edit'  border=0 /></a>";
    }
    return html;
}

//////////// init /////////////
function init(){
    var par = self.location.href;
    var pos = par.indexOf('?');
    if(pos < 0){
        showPage();
    }else{
        showPage("label",par.substr(pos+1));
    }
}