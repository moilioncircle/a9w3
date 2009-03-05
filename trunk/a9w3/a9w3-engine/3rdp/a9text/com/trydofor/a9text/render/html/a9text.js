/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
String render(a9Dom)
*/
var A9TextRender = function()
{
    var __const_var__= {};
    __const_var__.join_$index = "$INDEX";
    
    var __const_htm__= {};
    
    __const_htm__.index_item = ["<div class='a9text_breakall' style='margin-left:","$tier","ex'><strong>","$flag","</strong>&nbsp;<a class='a9text_link' href='javascript:{}' onclick='window.scrollBy(0,document.getElementById(\"","sect_id","\").offsetTop-this.offsetTop)'>","$title","</a></div>"];
    
    __const_htm__.root = ["<div class='a9text_root'>","$title","</div>"];
    __const_htm__.info_head = "<div class='a9text_info'>";
    __const_htm__.info_foot = "</div>";
    
    __const_htm__.sect = ["<div id='SECT_","sect_id","' class='a9text_sect_","$level","'>","$flag","  ","$title","</div>"];
    __const_htm__.sect_head = "<div class='a9text_sect_head'>";
    __const_htm__.sect_foot = "</div>";
    __const_htm__.dict_head = ["<div id='DICT_","dict_id","' class='a9text_breakall' style='margin-left:","$tier","ex'><strong>","$key","</strong> "];
    __const_htm__.dict_foot = "</div>";
    __const_htm__.para_head = ["<div class='a9text_breakall' style='margin-left:","$tier","ex'>"];
    __const_htm__.para_foot = "</div>";
    __const_htm__.area = ["<table id='AREA_","area_id","' style='margin-left:","$tier","ex;' class='a9text_area_syntax' border='0' cellspacing='0' cellpadding='0'>","infostr","<tr><td><pre class='a9text_area'>","$para","</pre></td></tr></table>"];
    __const_htm__.area$info = ["<tr><td><span class='a9text_area_info'>","infostr","&nbsp;</span></td></tr>"];
    __const_htm__.area_text = ["<table id='AREA_","area_id","' style='margin-left:","$tier","ex;' class='a9text_area_syntax' border='0' cellspacing='0' cellpadding='0'>","infostr","<tr><td><pre style='padding:6px;border:","0","px dashed #666699;'>","$para","</pre></td></tr></table>"];
    __const_htm__.text = ["<pre style='margin-left:","$tier","ex'>","$para","</pre>"];
    
    __const_htm__.list_head = ["<div class='a9text_breakall' style='margin-left:","$tier","ex'>"];;
    __const_htm__.list_foot = "</div>";
    __const_htm__.list_item_head   = "<ul class='a9text_list_item'>";
    __const_htm__.list_step_head = "<ol class='a9text_list_step'>";
    __const_htm__.list_item_foot  = "</ul>";
    __const_htm__.list_step_foot  = "</ol>";
    __const_htm__.list_entry_head = ["<li class='a9text_list_entry' type='","$type","'>"];
    __const_htm__.list_entry_foot = "</li>";
    __const_htm__.list_line_token = "<br />";
    
    __const_htm__.mode_hash = ["<a  href='javascript:{}' onclick='","$addr","' class='a9text_link'>","$name","</a>"];
    __const_htm__.mode_anchor = ["<span  class='a9text_anchor' id='HASH_","hash_id","'>","name","</span>"];
    __const_htm__.mode_link = ["<a href='","$addr","' class='a9text_link' target='_blank'>","$name","</a>"];
    __const_htm__.mode_joinlink = ["<a href='","$addr","' class='a9text_link' target='_blank'>","$join","</a>"];
    __const_htm__.mode_joinline = ["<div style='text-align: ","align",";'>","$joininline","</div>"];
    __const_htm__.mode_join_etc = ["<a id='JOIN_","join_id","' href='","$addr","' class='a9text_link' target='_blank'>","$join","</a>"];
    __const_htm__.mode_join$img = ["<img id='JOIN_","join_id","' src='","$src","' alt='","$name","' ","align",""," border='0'/>"];
    __const_htm__.mode_join$swf = ["<object  id='JOIN_","join_id","' ",""," classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0'><param name='movie' value='","$swf","'><param name='quality' value='high'><embed ",""," src='","$swf","' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash'></embed></object>"];
    
    __const_htm__.mode_trig_st_head = "<strong>"; // !
    __const_htm__.mode_trig_em_head = "<em>"; // /
    __const_htm__.mode_trig_ul_head = "<u>"; // _
    __const_htm__.mode_trig_de_head = "<del>"; // -
    __const_htm__.mode_trig_sb_head = "<sub>"; //,
    __const_htm__.mode_trig_sp_head = "<sup>";  //'
    __const_htm__.mode_trig_fg_head = ["<span style='color:#","$color","'>"];  //#
    __const_htm__.mode_trig_bg_head = ["<span style='background-color:#","$color","'>"]; //& 
    __const_htm__.mode_trig_sz_head = ["<span style='font-size: ","$size","%'>"]; //%

    __const_htm__.mode_trig_st_foot = "</strong>"; // !
    __const_htm__.mode_trig_em_foot = "</em>"; // /
    __const_htm__.mode_trig_ul_foot = "</u>"; // _
    __const_htm__.mode_trig_de_foot = "</del>"; // -
    __const_htm__.mode_trig_sb_foot = "</sub>"; //,
    __const_htm__.mode_trig_sp_foot = "</sup>";  //'
    __const_htm__.mode_trig_fg_foot = "</span>";  //#
    __const_htm__.mode_trig_bg_foot = "</span>"; //& 
    __const_htm__.mode_trig_sz_foot = "</span>"; //%
    
    //               
    __const_htm__.line0 = "<br/>";
    __const_htm__.linex = ["<hr align='left' size='","$size","' noshade='noshade' style='margin-left:","$tier","ex; width:","$lgth","ex'/>"];
    //__const_htm__.linex = ["<div style='height:","$size","px; margin-left:","$tier","ex;width:","$lgth","ex; background-color:#333333;margin-bottom:2ex'></div>"];
                     
    var __render_htm__ = [];
    var __render_css__ = [];
    var __render_js__  = [];
    
    var __join_extn__ = {'img':'','swf':''};
    
    var __root__ = null;
    var __last_dom__ = null;
    
    var __progress_bar__ = null;
    var __total_doms__ = 0;
    var __root_domid__ = 0;
    
    // public
    this.setProgressBar = function(pgb){
        if(pgb != null)__progress_bar__ = pgb;
    }
    
    this.render = function(a9dom,func)
    {
        if(!(func instanceof Function)) throw "a9text render need callback function for async";
        // clear
        __last_dom__ = null;
        __render_htm__ = [];
        __render_css__ = [];
        __render_js__  = [];
        
        var jimg = A9Conf.getConf("render.html.join.img.name");
        var jswf = A9Conf.getConf("render.html.join.swf.name");
        if(jimg != null && jimg != '')__join_extn__['img'] = jimg;
        if(jswf != null && jswf != '')__join_extn__['swf'] = jswf;

        __render_css__.push(A9Conf.getConf("render.html.common.css.a9text"));
        //
        __total_doms__ = A9Dom.__counter__ - a9dom.getId();
        __root_domid__ = a9dom.getId();
        __root__ = a9dom;
        
        __domManager__(a9dom);
        
        A9Loader.runAfterClassLoaded(function(){
            a9dom.setData({'htmltext':__render_htm__.join(''),
                           'linkjs'  :__uniqueArray__(__render_js__),
                           'linkcss' :__uniqueArray__(__render_css__)});
            func(a9dom);
        });
    }
    
    // private
    function __domManager__(dom)
    {
        if(__progress_bar__ != null){
            try{
                __progress_bar__.work(Math.ceil(40*(dom.getId()-__root_domid__)/__total_doms__));
            }catch(e){};
        }
        
        switch(dom.getType())
        {
            case A9Dom.type.root:
               __root2htm__(dom);
               break;

            case A9Dom.type.info:
               __info2htm__(dom);
               break;
               
            case A9Dom.type.sect:
               __sect2htm__(dom);
               break;
               
            case A9Dom.type.dict:
               __dict2htm__(dom);
               break;
               
            case A9Dom.type.list:
               __list2htm__(dom,__last_dom__);
               break;
               
            case A9Dom.type.para_text:
               __para2htm__(dom);
               break;
            case A9Dom.type.para_line:
               __line2htm__(dom);
               break;
               
            case A9Dom.type.mode_text:
            case A9Dom.type.mode_trig_head:
            case A9Dom.type.mode_trig_foot:
            case A9Dom.type.mode_join:
            case A9Dom.type.mode_link:
            case A9Dom.type.mode_$htm:
               __mode2htm__(dom);
               break;
            
            case A9Dom.type.area:
               __area2htm__(dom);
               break;
           
            default:
               __text2htm__(dom);
        }
        __last_dom__ = dom;
    }
    
    //
    function __root2htm__(dom)
    {
        dom.nowChild(0);
        __const_htm__.root[1] = dom.getInfo(A9Dom.type.root$name);
        __render_htm__.push(__const_htm__.root.join(''));
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            __domManager__(c);
        }
    }
    
    function __info2htm__(dom)
    {
        dom.nowChild(0);
        __render_htm__.push(__const_htm__.info_head);
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            __domManager__(c);
        }
        __render_htm__.push(__const_htm__.info_foot);
    }
    
    function __sect2htm__(dom)
    {
        var flag = dom.getInfo(A9Dom.type.sect$flag);
        var le = flag.split('.').length;
        
        __const_htm__.sect[1] = dom.getId();
        __const_htm__.sect[3] = le>5?5:le;
        __const_htm__.sect[5] = flag;
        __const_htm__.sect[7] = A9Util.txt2htm(dom.getInfo(A9Dom.type.sect$title));
        
        __render_htm__.push(__const_htm__.sect.join(''));
        
        //
        dom.nowChild(0);
        __render_htm__.push(__const_htm__.sect_head);
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            __domManager__(c);
        }
        __render_htm__.push(__const_htm__.sect_foot);
    }
    
    function __dict2htm__(dom)
    {
        __const_htm__.dict_head[1] = dom.getId();
        __const_htm__.dict_head[3] = dom.getTier();
        __const_htm__.dict_head[5] = dom.getInfo(A9Dom.type.dict$key);
        __render_htm__.push(__const_htm__.dict_head.join(''));

        //
        dom.nowChild(0);
        if(dom.getInfo(A9Dom.type.dict$line) && dom.hasNext())
        {
            paraDom = dom.nextChild();
            paraDom.nowChild(0);
            while(paraDom.hasNext())
            {
                var c = paraDom.nextChild();
                __domManager__(c);
            }
        }
        
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            __domManager__(c);
        }
        
        __render_htm__.push(__const_htm__.dict_foot);
    }
    
    function __list2htm__(dom,ldom,thiz)
    {
        var type  = __getListType__(dom);
        var ltype = __getListType__(ldom);

        var headStr = "";
        if(thiz == null && type != ltype) // out and not same, indent
        {
            __const_htm__.list_head[1] = dom.getTier();
            headStr = __const_htm__.list_head.join('');
        }
        
        if(thiz == null && ltype != -1 && type == ltype) __render_htm__.pop();
        
        // check
        if(type == ltype && dom.getTier() == ldom.getTier())
        {
            __render_htm__.pop();
        }
        else 
        {
            if(type == 1)
                __render_htm__.push(headStr+__const_htm__.list_item_head);
            else if (type == 2)
                __render_htm__.push(headStr+__const_htm__.list_step_head);
        }
    
       // check type
        var liVal = dom.getInfo(A9Dom.type.list$type);
        if(/[0-9]/.test(liVal)) __const_htm__.list_entry_head[1]="1";
        else if (/[a-z]/.test(liVal)) __const_htm__.list_entry_head[1]="a";
        else if (/[A-Z]/.test(liVal)) __const_htm__.list_entry_head[1]="A";
        else if ('#' == liVal) __const_htm__.list_entry_head[1]="1";
        else if ('*' == liVal) __const_htm__.list_entry_head[1]="disc";
        else if ('+' == liVal) __const_htm__.list_entry_head[1]="square";
        else if ('-' == liVal) __const_htm__.list_entry_head[1]="circle";
        else __const_htm__.list_entry_head[1]="disc";
                   
        //
        dom.nowChild(0);
        var entry = 0;
        var needBr = false;
        var llist = dom;
        while(dom.hasNext())
        {
            var child = dom.nextChild();
            switch(child.getType())
            {
                case A9Dom.type.list:
                   if(entry == 1)
                   {
                       __render_htm__.push(__const_htm__.list_entry_foot);
                       entry = 0;
                   }
                   __list2htm__(child,llist,true);
                   llist = child;
                   needBr = false;
                   break;
                   
                case A9Dom.type.para_line:
                   if(entry == 0)
                   {
                       __render_htm__.push(__const_htm__.list_entry_head.join(''));
                       entry = 1;
                   }
                   if(needBr) __render_htm__.push(__const_htm__.list_line_token);
                   
                   needBr = true;
                   break;
                   
                default:
                   if(entry == 0)
                   {
                       __render_htm__.push(__const_htm__.list_entry_head.join(''));
                       entry = 1;
                   }
                   if(needBr) __render_htm__.push(__const_htm__.list_line_token);
                   child.nowChild(0);
                   while(child.hasNext())
                   {
                       __mode2htm__(child.nextChild());
                   }
                   needBr = true;
            }
        }
        
        if(entry == 1) __render_htm__.push(__const_htm__.list_entry_foot);
       
        // foot
        if(type == 1)
            __render_htm__.push(__const_htm__.list_item_foot);
        else if (type == 2)
            __render_htm__.push(__const_htm__.list_step_foot);

        
        if(thiz == null)
            __render_htm__.push(__const_htm__.list_foot);
    }
    
    function __para2htm__(dom)
    {
        __const_htm__.para_head[1] = dom.getTier();
        __render_htm__.push(__const_htm__.para_head.join(''));
        
        //
        dom.nowChild(0);
        while(dom.hasNext())
        {
            var c = dom.nextChild();
            __domManager__(c);
        }
        __render_htm__.push(__const_htm__.para_foot);
    }
    
    function __line2htm__(dom)
    {
        var size = dom.getInfo(A9Dom.type.para_line$size);
        if(size > 0)
        {
            __const_htm__.linex[1] = dom.getInfo(A9Dom.type.para_line$size);
            __const_htm__.linex[3] = dom.getTier();
            __const_htm__.linex[5] = dom.getInfo(A9Dom.type.para_line$lgth);
            
            __render_htm__.push(__const_htm__.linex.join(''));
        }
        else
        {
            __render_htm__.push(__const_htm__.line0);
        }
    }
    
    function __mode2htm__(dom)
    {
        switch(dom.getType())
        {
            case A9Dom.type.mode_text:
                 __render_htm__.push(A9Util.txt2htm(dom.getText()));
                 break;
            case A9Dom.type.mode_trig_head:
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_st))
                    __render_htm__.push(__const_htm__.mode_trig_st_head);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_em))
                    __render_htm__.push(__const_htm__.mode_trig_em_head);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_ul))
                    __render_htm__.push(__const_htm__.mode_trig_ul_head);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_de))
                    __render_htm__.push(__const_htm__.mode_trig_de_head);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sb))
                    __render_htm__.push(__const_htm__.mode_trig_sb_head);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sp))
                    __render_htm__.push(__const_htm__.mode_trig_sp_head);
                   
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_fg))
                 {
                    __const_htm__.mode_trig_fg_head[1] = dom.getInfo(A9Dom.type.mode_trig$flag_fg);
                    __render_htm__.push(__const_htm__.mode_trig_fg_head.join(''));
                 }
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_bg))
                 {
                    __const_htm__.mode_trig_bg_head[1] = dom.getInfo(A9Dom.type.mode_trig$flag_bg);
                    __render_htm__.push(__const_htm__.mode_trig_bg_head.join(''));
                 }
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sz))
                 {
                    __const_htm__.mode_trig_sz_head[1] = dom.getInfo(A9Dom.type.mode_trig$flag_sz);
                    __render_htm__.push(__const_htm__.mode_trig_sz_head.join(''));
                 }
                 break;
            case A9Dom.type.mode_trig_foot:
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sz))
                    __render_htm__.push(__const_htm__.mode_trig_sz_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_bg))
                    __render_htm__.push(__const_htm__.mode_trig_bg_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_fg))
                    __render_htm__.push(__const_htm__.mode_trig_fg_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sp))
                    __render_htm__.push(__const_htm__.mode_trig_sp_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_sb))
                    __render_htm__.push(__const_htm__.mode_trig_sb_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_de))
                    __render_htm__.push(__const_htm__.mode_trig_de_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_ul))
                    __render_htm__.push(__const_htm__.mode_trig_ul_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_em))
                    __render_htm__.push(__const_htm__.mode_trig_em_foot);
                 if(dom.getInfo(A9Dom.type.mode_trig$flag_st))
                    __render_htm__.push(__const_htm__.mode_trig_st_foot);
                 break;
            case A9Dom.type.mode_join: // TODO
                var joName = dom.getInfo(A9Dom.type.mode_join$name);
                var joAddr = dom.getInfo(A9Dom.type.mode_join$addr);
                
                if(joAddr == __const_var__.join_$index)
                {
                    __render_htm__.push(__genIndex__());
                }
                else if(joAddr.charAt(0)== '$')
                {
                    var key = joAddr.substr(1);
                    var dicts = __root__.getInfo(A9Dom.type.root$dict);
                    var dict = dicts[key];
                    
                    if(dict != null)
                    {
                        dict.nowChild(0);
                        if(dict.getInfo(A9Dom.type.dict$line) && dict.hasNext())
                        {
                            paraDom = dict.nextChild();
                            paraDom.nowChild(0);
                            while(paraDom.hasNext())
                            {
                                var c = paraDom.nextChild();
                                __domManager__(c);
                            }
                        }
                        
                        while(dict.hasNext())
                        {
                            var c = dict.nextChild();
                            __domManager__(c);
                        }
                    }
                }
                else
                {
                    var extnm = joAddr.substr(joAddr.lastIndexOf(".")).toLowerCase();
                    var jtype = dom.getInfo(A9Dom.type.mode_join$algn);
                    var bsize = "";
                    var sw = dom.getInfo(A9Dom.type.mode_join$width);
                    if( sw != null && sw != '') bsize+=" width='"+sw+"'"
                    var sh = dom.getInfo(A9Dom.type.mode_join$height);
                    if( sh != null && sh != '') bsize+=" height='"+sh+"'"
                    var jtext = "";

                    if(extnm.length >0 && __join_extn__['img'].indexOf(extnm)>=0) // img
                    {
                        __const_htm__.mode_join$img[1] = dom.getId();
                        __const_htm__.mode_join$img[3] = joAddr;
                        __const_htm__.mode_join$img[5] = joName;
                        __const_htm__.mode_join$img[7] = (jtype == A9Dom.type.mode_join$algn_illeft)? align="align='left'":"";
                        __const_htm__.mode_join$img[8] = bsize;
                        jtext = __const_htm__.mode_join$img.join('');
                    }
                    else if(extnm.length >0 && __join_extn__['swf'].indexOf(extnm)>=0) // swf
                    {
                        __const_htm__.mode_join$swf[1] = dom.getId();
                        __const_htm__.mode_join$swf[3] = bsize;
                        __const_htm__.mode_join$swf[5] = joAddr;
                        __const_htm__.mode_join$swf[7] = bsize;
                        __const_htm__.mode_join$swf[9] = joAddr;
                        jtext = __const_htm__.mode_join$swf.join('');
                    }
                    else // others as link
                    {
                        __const_htm__.mode_join_etc[1] = dom.getId();
                        __const_htm__.mode_join_etc[3] = joAddr;
                        __const_htm__.mode_join_etc[5] = A9Util.txt2htm(joName==''?joAddr:joName);
                        jtext = __const_htm__.mode_join_etc.join('');
                    }
                    
                    if(jtype == A9Dom.type.mode_join$algn_nlleft)
                    {
                        __const_htm__.mode_joinline[1] = "left";
                        __const_htm__.mode_joinline[3] = jtext;
                        jtext = __const_htm__.mode_joinline.join('');
                    }
                    else if (jtype == A9Dom.type.mode_join$algn_nlcenter)
                    {
                        __const_htm__.mode_joinline[1] = "center";
                        __const_htm__.mode_joinline[3] = jtext;
                        jtext = __const_htm__.mode_joinline.join('');
                    }
                    else if (jtype == A9Dom.type.mode_join$algn_nlright)
                    {
                        __const_htm__.mode_joinline[1] = "right";
                        __const_htm__.mode_joinline[3] = jtext;
                        jtext = __const_htm__.mode_joinline.join('');
                    }
                    
                    __render_htm__.push(jtext);
                }
                break;
            case A9Dom.type.mode_link:
                 var addr = dom.getInfo(A9Dom.type.mode_link$addr);
                 if( addr == null || addr == '') //anchor(hash)
                 {
                      __const_htm__.mode_anchor[1] = dom.getId();
                      __const_htm__.mode_anchor[3] = A9Util.txt2htm(dom.getInfo(A9Dom.type.mode_link$name));
                      __render_htm__.push(__const_htm__.mode_anchor.join(''));
                 }
                 else
                 {
                      if(addr.charAt(0)=='#') // link to anchor
                      {
                          var mpos = addr.indexOf(':');
                          if(mpos>=0)
                          {
                              var type = A9Util.trimBoth(addr.substr(1,mpos));
                              var hash = A9Util.trimBoth(addr.substr(mpos+1));
                              var hdom = null;
                              var haddr = "";
                              var hname = "";
                              if(/SECT/i.test(type)){
                                 haddr = "SECT_";
                                 var sectMap = __root__.getInfo(A9Dom.type.root$sect);
                                 hdom = sectMap[hash];
                                 if(hdom==null && hash.charAt(hash.length-1)!='.')
                                    hdom = sectMap[hash+'.'];
                                 if(hdom != null){
                                    hname = hash+" "+A9Util.txt2htm(hdom.getInfo(A9Dom.type.sect$title));
                                 }
                              }else if(/DICT/i.test(type)){
                                 haddr = "DICT_";
                                 hdom = __root__.getInfo(A9Dom.type.root$dict)[hash]; 
                                 hname = hash;                                 
                              }else if(/AREA/i.test(type)){
                                 haddr = "AREA_";
                                 hdom = __root__.getInfo(A9Dom.type.root$area)[hash];
                                 hname = hash                                
                              }else if(/HASH/i.test(type)){
                                 haddr = "HASH_";
                                 hdom = __root__.getInfo(A9Dom.type.root$hash)[hash];
                                 hname = hash;                              
                              }else if(/JOIN/i.test(type)){
                                 haddr = "JOIN_";
                                 hdom = __root__.getInfo(A9Dom.type.root$join)[hash];
                                 hname = hash;                              
                              }
                              
                              var lname = dom.getInfo(A9Dom.type.mode_link$name);
                              if(lname != null && lname != '') hname = lname;
                              if(hname == null || hname == '') hname = addr.substr(1);
                              
                              if(hdom == null){
                                 __const_htm__.mode_link[1] = addr;
                                 __const_htm__.mode_link[3] = A9Util.txt2htm(hname);
                                 __render_htm__.push(__const_htm__.mode_link.join(''));
                              }else{
                                 __const_htm__.mode_hash[1] = "window.scrollBy(0,document.getElementById(\""+haddr+hdom.getId()+"\").offsetTop-this.offsetTop)";
                                 __const_htm__.mode_hash[3] = A9Util.txt2htm(hname);
                                 __render_htm__.push(__const_htm__.mode_hash.join(''));
                              }
                          }
                          else
                          {
                              __const_htm__.mode_link[1] = addr;
                              __const_htm__.mode_link[3] = addr.substr(1);
                              __render_htm__.push(__const_htm__.mode_link.join(''));
                          }
                      }
                      else
                      {
                          addr = A9Util.getFile(addr,__root__.getInfo(A9Dom.type.root$path));
                          var isDone = false;
                          if(dom.getInfo(A9Dom.type.mode_link$join)){
                              var joAddr = A9Util.getFile(dom.getInfo(A9Dom.type.mode_link$name),__root__.getInfo(A9Dom.type.root$path));
                              var extnm = joAddr.substr(joAddr.lastIndexOf(".")).toLowerCase();
                              var jtype = dom.getInfo(A9Dom.type.mode_join$algn);
                              if(extnm.length >0 && __join_extn__['img'].indexOf(extnm)>=0) // img
                              {
                                  __const_htm__.mode_join$img[1] = dom.getId();
                                  __const_htm__.mode_join$img[3] = joAddr;
                                  __const_htm__.mode_join$img[5] = joAddr;
                                  __const_htm__.mode_join$img[7] = "";
                                  
                                  var jtext = __const_htm__.mode_join$img.join('');
                                  __const_htm__.mode_joinlink[1] = addr;
                                  __const_htm__.mode_joinlink[3] = jtext;
                                  
                                  
                                  jtext = __const_htm__.mode_joinlink.join('');
                                  if(jtype == A9Dom.type.mode_join$algn_nlleft)
                                  {
                                      __const_htm__.mode_joinline[1] = "left";
                                      __const_htm__.mode_joinline[3] = jtext;
                                      jtext = __const_htm__.mode_joinline.join('');
                                  }
                                  else if (jtype == A9Dom.type.mode_join$algn_nlcenter)
                                  {
                                      __const_htm__.mode_joinline[1] = "center";
                                      __const_htm__.mode_joinline[3] = jtext;
                                      jtext = __const_htm__.mode_joinline.join('');
                                  }
                                  else if (jtype == A9Dom.type.mode_join$algn_nlright)
                                  {
                                      __const_htm__.mode_joinline[1] = "right";
                                      __const_htm__.mode_joinline[3] = jtext;
                                      jtext = __const_htm__.mode_joinline.join('');
                                  }
                                  
                                  __render_htm__.push(jtext);
                                  
                                  isDone = true;
                              }
                          }
                          //
                          if(!isDone)
                          {
                              __const_htm__.mode_link[1] = addr;
                              __const_htm__.mode_link[3] = A9Util.txt2htm(dom.getInfo(A9Dom.type.mode_link$name));
                              
                              if(__const_htm__.mode_link[3] == null || __const_htm__.mode_link[3] == '')
                                 __const_htm__.mode_link[3] = addr;
                              
                              __render_htm__.push(__const_htm__.mode_link.join(''));
                          }
                      }
                 }
                 break;
            case A9Dom.type.mode_$htm:
                 __render_htm__.push(dom.getText());
                 break;
            default:
                 __render_htm__.push(A9Util.txt2htm(dom.getText()));
        }
    }
    
    function __text2htm__(dom)
    {
        __const_htm__.text[1] = dom.getTier();
        __const_htm__.text[3] = A9Util.txt2htm(dom.getText(),"<>");
        __render_htm__.push(__const_htm__.text.join(''));
    }
    
    function __area$text2htm__(dom)
    {
        //area_text
        var border = 0;
        var infoStr = "";
        var info = dom.getInfo(A9Dom.type.area$info);
        if(info != null && info != "")
        {
            border = 1;
            __const_htm__.area$info[1]= "&lt;<b>text</b>&gt; "+ A9Util.txt2htm(info,'<>');
            infoStr = __const_htm__.area$info.join('');
        }
        
        __const_htm__.area_text[1] = dom.getId();
        __const_htm__.area_text[3] = dom.getTier();
        __const_htm__.area_text[5] = infoStr;
        __const_htm__.area_text[7] = border;
        __const_htm__.area_text[9] = A9Util.txt2htm(dom.getText());
        __render_htm__.push(__const_htm__.area_text.join(''));
    }
    
    function __area2htm__(dom)
    {
        var type = dom.getInfo(A9Dom.type.area$type);
        if(type == 'text')
        {
            __area$text2htm__(dom)
            return;
        }
        
        // ext parser
        var extBall = A9Conf.getConf("render.html.area."+type+".ball");
        if(extBall != null && extBall != "")
        {
            try
            {
                var ferLen = Math.ceil(40*(dom.getId()-__root_domid__)/__total_doms__);
                try{
                    __progress_bar__.work(-ferLen);
                }catch(e){};
            
                var extClzz = extBall+"."+A9Conf.getConf("render.html.area."+type+".clzz");

                __render_htm__.push("##a9_future_data_holder## @ "+dom.getId());
                                
                A9Loader.asyncLoadClass(extBall);
                A9Loader.runAfterClassLoaded(function(){
                    eval("var extRender = new "+extClzz+"();");
                    extRender.render(dom,function(rdom){
                        try{
                            __progress_bar__.work(ferLen);
                        }catch(e){};
                    	var data = rdom.getData();
                    	if(typeof(data['linkjs'])!='undefined' && data['linkjs']!=null){
	                    	for(var x=0;x<data['linkjs'].length;x++)
	                    		__render_js__.push(data['linkjs'][x]);
                    	}
                    	if(typeof(data['linkcss'])!='undefined' && data['linkcss']!=null){
	                        for(var x=0;x<data['linkcss'].length;x++)
	                    		__render_css__.push(data['linkcss'][x]);
                    	}
                        for(var x=0;x<__render_htm__.length;x++){
                            if(__render_htm__[x]=="##a9_future_data_holder## @ "+rdom.getId()){
                                __render_htm__[x] = data['htmltext'];
                                break;
                            }
                        }
                    })
                });
                
                return;
            }
            catch(e)
            {
                //alert(e)
            };
        }
        
        var infoStr = "&lt;<b>"+A9Util.txt2htm(type,'<>')+"</b>&gt; ";
        var info = dom.getInfo(A9Dom.type.area$info);
        if(info!=null && info != "") infoStr += A9Util.txt2htm(info,'<>');
        __const_htm__.area$info[1] = infoStr;
        
        //
        __const_htm__.area[1] = dom.getId();
        __const_htm__.area[3] = dom.getTier();
        __const_htm__.area[5] = __const_htm__.area$info.join('');
        __const_htm__.area[7] = A9Util.txt2htm(dom.getText(),'<>');
        __render_htm__.push(__const_htm__.area.join(''));
    }
    
    // helper
    function __getListType__(dom)
    {
        var type = -1;
        
        if(dom != null && dom.getType() == A9Dom.type.list)
        {
            var flag = dom.getInfo(A9Dom.type.list$type);
            if (/[\*\+\-]/.test(flag)) // item
               type = 1;
            else // step
               type = 2;
        }
        return type;
    }
    
    function __genIndex__()
    {
        var buffer = [];
        var max = 0;
        var sects = __root__.getInfo(A9Dom.type.root$sect);
        for(var k in sects)
        {
            if(max < k.length) max = k.length;
            __const_htm__.index_item[1] = (sects[k].getInfo(A9Dom.type.sect$level)-1)*2;
            __const_htm__.index_item[3] = k;
            __const_htm__.index_item[5] = "SECT_"+sects[k].getId();
            __const_htm__.index_item[7] = sects[k].getInfo(A9Dom.type.sect$title);
            buffer.push(__const_htm__.index_item.join(''));
        }
        
        return buffer.join('');
    }
    
    function __uniqueArray__(arr){
        var rst = [];
        for(var m=0;m<arr.length;m++){
            var has = false;
            for(var n=0;n<rst.length;n++){
                if(rst[n] == arr[m]){
                    has = true;
                    break;
                }
            }
            if(!has){
                rst.push(arr[m]);
            }
        }
        return rst;
    }
}