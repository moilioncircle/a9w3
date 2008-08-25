/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
*/
var AreaTableRender = function()
{
    var __const_htm__= {};
    __const_htm__.table$info = ["<table  border='0' cellspacing='0' cellpadding='0' style='margin-left:","0","ex;'><tr><td class='a9text_area_table_info'>&nbsp;","infoStr","&nbsp;&nbsp;</td></tr></table>"];
    __const_htm__.table$head = ["<table id='AREA_","area_id","'  border='0' cellspacing='0' cellpadding='1' style='margin-left:","0","ex;'","","><tr><td valign='top' class='a9text_area_table_head'><table width='100%' border='0' cellspacing='","1","' cellpadding='4'>"];
    __const_htm__.table$foot = "</table></td></tr></table>";
    __const_htm__.table$tr_head = "<tr class='a9text_area_table_row'>";
    __const_htm__.table$tr_foot = "</tr>";
    __const_htm__.table$td_head = ["<td","",">"];
    __const_htm__.table$td_foot = "</td>";
        
    var __render_htm__ = [];
    var txt2htm = '<>';
    
    // public
    this.render = function(a9dom,func)
    {
        __render_htm__ = [];
        
        a9dom.nowChild(0);
        if(a9dom.hasNext())
            __table__(a9dom)
        else
            throw "no ready";
            
        a9dom.setData({'htmltext':__render_htm__.join(''),'linkjs':null,'linkcss':null});
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
    
    function __table__(a9dom)
    {
        var info = a9dom.getInfo(A9Dom.type.area$info);
        if(info!=null && info != "")
        {
            __const_htm__.table$info[1] = a9dom.getTier();
            __const_htm__.table$info[3] = A9Util.txt2htm("<table>"+info,txt2htm);
            __render_htm__.push(__const_htm__.table$info.join(''));
        }
        
        __const_htm__.table$head[1]=a9dom.getId();
        __const_htm__.table$head[3]=a9dom.getTier();
                
        var wh = "";
        if(a9dom.getInfo(A9Dom.type.area_table.$width)) // width
            wh += " widht='"+a9dom.getInfo(A9Dom.type.area_table.$width)+"'";
        if(a9dom.getInfo(A9Dom.type.area_table.$height)) // height
            wh += " height='"+a9dom.getInfo(A9Dom.type.area_table.$height)+"'";
            
        __const_htm__.table$head[5]=wh;

        if(a9dom.getInfo(A9Dom.type.area_table.$border)) // border
            __const_htm__.table$head[7] = a9dom.getInfo(A9Dom.type.area_table.$border);
        
        __render_htm__.push(__const_htm__.table$head.join(''));        
        
        a9dom.nowChild(0);
        
        while(a9dom.hasNext())
        {
            var tr = a9dom.nextChild();
            __render_htm__.push(__const_htm__.table$tr_head);
            
            while(tr.hasNext())
            {
                var td = tr.nextChild();
                
                var span = "";
                if(td.getInfo(A9Dom.type.area_table.td$colspan)) // colspan
                    span += " colspan='"+td.getInfo(A9Dom.type.area_table.td$colspan)+"'";
                if(td.getInfo(A9Dom.type.area_table.td$rowspan)) // rowspan
                    span += " rowspan='"+td.getInfo(A9Dom.type.area_table.td$rowspan)+"'";
                
                var style = "";
                if(td.getInfo(A9Dom.type.area_table.td$bold)) // bold
                    style += "font-weight: bold;";
                if(td.getInfo(A9Dom.type.area_table.td$left)) // left
                    style += "text-align: left;";
                if(td.getInfo(A9Dom.type.area_table.td$center)) // center
                    style += "text-align: center;";
                if(td.getInfo(A9Dom.type.area_table.td$right)) // right
                    style += "text-align: right;";
                
                if(style != "") style = " style='" + style + "'";
                __const_htm__.table$td_head[1] = span + style;
                
                __render_htm__.push(__const_htm__.table$td_head.join(''));
                __render_htm__.push(A9Util.txt2htm(td.getText(),txt2htm));
                __render_htm__.push(__const_htm__.table$td_foot);
            }
            
            __render_htm__.push(__const_htm__.table$tr_foot);
        }
        __render_htm__.push(__const_htm__.table$foot);
    }
}