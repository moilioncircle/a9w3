/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
String render(a9Dom)
*/
var A9TextRender = function()
{
    var default_show = false;

    var __color__ = 
    {
        view_info:"#EEEEEE",
        view_text:"#FEFEFE",
        type_root:"#000000",
        type_sect:"#990000",
        type_list:"#336600",
        type_dict:"#FF3300",
        type_para:"#0033cc",
        type_area:"#9900cc",
        type_mode:"#0066cc"
    };
    
    var __const__ = 
    {
        token_show:"-",
        token_hide:"+",
        size_fontbox:15,
        size_lines:10
    };
    
    var __css_js__ = ""+
        "<style>"+
        ".a9text_dom_tr{"+
        "    font-size:12px;"+
        "    text-align:left;"+
        "}"+
        ".a9text_dom_pre{"+
        "    position:relative;"+
        "    left:0px;"+
        "    top: 0px;"+
        "    width:100%;"+
        "    height:"+(__const__.size_fontbox * __const__.size_lines+5)+"px;"+
        "    line-height:15px;"+
        "    font-size:12px;"+
        "    overflow:auto;"+
        "}"+
        ".a9text_dom_a{"+
        "    color: #FF0000;"+
        "    text-decoration: none;"+
        "}"+
        "</style>"+
        ""+
        "<scr"+"ipt type='text/javascript'>"+
        "var __children__ = [];"+
        ""+
        "function onClickNode(id,toopen)"+
        "{"+
        "    var token = document.getElementById('TOKEN_'+id);"+
        ""+
        "    if( toopen != null )"+
        "    {"+
        "        document.getElementById('NODE_'+id).style.display=toopen?'':'none';"+
        "        if(token.innerHTML == '"+__const__.token_hide+"' && toopen) return;"+
        "    }"+
        "    else"+
        "    {"+
        "        toopen = (token.innerHTML == '"+__const__.token_hide+"');"+
        "        token.innerHTML =toopen?'"+__const__.token_show+"':'"+__const__.token_hide+"';"+
        "    }"+
        "    "+
        "    var cs = __children__[id];"+
        "    if(cs != null)"+
        "        for( var i=0; i<cs.length;i++)"+
        "            onClickNode(cs[i],toopen);"+
        "}"+
        ""+
        "function onClickInfo(id)"+
        "{"+
        "    var text = document.getElementById('TEXT_'+id);"+
        "    text.style.display = text.style.display == 'none'?'':'none';"+
        "}"+
        "</scr"+"ipt>";

    var __nodeHtml__ = [ //$ID,$TIER,$INFO,$TEXT,$COLOR
        "<div id='NODE_",
        "$ID", // 1
        "'><!-- strange for opera -->"+
        "    <table width='100%' border='0' cellspacing='0' cellpadding='0'>"+
        "    <tr class='a9text_dom_tr' bgcolor='"+__color__.view_info+"'>"+
        "    <th width='",
        "$TIER", // 3
        "' height='"+__const__.size_fontbox+"'></th>"+
        "    <th width='"+__const__.size_fontbox+"'><a id='TOKEN_",
        "$ID", // 5
        "' class='a9text_dom_a' href='javascript:onClickNode(",
        "$ID", // 7
        ")'>"+
        (default_show?__const__.token_hide:__const__.token_show)+"</a></th>"+
        "    <th onClick='onClickInfo(",
        "$ID", // 9
        ")' style='cursor:pointer'><font color='",
        "$COLOR", // 11
        "'>",
        "$INFO", // 13
        "</font></th>"+
        "    </tr>"+
        "    </table>"+
        "    "+
        "    <table id='TEXT_",
        "$ID", //15
        "' width='100%' border='0' cellspacing='0' cellpadding='0' "+
        (default_show?"":"style='display:none;'")+">"+
        "    <tr bgcolor='"+__color__.view_text+"'>"+
        "    <td width='",
        "$TIER", //17
        "' height='"+__const__.size_fontbox+"'></td>"+
        "    <td width='"+__const__.size_fontbox+"'></td>"+
        "    <td><pre class='a9text_dom_pre'>",
        "$TEXT", //19
        "</pre></td>"+
        "    </tr>"+
        "    </table>"+
        "</div>"];
    
    var __render_htm__ = [];
    var __render_js__  = [];
    // public
    this.render = function(a9dom,func)
    {
        // dispose
        __render_htm__ = [];
        __render_js__  = [];
        
        __walkDom__(a9dom,0);
        //
        var html = __css_js__+ 
        __render_htm__.join('')+
        "<scr"+"ipt type='text/javascript'>"+
        __render_js__.join('') + 
        "</scr"+"ipt>";
        
        a9dom.setData(html)
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
    
    // private
    function __walkDom__(dom,level)
    {
        if(level <1) level = 1;
        __showHtml__(dom,level);
        dom.nowChild(0);
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            c.nowChild(0);
            if(c.hasNext()) __walkDom__(c,level+1);
            else  __showHtml__(c,level+1);
        }
    }

    function __showHtml__(dom,level)
    {
        var id   = ""+dom.getId();
        var tier = ""+(level* __const__.size_fontbox);
        var text = A9Util.txt2htm(dom.toString());
        var type = dom.getType();
                
        var info = ((type==A9Dom.type.sect)?type+":"+dom.getInfo(A9Dom.type.sect$flag):type)+" ("+dom.getId()+")";

        var pos  = type.indexOf(":");
        if(pos>0) type = type.substring(0,pos);

        var color = __color__["type_"+type];
        if(color == null) color = __color__.type_root;
        
        // gen js
        var cids = dom.getAllChildId();
        if(cids.length >0)
        {
            info += " {"+cids.length+"}";
            __render_js__[__render_js__.length] = "__children__["+id+"]=["+cids.join(',')+"];";
        }
        
        //merge htm 

        __nodeHtml__[1]  = id;
        __nodeHtml__[5]  = id;
        __nodeHtml__[7]  = id;
        __nodeHtml__[9]  = id;
        __nodeHtml__[15] = id;
        __nodeHtml__[3]  = tier;
        __nodeHtml__[17] = tier;
        __nodeHtml__[11] = color;
        __nodeHtml__[13] = info;
        __nodeHtml__[19] = text;
        var htm = __nodeHtml__.join("");

        //document.write(htm);
        __render_htm__[__render_htm__.length]= htm;        
    }
}