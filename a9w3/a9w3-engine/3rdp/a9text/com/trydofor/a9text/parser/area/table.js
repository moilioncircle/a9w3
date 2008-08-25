/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var AreaTableParser = function()
{
    A9Dom.type.area_table = {
        $border:"area_table$border",
        $width:"area_table$width",
        $height:"area_table$height",
        tr:"area_table.tr",
        td:"area_table.td",
        td$colspan  :"area_table$colspan",
        td$rowspan  :"area_table$rowspan",
        td$bold  :"area_table$bold",
        td$left  :"area_table$left",
        td$center:"area_table$center",
        td$right :"area_table$right"
    };
    
    var __super__ = null; // top a9dom
    var __crlf__  = "\r\n";
    var __lines__ = [];

    
    ////
    this.parse = function(a9dom,func)
    {
        if(a9dom == null || 'table' != a9dom.getInfo(A9Dom.type.area$type))
            return;
        
        //
        var text = a9dom.getText();
        if(text == null || text == "") return;
        
        text = A9Util.valueBlank(text);
        __super__ = a9dom;
        __crlf__  = a9dom.getInfo(A9Dom.type.area$crlf);
        __lines__ = text.split(__crlf__);
        
        /*
        // TODO set para of table
        dom.putInfo(A9Dom.type.area$type,type);
        dom.putInfo(A9Dom.type.area$info,info);
        dom.putInfo(A9Dom.type.area$args,args);
        dom.putInfo(A9Dom.type.area$crlf,__crlf__);
        */
        
        if(__isSimple__(__lines__[0]))
            __parseSimple__();
        else
            __parseStandard__();
        
        if(func instanceof Function)
        try{func(a9dom)}catch(e){};
    }
    
    function __parseSimple__()
    {
        var trs = [];
        var tdp = [];
        
        var exp = / {3,}/;
        var bnk = /^ *$/;
        // orgnize tds
        for(var i=0; i<__lines__.length; i++) 
        {
            var line = __lines__[i];
            if(bnk.test(line)) continue;
            
            var tds = line.split(exp);
            
            if (tdp.length == 0) // init
            {
                var p = 0;
                for(var j=0;j<tds.length;j++)
                {
                    p = line.indexOf(tds[j],p);
                    tdp[j] = p;
                }
            }
            else if (tds.length < tdp.length) // less than header
            {
                var tdst = [];
                for(var j=0; j<tdp.length; j++)
                    tdst.push("");
                
                //
                var p1 = 0;
                var p2 = 0;
                var m = 0;
                for(var j=0; j<tdp.length; j++)
                {
                    p2 = line.indexOf(tds[m],p1);
                    if(p2 <= tdp[j] ||
                       (tds.length-m >= tdp.length - j) ||
                       (j<tdp.length-1 && (p2 + tds[m].length<tdp[j+1])))
                    {
                        tdst[j]=tds[m];
                        m ++;
                        p1 = p2;
                    }
                }
                tds = tdst;
            }
            else if (tds.length > tdp.length) // more than header
            {
                var tdst = [];
                for(var j=0; j<tdp.length; j++)
                    tdst.push(tds[j]);
                for(var j=tdp.length;j<tds.length;j++)
                    tdst[tdp.length-1] += tds[j];
                //
                tds = tdst;
            }
            //
            trs.push(tds);
        }
        
        // make doms
        for(var i=0; i<trs.length; i++)
        {
            var trDom = __super__.newChild(A9Dom.type.area_table.tr);
            var tds = trs[i];
            for(var j=0; j<tds.length; j++)
            {
                var tdDom = trDom.newChild(A9Dom.type.area_table.td);
                if(i == 0) tdDom.putInfo(A9Dom.type.area_table.td$bold,true);
                if(tds[j]) tdDom.setText(tds[j]);
            }
        }
    }
    
    function __parseStandard__()
    {
        // TODO
        throw "not ready now";
        
        var trs = [];
        var tdc = 0;
        
        // orgnize tds
        for(var i=0; i<__lines__.length; i++) 
        {
            var line = __lines__[i];
            
        }
        
        // make doms
        
    }
    
    function __isSimple__(text)
    {
        if(text == null) return true;
        
        text = A9Util.trimLeft(text);
        var c = text.charAt(0);
        return c != "!" && c != "|";
    }
}