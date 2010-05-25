/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/

var A9TextParser = function()
{
    var __regexp__ = 
    {
        root$foot  : /^[ 　\t]*\^{3,}/,
        info       : /^[ 　\t]*\\*-[ 　\t]*/,
        sect       : /^[ 　\t]*\\*([0-9]+\.)+[ 　\t]+/,
        sect$foot  : /^[ 　\t]*\^{3,}/,
        list$item  : /^[ 　\t]*\\*([\*\+\-])[ 　\t]*\)?[ 　\t]+/,
        list$auto  : /^[ 　\t]*\\*(#)[ 　\t]*[\.\)][ 　\t]+/,
        list$digt  : /^[ 　\t]*\\*([0-9]+)[ 　\t]*[\.\)][ 　\t]+/,
        list$lchr  : /^[ 　\t]*\\*([a-z]+)[ 　\t]*[\.\)][ 　\t]+/,
        list$uchr  : /^[ 　\t]*\\*([A-Z]+)[ 　\t]*[\.\)][ 　\t]+/,
        dict       : /^[ 　\t]*\[?([^:\]]+)[ 　\t]*\]?\\*(:{2,})/,
        area$head  : /^[ 　\t]*\\*={9,}[ 　\t]*(\*?\w+)[ 　\t]*(.*[^=])?={9,}$/,
        area$args  : /^[ 　\t]*\\*args:[ 　\t]*(.*)/,
        area$foot  : /^[ 　\t]*\\*={9,}$/,
        area$etxt  : /^[ 　\t]*\\*\.{9,}$/,
        para$line3 : /^[ 　\t]*\\*#{9,}$/,
        para$line2 : /^[ 　\t]*\\*={9,}$/,
        para$line1 : /^[ 　\t]*\\*-{9,}$/,
        para$line0 : /^\\*[ 　\t]*$/,
        mode_trig  : /\[(!|\/|_|\-|'|,|(#[0-9a-fA-F]{6})|(&[0-9a-fA-F]{6})|(%[0-9]+))+\[/,
        mode_link  : /\[\[.*=>/,
        mode_join  : /\[((\d+%?)?\*(\d+%?)?)?\[.*<=/,
        mode_$htm  : /\[\*htm\[/
    };
    ////
    var __crlf__  = "\r\n";
    var __lines__ = [];
    var __index__ = 0;
    var __super__ = null; // top a9dom
    var __basic__ = null; // parent a9dom
    var __sect_flag__ = []; // hold sects info
    var __args_sect__ = {};
    var __args_dict__ = {};
    var __args_area__ = {};
    var __args_hash__ = {};
    var __args_join__ = {};
    var __join_ext__  = A9Conf.getConf("parser.join.text.name");
    
    var __simple_link__ = [];
    for(var i=1;;i++){

        var addr = A9Conf.getConf("parser.link.simple-"+i+".addr");
        var regexp = A9Conf.getConf("parser.link.simple-"+i+".regexp");
        if(addr == null || regexp == null) break;
        __simple_link__.push({'addr':addr,'regexp':new RegExp(regexp,"i")});
    }
    
    var __progress_bar__ = null;
    var __total_lines__ = 0;
     
    // public
    this.setProgressBar = function(pgb){
        if(pgb != null)__progress_bar__ = pgb;
    }
    
    this.parse = function(a9dom,func)
    {
        var text = a9dom.getText();
        if(text == null || text == "") return;
        
        // clear
        __super__ = a9dom;
        __basic__ = a9dom;
        __index__ = 0;
        __crlf__ = A9Util.getCRLF(text);
        __lines__ = text.split(__crlf__);
        __sect_flag__ = [];
        __args_sect__ = {};
        __args_dict__ = {};
        __args_area__ = {};
        __args_hash__ = {};
        __args_join__ = {};
        __total_lines__ = __lines__.length;
        
        // a9text root and info
        __parseRoot__();
        
        // elements of root
        var lastLine = 0;
        for(;__hasLine__(); __index__ ++)
        {
            //
            if(__progress_bar__ != null){
                try{
                    __progress_bar__.work(Math.ceil(40*(__index__-lastLine)/__total_lines__));
                }catch(e){};
            }
            lastLine = __index__;
            //
            if(__meetSect__())
                 __parseSect__();
            else if (__meetList__())
                 __parseList__();
            else if (__meetDict__())
                 __parseDict__();
            else if (__meetArea__())
                 __parseArea__();
            else if (__meetArea$etxt__())
                 __parseArea$etxt__();                 
            else 
                 __parsePara__();
            

        }
        
        //
        a9dom.putInfo(A9Dom.type.root$dict,__args_dict__);
        a9dom.putInfo(A9Dom.type.root$sect,__args_sect__);
        a9dom.putInfo(A9Dom.type.root$area,__args_area__);
        a9dom.putInfo(A9Dom.type.root$hash,__args_hash__);
        a9dom.putInfo(A9Dom.type.root$join,__args_join__);
             
        
        if(func instanceof Function){
            A9Loader.runAfterClassLoaded(function(){func(a9dom)});
        }
    }
    
    /* private member */
    
    // check and escape
   
    function __meetSect__()
    {
        return __regexp__.sect.test(__lines__[__index__]);
    }
    
    function __meetList__()
    {
        if(__regexp__.para$line1.test(__lines__[__index__])) return false;
        
        //
        return __regexp__.list$item.test(__lines__[__index__]) ||
                __regexp__.list$auto.test(__lines__[__index__]) ||
                __regexp__.list$digt.test(__lines__[__index__]) ||
                __regexp__.list$lchr.test(__lines__[__index__]) ||
                __regexp__.list$uchr.test(__lines__[__index__]) ;
    }
    
    function __meetDict__()
    {
        return __regexp__.dict.test(__lines__[__index__]);
    }
    
    function __meetArea__()
    {
        return __regexp__.area$head.test(__lines__[__index__]);
    }
    
    function __meetArea$etxt__()
    {
        return __regexp__.area$etxt.test(__lines__[__index__]);
    }
    
    // parsers
    function __parseRoot__()
    {
        if(__index__ != 0) return; // must the first line.
        if(!__regexp__.root$foot.test(__lines__[1]))return;

        // parse root
        __super__.putInfo(A9Dom.type.root$name,__lines__[0]);
        
        __index__ = 2;
        var hasInfo = false;
        while(__hasLine__() && __regexp__.info.test(__lines__[__index__]))
        {
            var stpos = __lines__[__index__].indexOf('-');
            if(__lines__[__index__].charAt(stpos-1) == '\\') // escape
            {
                __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],stpos-1);
                break;
            }
            
            if(!hasInfo)
            {
                __basic__ = __super__.newChild(A9Dom.type.info);
                hasInfo = true;
            }
            __lines__[__index__] = A9Util.trimLeft(__lines__[__index__].substr(stpos+1));
            __parsePara__();
            __index__ ++;
        }
        
        __basic__ = __super__;
    }
    
    function __parseSect__() //escape
    {
        //sect       : /^[ 　\t]*\\*([0-9]+\.)+/,
        var para = __lines__[__index__];
        var dpos = __lines__[__index__].search(/[0-9]/);
        if(__lines__[__index__].charAt(dpos-1) == '\\') // escape 
        {
            __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],dpos-1);
            __parsePara__();
            return;
        }
        
        // check the sect foot token
        if(!__regexp__.sect$foot.test(__lines__[__index__+1])) // must be list(digit)
        {
            if(__meetList__()) __parseList__();
            return;
        }
        
        //
        __index__ ++;
        var title  = para.replace(__regexp__.sect,'');
        var infos  = para.substring(0,para.length - title.length).split('.'); //1.2. => ['1','2','']
        var flagPos = infos.length-2; // '2'
        var flagVal = infos[flagPos] * 1;
        
        __basic__ = __super__.newChild(A9Dom.type.sect);
        __basic__.setText(para);
        __basic__.putInfo(A9Dom.type.sect$title,title);
        __basic__.putInfo(A9Dom.type.sect$level,0);
        __basic__.putInfo(A9Dom.type.sect$flag,'');
        
        // set sect's no.
        if(flagVal > 0)
        {
            // init sect no.
            for(var i=0;i<flagPos;i++)// the last itme is '';
                if(__sect_flag__[i] == null)
                   __sect_flag__[i] = 1;
        
            // set or increase the last no.
            if(__sect_flag__[flagPos] == null)
               __sect_flag__[flagPos] = 1;
            else
               __sect_flag__[flagPos] = __sect_flag__[flagPos] + 1;
        
            // clear dirty sect no.
            for(var i = flagPos+1; i<__sect_flag__.length;i++)
               __sect_flag__[i] = null;
               
            var flag  = '';
            var level = 1;
            for(var i =0;i<__sect_flag__.length;i++)
            {
                if(__sect_flag__[i] != null)
                {
                    flag +=__sect_flag__[i]+".";
                    level++;
                }
            }
            
            __basic__.putInfo(A9Dom.type.sect$level,level);
            __basic__.putInfo(A9Dom.type.sect$flag,flag);
            __args_sect__[flag]=__basic__;
        }
    }
    
    function __parseList__(pTier) //escape
    {
        var para = __lines__[__index__];
        var token = RegExp.$1;
        
        var pos = para.indexOf(token);
        if(para.charAt(pos-1) == '\\') // escape list
        {
            __lines__[__index__] = A9Util.trimEscape(para,pos-1);
            __parsePara__();
            return;
        }
        
        var tier = A9Util.calTier(para); // get list tier
        
        
        var headBlank = "";
        for(var i = tier + token.length; i>=0; i--) headBlank += " ";
        
        // organise line
        var cut = pos+token.length;
        for(var i = cut; i<para.length;i++)
            if(".) 　\t".indexOf(para.charAt(i)) < 0)
            {
                cut = i;
                break;
            }
        
        __lines__[__index__] = headBlank+A9Util.trimLeft(para.substr(cut));
        
        if(pTier == tier) __basic__ = __basic__.getParent(); 
        
        __basic__ =  __basic__.newChild(A9Dom.type.list);
        __basic__.putInfo(A9Dom.type.list$type,token);
        __basic__.setTier(tier);
        __basic__.setText(para);
        
        __parsePara__();
        
        while(__hasLine__())
        {
            __index__ ++;
            var cTier = A9Util.calTier(__lines__[__index__]);
            
            if( cTier < tier)
            {
                __index__ --;
                break;
            }
            else // children
            {
                // child list to parse
                if (__meetList__())
                {
                    var cpos = __lines__[__index__].indexOf(RegExp.$1);
                    if(__lines__[__index__].charAt(cpos-1) == '\\') // escape list
                    {
                        if(cTier == tier)
                        {
                            __index__ --;
                            break;
                        }
                        else
                        {
                            __lines__[__index__] = headBlank+A9Util.trimLeft(A9Util.trimEscape(__lines__[__index__],cpos-1));
                            __parsePara__();
                        }
                    }
                    else
                    {
                        __parseList__(tier);
                        break;
                    }
                }
                else // lines to merger
                {
                    if(cTier == tier)
                    {
                        __index__ --;
                        break;
                    }
                    else
                    {
                        __lines__[__index__] = headBlank+A9Util.trimLeft(__lines__[__index__]);
                        __parsePara__();
                    }
                }
            }
        }
        //
        if(pTier != tier) __basic__ = __basic__.getParent();        
    }
    
    function __parseDict__() //escape
    {
        var para = __lines__[__index__];
        var token = RegExp.$2;
        var pos = para.indexOf(token);
        var key = RegExp.$1;
        if(para.charAt(pos-1) =='\\')
        {
            __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],pos-1);
            __parsePara__();
            return;
        }
        
        var keyPart = para.substring(0,pos);
        var lt = keyPart.indexOf('[');
        var rt = keyPart.indexOf(']');
        if((lt>=0 && rt <0) || (lt<0 && rt >=0)) // 
        {
            __parsePara__();
            return;
        }
                
        //
        var tier = A9Util.calTier(para);
        var dom =  __basic__.newChild(A9Dom.type.dict);
        dom.setTier(tier);

        // token
        if(token.length > 2) key = key +" "+token.substr(2);
        dom.putInfo(A9Dom.type.dict$key,key);

        // inline
        if(pos+token.length == para.length)
        {
           __index__++;
           dom.putInfo(A9Dom.type.dict$line,false); // other line
        }
        else
        {
            __lines__[__index__] = A9Util.trimLeft(para.substr(pos+token.length));
            dom.putInfo(A9Dom.type.dict$line,true);
        }
        
        // hint
        if(keyPart.indexOf(']') > 0)
        {
            dom.putInfo(A9Dom.type.dict$hint,true);
        }
        else
        {
            dom.putInfo(A9Dom.type.dict$hint,false);
            __args_dict__[key]=dom;
        }
        
        // children para
        __basic__ = dom;
        __parsePara__();
        
        while(__hasLine__())
        {
            __index__ ++;
            var cTier = A9Util.calTier(__lines__[__index__]);
            if(cTier <= tier)
            {
                __index__ --;
                break;
            }
            __parsePara__();
        }
        __basic__ = dom.getParent();
    }

    function __parsePara__() // escape case
    {
        var dom = null;
        var para = __lines__[__index__];
        var tier = A9Util.calTier(para);
        //
        
        if(__regexp__.para$line0.test(para) ||
           __regexp__.para$line1.test(para) ||
           __regexp__.para$line2.test(para) ||
           __regexp__.para$line3.test(para))
        {
            var slash = para.lastIndexOf('\\');
            if(slash < 0)
            {
                var size = 0;
                if(para.indexOf('-')>=0)      size = 1;
                else if(para.indexOf('=')>=0) size = 2;
                else if(para.indexOf('#')>=0) size = 4;
                
                dom = __basic__.newChild(A9Dom.type.para_line);
                dom.setTier(tier);
                dom.setText(para);
                dom.putInfo(A9Dom.type.para_line$size,size);
                dom.putInfo(A9Dom.type.para_line$lgth,para.length-tier);
            } 
            else
            {
                para = A9Util.trimEscape(para,slash);
                tier = A9Util.calTier(para);
                
                dom = __basic__.newChild(A9Dom.type.para_text);
                dom.setTier(tier);
                dom.setText(para);
               __parseMode__(dom,A9Util.trimBoth(para));
            }
        }
        else
        {
            // parse modes
            var spara = __softLine__();
            dom = __basic__.newChild(A9Dom.type.para_text);
            dom.setTier(tier);
            dom.setText(spara);
            __parseMode__(dom,A9Util.trimBoth(spara));
        }
    }
    
    function __parseMode__(dom,para) // escape case
    {
        if(para == "") return;
        
        var doneStr = "";
        var todoStr = para;
        var trigHeads = [];
        
        while(todoStr != null && todoStr != "")
        {
            var modeType = 1;
            var modePos1 = todoStr.search(__regexp__.mode_$htm);
            var modePos2 = todoStr.search(__regexp__.mode_link);
            var modePos3 = todoStr.search(__regexp__.mode_join);
            var modePos4 = todoStr.search(__regexp__.mode_trig);
            
            var modePos = modePos1;
            if(modePos2 >=0 && ( modePos2 < modePos || modePos < 0))
            {
                modePos = modePos2;
                modeType = 2;
            }
            if(modePos3 >=0 && ( modePos3 < modePos || modePos < 0))
            {
                modePos = modePos3;
                modeType = 3;
            }
            if(modePos4 >=0 && ( modePos4 < modePos || modePos < 0))
            {
                modePos = modePos4; 
                modeType = 4;
            }
            
            // check unclosed trig
            while(trigHeads.length > 0)
            {
                 var ep = todoStr.indexOf("]]");
                 //
                 if(ep < 0 ||(ep > modePos && modePos >=0)) break;
                
                 if(A9Util.isEscape(todoStr,ep-1))
                 {
                     doneStr += A9Util.trimEscape(todoStr.substring(0,ep+2),ep-1);
                     todoStr = todoStr.substr(ep+2);
                     modePos = modePos-ep-2;
                     continue;
                 }
                                
                 if(ep>0 || doneStr.length >0)
                 {
                     var modeDom = dom.newChild(A9Dom.type.mode_text);
                     modeDom.setText(doneStr+todoStr.substring(0,ep));
                 }

                 var modeDom = dom.newChild(A9Dom.type.mode_trig_foot);
                 //document.writeln("<br><font color=red>head_length:"+trigHeads.length+"</font>");
                 var trigHead = trigHeads.pop();
                 //[trigHeads.length-1];
                 //delete trigHeads[trigHeads.length-1];
                 //document.writeln("<br><font color=red>foot_length:"+trigHeads.length+"</font>");
                 
                 var nInfo = trigHead.getInfo();
                 for(var key in nInfo)
                     modeDom.putInfo(key,nInfo[key]);
                 trigHead.putInfo(A9Dom.type.mode_trig$pair,modeDom.getId());
                 modeDom.putInfo(A9Dom.type.mode_trig$pair,trigHead.getId());
                                  
                 doneStr = "";
                 todoStr = todoStr.substr(ep+2);
                 modePos = modePos-ep-2;
            }
            
            
            // no mode, the text mode
            if(modePos < 0)
            {
                var str = doneStr+todoStr;
                if(str.length > 0)
                {
                    while(true){
                        var sk = -1;
                        for(var i=0;i< __simple_link__.length;i++){
                            if(__simple_link__[i]['regexp'].test(str)){
                                sk = i;
                                break;
                            }
                        }
                        if(sk < 0){
                            var modeDom = dom.newChild(A9Dom.type.mode_text);
                            modeDom.setText(str);
                            break;
                        }else{
                            var slStr = RegExp.$1;
                            var pos = str.indexOf(slStr);
                            var modeDom = dom.newChild(A9Dom.type.mode_text);
                            modeDom.setText(str.substr(0,pos));
                            
                            //
                            var modeDom = dom.newChild(A9Dom.type.mode_link);
                            modeDom.setText(slStr);
                            modeDom.putInfo(A9Dom.type.mode_link$join,false);
                            modeDom.putInfo(A9Dom.type.mode_link$name,slStr);
                            modeDom.putInfo(A9Dom.type.mode_link$addr,slStr.replace(__simple_link__[sk]['regexp'],__simple_link__[sk]['addr']));
                            
                            str = str.substr(pos+slStr.length);
                        }
                    }
                }
                break;
            }
            
            // escape mode, shift it
            if(A9Util.isEscape(todoStr,modePos-1))
            {
                doneStr += A9Util.trimEscape(todoStr.substring(0,modePos),modePos-1) + todoStr.substring(modePos,modePos+2);
                todoStr = todoStr.substr(modePos+2);
                //document.writeln("<font color=red>doneStr:"+doneStr+"||todoStr:"+todoStr+"</font>");
                continue; // escape
            }
            
            // take inside mode to front;
            if(modePos >0)
            {
                var modeDom = dom.newChild(A9Dom.type.mode_text);
                modeDom.setText(doneStr + todoStr.substring(0,modePos));
                doneStr = "";
                todoStr = todoStr.substr(modePos);
                modePos = 0;
            }
            
            // mode shoot
            if(modeType == 4) // tirg
            {
                var endp = todoStr.indexOf("[",modePos+1);
                var trig = todoStr.substring(1,endp);
                todoStr = todoStr.substr(endp+1);

                var modeDom = dom.newChild(A9Dom.type.mode_trig_head);
                
                var bToken = ["!","/","_","-",",","'"];
                var bKey = [A9Dom.type.mode_trig$flag_st, 
                            A9Dom.type.mode_trig$flag_em,
                            A9Dom.type.mode_trig$flag_ul,
                            A9Dom.type.mode_trig$flag_de,
                            A9Dom.type.mode_trig$flag_sb,
                            A9Dom.type.mode_trig$flag_sp
                            ];
                for(var i = 0; i < bToken.length; i++)
                {
                    if(trig.indexOf(bToken[i])>=0)
                    modeDom.putInfo(bKey[i],true);
                }
               
                var nToken = ["#","&","%"];
                var nKey = [A9Dom.type.mode_trig$flag_fg,
                            A9Dom.type.mode_trig$flag_bg,
                            A9Dom.type.mode_trig$flag_sz
                            ];
                var nValid = "0123456789abcdefABCDEF";
                for(var i = 0; i < nToken.length; i++)
                {
                    var s = trig.indexOf(nToken[i]);
                    if(s >= 0)
                    {
                        var e = s+1;
                        while(e<trig.length && nValid.indexOf(trig.charAt(e))>=0) e++;
                        modeDom.putInfo(nKey[i],trig.substring(s+1,e));
                    }
                }
                
                trigHeads[trigHeads.length] = modeDom;
                continue;
            }
            else
            {
                // search the end;
                var modeEnd = 0;
                var toescape = [];
                while(true)
                {
                   modeEnd = todoStr.indexOf("]]",modeEnd+2);
                   var isEscape = A9Util.isEscape(todoStr,modeEnd-1);
                   
                   //document.writeln("<br><font color=red>"+isEscape+":"+modePos+"-"+modeEnd+"::"+todoStr+"</font>");
                   if(isEscape)
                       toescape[toescape.length] = modeEnd-1;
                   else
                       break;
                }
                
                // make mode text and todo text;
                var modeTxt;
                if(modeEnd < 0)
                {
                    modeTxt = todoStr;
                    todoStr = null;
                }
                else
                {
                    modeTxt = todoStr.substring(0,modeEnd);
                    todoStr = modeEnd+2 < todoStr.length ?todoStr.substr(modeEnd+2):null;
                }
                
                // escape ']]'
                for(var i=toescape.length -1;i>=0;i--)
                    modeTxt = A9Util.trimEscape(modeTxt,toescape[i]);
                
                var modeHead = modeTxt.substr(1,modeTxt.indexOf('[',1)-1);
                var modeBody = modeTxt.substr(modeTxt.indexOf('[',1)+1);
                
                //document.writeln("<br><font color=red>modeTxt:"+modeTxt+" || "+todoStr+"</font>");
                
                //
                if(modeType == 1) //*htm
                {
                    var modeDom = dom.newChild(A9Dom.type.mode_$htm);
                    modeDom.setText(modeBody);
                }
                else if(modeType == 3) //join
                {
                    var jp = modeBody.indexOf("<=");
                    var joName = jp<=0?"":A9Util.trimBoth(modeBody.substr(0,jp));
                    var joAddr = A9Util.trimBoth(modeBody.substr(jp+2));
                    
                    if(A9Util.hasVariable(joAddr)) // join a variable
                    {
                        // no need to render path;
                    }
                    else // join file
                    {
                        joAddr = A9Util.getFile(joAddr,__super__.getInfo(A9Dom.type.root$path));
                        var extnm = joAddr.substr(joAddr.lastIndexOf(".")).toLowerCase();
                        
                        if(__join_ext__.indexOf(extnm) >= 0) // join a9text to parse
                        {
                            var lt = A9Loader.syncLoadText(joAddr);
                            if(lt != null && lt != "") // merge into basic a9text
                            {
                                var crlf = A9Util.getCRLF(lt);
                                var lines = lt.split(crlf);
                                if(lines.length == 1)
                                {
                                    if(todoStr == null || todoStr == "")
                                        todoStr = lines[0];
                                    else
                                        todoStr = lines[0]+todoStr;
                                }
                                else
                                {
                                    var nlinex = [];
                                    for(var i=0;i<__index__;i++)    // step 1
                                        nlinex.push(__lines__[i]);
                                    
                                    nlinex.push(doneStr);           // step 2
                                    
                                    for(var i=0;i<lines.length;i++) // step 3
                                        nlinex.push(lines[i]);
                                        
                                    if(todoStr != null && todoStr != "") // step 4
                                        nlinex.push(todoStr);
                                    
                                    for(var i=__index__+1;i<__lines__.length;i++) // step 5
                                        nlinex.push(__lines__[i]);
                                    
                                    __lines__ = nlinex; // step 6
                                    todoStr = null;
                                }
                            }
                            continue; // merged and continue to parse
                        }
                    }
                    //
                    var modeDom = dom.newChild(A9Dom.type.mode_join);
                    modeDom.setText(modeBody);
                    modeDom.putInfo(A9Dom.type.mode_join$name,joName);
                    modeDom.putInfo(A9Dom.type.mode_join$addr,joAddr);
                    if(modeHead != null && modeHead != ''){
                        var pstar = modeHead.indexOf('*');
                        if(pstar >=0){
                            modeDom.putInfo(A9Dom.type.mode_join$width,modeHead.substr(0,pstar));
                            modeDom.putInfo(A9Dom.type.mode_join$height,modeHead.substr(pstar+1));
                        }
                    }
                    __setJoinAlign__(dom,modeDom,todoStr);

                    if(joName != '') __args_join__[joName]=modeDom;
                }
                else // link __args_hash__
                {
                    var lp = modeBody.indexOf("=>");
                    var jo = (modeBody.indexOf("<=")==0);
                    var lkName = A9Util.trimBoth(modeBody.substring(jo?2:0,lp));
                    var lkAddr = A9Util.trimBoth(modeBody.substr(lp+2));
                    
                    var modeDom = dom.newChild(A9Dom.type.mode_link);
                    modeDom.setText(modeBody);
                    modeDom.putInfo(A9Dom.type.mode_link$join,jo);
                    modeDom.putInfo(A9Dom.type.mode_link$name,lkName);
                    modeDom.putInfo(A9Dom.type.mode_link$addr,A9Util.getFile(lkAddr,__super__.getInfo(A9Dom.type.root$path)));
                    
                    if(jo)__setJoinAlign__(dom,modeDom,todoStr);
                    
                    if(lkAddr == '')__args_hash__[lkName]=modeDom;
                }
            }
        }
    }
    
    function __parseArea__() //escape case
    {
        var eqpos = __lines__[__index__].indexOf('=');
        if(__lines__[__index__].charAt(eqpos-1) =='\\') // escape
        {
            __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],eqpos-1);
            __parsePara__();
            return;
        }
        
        //
        var tier = A9Util.calTier(__lines__[__index__]);
        var type = RegExp.$1;
        if(type != null) type = type.toLowerCase();
        
        var info = A9Util.trimBoth(RegExp.$2);
        var name = '';
        if(info != null)
        {
            var ni =  info.indexOf(':');
            if(ni>=0){
                name = A9Util.trimRight(info.substr(0,ni));
                info =  A9Util.trimLeft(info.substr(ni+1));
            }
        }
        
        // args
        var args = {};
        __index__ ++;
        if(__regexp__.area$args.test(__lines__[__index__])) 
        {
            var pos = __lines__[__index__].indexOf('args:');
            if(__lines__[__index__].charAt(pos-1) == '\\') //escape
            {
                __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],pos -1);
            }
            else
            {
                // soft lines
                var para = RegExp.$1;
                while(__hasLine__() && A9Util.isEscapeLine(para))
                {
                    // pure soft line
                    __index__ ++;
                    if(para.charAt(para.length -1)== '\\') // escape
                        para = A9Util.trimEscape(para,para.length -1) + A9Util.trimLeft(__lines__[__index__]);
                    else // space
                        para = para.substring(0,para.length -1) + A9Util.trimLeft(__lines__[__index__]);
                }
                
                var keyvals = para.split(/[ 　\t]*;[ 　\t]*/);
                for(var i = 0; i< keyvals.length; i++)
                {
                    if(keyvals[i] == "")continue;
                    
                    var kv = keyvals[i].split(/[ 　\t]*=[ 　\t]*/);
                    
                    if(kv.length ==2) args[kv[0]] = kv[1];
                    else args[kv[0]] = true;
                }
                __index__ ++;
            }
        }
        
        // text
        var dom = __basic__.newChild(A9Dom.type.area);
        dom.setTier(tier);
        dom.putInfo(A9Dom.type.area$type,type);
        dom.putInfo(A9Dom.type.area$name,name);
        dom.putInfo(A9Dom.type.area$info,info);
        dom.putInfo(A9Dom.type.area$args,args);
        dom.putInfo(A9Dom.type.area$crlf,__crlf__);
        
        if(name != '') __args_area__[name] = dom;
        //
        var buffer = [];
        for(;__hasLine__(); __index__ ++)
        {
            if(__regexp__.area$foot.test(__lines__[__index__]))
            {
                var slpos = __lines__[__index__].indexOf('\\');
                if(slpos< 0)
                {
                     dom.setText(buffer.join(__crlf__));
                     break;
                }
                else // escape
                {
                     buffer[buffer.length] = A9Util.shiftBlank(A9Util.trimEscape(__lines__[__index__],slpos),tier);
                }
            }
            else
            {
                buffer[buffer.length] = A9Util.shiftBlank(__lines__[__index__],tier);
            }
        }
        
        // ext parser
        var extBall = A9Conf.getConf("parser.area."+type+".ball");
        if(extBall != null && extBall != "")
        {
            try
            {
                var extClzz = extBall+"."+A9Conf.getConf("parser.area."+type+".clzz");
                var ferLen = Math.ceil(40*(buffer.length)/__total_lines__);
                try{
                    __progress_bar__.work(-ferLen);
                }catch(e){};
            
                A9Loader.asyncLoadClass(extBall);
                A9Loader.runAfterClassLoaded(function(){
                    try{
                        __progress_bar__.work(ferLen);
                    }catch(e){};
                    try{
                        eval("var extParser = new "+extClzz+"();");
                        extParser.parse(dom)
                    }catch(e){
                        dom.putInfo(A9Dom.type.area$type,'text');
                    }
                });
            }
            catch(e)
            {
                //alert(e);
            }
        }
    }
    
    function __parseArea$etxt__() //escape case
    {
        var eqpos = __lines__[__index__].indexOf('.');
        if(__lines__[__index__].charAt(eqpos-1) =='\\') // escape
        {
            __lines__[__index__] = A9Util.trimEscape(__lines__[__index__],eqpos-1);
            __parsePara__();
            return;
        }
        
        var dom = __basic__.newChild(A9Dom.type.area);
        dom.putInfo(A9Dom.type.area$type,'text');
        
        var buffer = [];
        __index__ ++;
        for(;__hasLine__(); __index__ ++)
        {
        
            if(__regexp__.area$etxt.test(__lines__[__index__]))
            {
                var slpos = __lines__[__index__].indexOf('\\');
                if(slpos< 0)
                {
                     dom.setText(buffer.join(__crlf__));
                     break;
                }
                else // escape
                {
                     buffer[buffer.length] = A9Util.trimEscape(__lines__[__index__],slpos);
                }
            }
            else
            {
                buffer[buffer.length] = __lines__[__index__];
            }
        }
    }
    
    /* helper */
    
    function __hasLine__()
    {
        return __index__ < __lines__.length;
    }
    
    function __softLine__()
    {
        var todoStr = __lines__[__index__];
        var doneStr = "";
        var modecnt = 0;
        
        // merge soft lines
        while(__hasLine__())
        {
            // pure soft line
            if (A9Util.isEscapeLine(todoStr))
            {
                __index__ ++;
                if(todoStr.charAt(todoStr.length -1)== '\\') // escape
                    todoStr = A9Util.trimEscape(todoStr,todoStr.length -1) + A9Util.trimLeft(__lines__[__index__]);
                else // space
                    todoStr = todoStr.substring(0,todoStr.length -1) + A9Util.trimLeft(__lines__[__index__]);
                
                continue;
            }
            
            // count mode head
            var modePos = 0;
            var modeDone = "";
            var modeTodo = todoStr;
            var firstPos = -1;
            while( modePos >= 0 )
            {
                modePos = modeTodo.search(__regexp__.mode_trig);
                if( modePos < 0 ) modePos = modeTodo.search(__regexp__.mode_join);
                if( modePos < 0 ) modePos = modeTodo.search(__regexp__.mode_link);
                if( modePos < 0 ) modePos = modeTodo.search(__regexp__.mode_$htm);
                
                if( modePos < 0 ) break;
                
                if(! A9Util.isEscape(modeTodo,modePos-1)) // escape
                {
                    if(firstPos <0 && modecnt ==0) firstPos = modeDone.length+modePos;
                    modecnt ++;
                }
                //
                var lastHead = modeTodo.indexOf('[',modePos+1);
                modeDone += modeTodo.substring(0,lastHead+1);
                modeTodo =  modeTodo.substr(lastHead+1);
            }
            
            if(modecnt <= 0) break; // no mode
            
            //
            modePos = 0;
            doneStr += modeDone;
            todoStr  = modeTodo;
            
            modeTodo = modeDone+modeTodo;
            if(firstPos>=0) modeTodo = modeTodo.substr(firstPos);
            
            while( modePos >= 0 )
            {
                modePos = modeTodo.indexOf("]]",modePos);
                if(modePos <0) break;
                
                if(!A9Util.isEscape(modeTodo,modePos-1)) // escape
                    modecnt --;
                //
                modePos += 2;
            }
            
            if(modecnt <= 0) break; // matches all
                        
            __index__++;
            todoStr = todoStr+ A9Util.trimLeft(__lines__[__index__]);
        }
        
        return doneStr + todoStr;
    }
        
    function __setJoinAlign__(dom,modeDom,todoStr)
    {
        var pb = modeDom.getPrevBrother();
        
        if( pb != null) // inline
        {
            modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_ilinside);
        }
        else if (pb == null && (todoStr != null && todoStr != '')) // inline
        {
            modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_illeft);
        }
        else // new line
        {
            var pt = dom.getTier();
            var ppb = dom.getPrevBrother();
            if(ppb == null) // first child of para
            {
                if( pt== 0)
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlleft);
                else if(pt>10)
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlright);
                else
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlcenter);
            }
            else
            {
                var ppt = ppb.getTier();
                if(pt<=ppt)
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlleft);
                else if((pt-ppt)>10)
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlright);
                else
                    modeDom.putInfo(A9Dom.type.mode_join$algn,A9Dom.type.mode_join$algn_nlcenter);
            }
        }
    }
}