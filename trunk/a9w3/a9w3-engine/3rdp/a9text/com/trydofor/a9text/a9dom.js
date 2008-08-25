/**
UTF8(BOM)  LGPL  trydofor.com  Jun.2007
===========================================================
A9Dom.__counter__
    全局计数器,用来生产a9dom的id

A9Dom(parent,type)
-----------------------------------------------------------
int    getId()
String getType()
A9Dom  getParent()

int    getTier()
void   setTier(int tier)
String getText()
void   setText(String text)
String getData()
void   setData(String data)
Object getInfo(String key)
    key == null 时,返回所有info's key-val对象
void   putInfo(String key, Object value)
-----------------------------------------------------------
int nowChild(pos)
    设置或查询枚举开始位置
    
boolean hasNext()
    是否具有下一个child

A9Dom nextChild()
    获得下一个child,如果没有或到最后一个child以后再调用,返回null;

A9Dom prevBrother()
    获得和前一个本身平级的兄弟节点
    
A9Dom newChild(String type)
    得到一个新的child,推荐使用

A9Dom getChildById(int id)
    获得指定id的child引用
    
A9Dom getChildByPos(int pos)
    获得指定位置的child引用
    
A9Dom dropChild(int id)
    删除指定id的child.

void  swapChild(int id1,int id2)
    交换指定两个child的位置.

A9Dom[] getAllChildId()
    以数组形式返回所有child的id,无child,返回[];
*/
var A9Dom = function(parent,type)
{
    var __id__   = 0;
    var __tier__ = 0;
    var __type__ = null;
    var __text__ = null;
    var __data__ = null;
    var __info__ = {};
    var __prior__ = null;
    var __parent__ = null;
    //
    var __childnow__ = 0;
    var __childseq__ = [];
    var __childmap__ = {};
    
    // check and init
    if(parent != null && ! parent instanceof A9Dom) throw "[parent] should be a A9Dom";
    if(typeof type != 'string') throw "[type] should be a string";
    
    // counter increase
    A9Dom.__counter__ ++;
    
    // set value
    __id__     = A9Dom.__counter__;
    __type__   = type;
    __parent__ = parent;
    
    // public members
    this.getId     = function(){ return __id__;};
    this.getType   = function(){ return __type__;};
    this.getParent = function(){ return __parent__;};
    
    this.getTier   = function(){ return __tier__; };
    this.setTier   = function(tier){ __tier__ = tier;};
    this.getText   = function(){ return __text__; };
    this.setText   = function(text){ __text__ = text; };
    this.getData   = function(){ return __data__; };
    this.setData   = function(data){ __data__ = data; };
    
    this.getInfo   = function(key)
    { 
        if(key != null)
        {
            return __info__[key];
        }
        //
        var nInfo = {};
        for(var key in __info__)
            nInfo[key] = __info__[key];
        //
        return nInfo;
    };
    
    this.putInfo   = function (key,value)
    { 
        if(key == null) throw "key is null";
        
        __info__[key] = value;
    };
    
    
    ////
    this.hasNext   = function(){ return  __childnow__ < __childseq__.length };
    
    this.nowChild  = function(pos)
    {
        if(pos == null) return __childnow__;
        if(pos < 0 || (__childseq__.length >0 && pos >= __childseq__.length)) throw "pos overflow:"+pos+"<"+__childseq__.length;
        __childnow__ = pos;
        return __childnow__;
    }
    
    this.nextChild = function()
    {
        if(__childnow__ < 0 ) __childnow__ = 0;
        if(__childnow__ >= __childseq__.length) return null;
        return __childmap__[__childseq__[__childnow__++]];
    }
    
    this.getPrevBrother = function()
    {
        return __prior__;
    }
    
    this.setPrevBrother = function(prior)
    {
        __prior__ = prior;
    }
    
    //
    this.getChildById = function(id)
    {
        return __childmap__[id];
    }
    
    this.getChildByPos = function(pos)
    {
        if(pos<0 || pos >= __childseq__.length) return null;
        return __childmap__[__childseq__[pos]];
    }
    
    this.newChild  = function(type)
    {
        var r = new A9Dom (this,type);
        
        if(__childseq__.length>0){
            r.setPrevBrother(__childmap__[__childseq__[__childseq__.length-1]]);
        }
        __childseq__[__childseq__.length] = r.getId();
        __childmap__[r.getId()] = r;
        return r;
    }
    
    this.dropChild = function(id)
    {
        if(id == null || __childmap__[id] == null) throw "[id] child not found,id="+id;
        
        var j=0;
        var childseq = [];
        for(var i = 0;i<__childseq__.length; i++)
        {
            if(__childseq__[i] == id) continue;
            
            childseq[j] = __childseq__[i];
            j++;
        }
        
        delete __childseq__;
        __childseq__ = childseq;
        
        var r = __childmap__[id];
        delete __childmap__[id];
        
        return r;
    }
    
    this.swapChild = function(id1,id2)
    {
        if(id1 == null || __childmap__[id1] == null) throw "[id1] child not found,id="+id1;
        if(id2 == null || __childmap__[id2] == null) throw "[id2] child not found,id="+id2;
        if(id1 == id2)  return;
        
        for(var i = 0;i<__childseq__.length; i++)
        {
            if(__childseq__[i] == id1)      __childseq__[i] = id2;
            else if(__childseq__[i] == id2) __childseq__[i] = id1;
        }
    }
    
    //
    this.getAllChildId = function()
    {
        var ids = [];
        for(var i=0;i<__childseq__.length;i++)
            ids[i] = __childseq__[i];
        return ids;
    }
    
    this.toString = function()
    {
        var str = "";
        str += "\nid:"+__id__;
        str += "\nparent:"+(__parent__==null?"null":__parent__.getId());
        str += "\ntype:"+__type__;
        str += "\ntier:"+__tier__;
        str += "\ninfo:";
        for(var k in __info__)
            str += "\n  "+k+"="+__info__[k];
        str += "\nchildnow:"+__childnow__;
        str += "\nchildseq:";
        for(var i = 0;i< __childseq__.length;i++)
            str += __childseq__[i]+",";
        str += "\nchildmap:";
        for(var k in __childmap__)
            str += k+",";
        str += "\ntext:"+(__text__==null || __text__==''?"":"\n"+__text__);
        return str;
    }
}
/* static counter for dom'id */
A9Dom.__counter__ = 0;

// type & args
A9Dom.type={
    root:"root",
    root$name:"name",
    root$dict:"dict",
    root$sect:"sect",
    root$area:"area",
    root$hash:"hash",
    root$join:"join",
    root$path:"path",
    info:"info",
    //
    sect:"sect",
    sect$level:"level",
    sect$flag:"flag",
    sect$title:"title",
    //
    list:"list",
    list$type:"type",
    //
    dict:"dict",
    dict$key:"key",
    dict$line:"line",
    dict$hint:"hint",
    //
    para_text:"para:text",
    para_line:"para:line",
    para_line$size:"size",
    para_line$lgth:"lgth",
    //
    mode_text:"mode:text",
    mode_trig_head:"mode:trig_head",
    mode_trig_foot:"mode:trig_foot",
    mode_trig$flag_st:"strong", // !
    mode_trig$flag_em:"em", // /
    mode_trig$flag_ul:"underline", // _
    mode_trig$flag_de:"del", // -
    mode_trig$flag_sb:"sub", // ,
    mode_trig$flag_sp:"sup", // '
    mode_trig$flag_fg:"fgcolor", // #
    mode_trig$flag_bg:"bgcolor", // & 
    mode_trig$flag_sz:"fontsize", // %
    mode_trig$pair:"pair",
    mode_join:"mode:join",
    mode_join$name:"mode:name",
    mode_join$addr:"mode:addr",
    mode_join$width:"mode:width",
    mode_join$height:"mode:height",
    mode_join$algn:"mode:algn",
    mode_join$algn_nlleft:"mode:algn_nlleft",
    mode_join$algn_nlcenter:"mode:algn_nlcenter",
    mode_join$algn_nlright:"mode:algn_nlright",
    mode_join$algn_illeft:"mode:algn_illeft",
    mode_join$algn_ilinside:"mode:algn_ilinside",
    mode_link:"mode:link",
    mode_link$join:"join",
    mode_link$name:"name",
    mode_link$addr:"addr",
    mode_$htm:"mode:$htm",
    //
    area:"area",
    area$crlf:"area$crlf",
    area$name:"area$name",
    area$type:"area$type",
    area$info:"area$info",
    area$args:"area$args"
};