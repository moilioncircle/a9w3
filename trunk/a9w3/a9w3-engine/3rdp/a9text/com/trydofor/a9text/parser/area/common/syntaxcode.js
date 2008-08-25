/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
void parse(a9dom)
*/
var AreaSyntaxCodeParser$PairingSerial = 0; // for pairing

var AreaSyntaxCodeParser = function()
{
    A9Dom.type.area_syntax_code = {
        line_physical: "area_syntax_code.line_physical",
        pair_$serial: "area_syntax_code.pair_$serial",
        word_literal: "area_syntax_code.word_literal"
    };

    var __obj_mulquot__ = []; // mul-line quote, with escape char
    var __obj_onequot__ = []; // one-line quote, with escape char
    var __obj_keyword__ = []; // in-line
    var __obj_pairing__ = []; // in-line
    var __str_oprchar__ = []; // in-line
    
    var __reg_blank__ = /^ *$/;


    this.putMulQuote = function(type,head,foot,isin,escc)
    {
        if(typeof(type) != 'string') throw "MultiQuote's type should be string";
        if(isin == null) isin = true;
        var obj = {
            'type':type,
            'head':head,
            'foot':foot,
            'isin':isin,
            'escc':escc
        };
        
        __obj_mulquot__.push(obj);
    }
    
    this.putOneQuote = function(type,head,isin,escc)
    {
        if(typeof(type) != 'string') throw "OnelnQuote's type should be string";
        if(isin == null) isin = true;
        var obj = {
            'type':type,
            'head':head,
            'isin':isin,
            'escc':escc
        };
        
        __obj_onequot__.push(obj);
    }
    
    this.putKeyword = function(type,keys,ignoreCase)
    {
        if(typeof(type) != 'string') throw "Keyword's type should be string";
        if(!(keys instanceof Array || typeof(keys) == 'string' || keys instanceof RegExp))
            throw "Keyword's keys should be Array or String or RegExp";
        
        if(!(keys instanceof Array))
            keys = [keys];
        
        for(var i=0;i<keys.length;i++)
        {
            
            if(typeof(keys[i]) == 'string')
            {
                // skip
            }
            else if(keys[i] instanceof RegExp)
            {
                var isi = keys[i].ignoreCase;
                var src = keys[i].source;
                
                if(src.charAt(src.length-1) != '$') src = src + '$';
                if(src.charAt(0) != '^') src = '^'+src;
                
                if(isi)
                    keys[i] = new RegExp(src,'i');
                else
                    keys[i] = new RegExp(src);

            }
            else
            {
                throw "the item["+keys[i]+"] of Keyword's keys should be String or RegExp";
            }
        }
        
        var obj = {
            'type':type,
            'keys':keys,
            'case':ignoreCase
        };
        
        __obj_keyword__.push(obj);
    }
    
    this.putOprchar = function(str)
    {
        if(typeof(str) != 'string') throw "Oprchar should be string";
        if(str != '')
        {
            __str_oprchar__.push(str);
        }
    }
    
    this.putPairing = function(type,head,foot)
    {
        if(typeof(type) != 'string') throw "Pairing's type should be string";
        if(typeof(head) != 'string') throw "Pairing's head should be string";
        if(typeof(foot) != 'string') throw "Pairing's foot should be string";
        
        var obj = {
            'type':type,
            'head':head,
            'foot':foot,
            'seqh':0,
            'seqf':[]
        };
        
        __obj_pairing__.push(obj);
    }

    /**
     * parse lines
     * multi-line > one-line > in-line
     */
    this.parse = function(a9dom)
    {
        //
        var text = a9dom.getText();
        if(text == null || text == "") return;
        
        AreaSyntaxCodeParser$PairingSerial ++;
        
        var lines = text.split(a9dom.getInfo(A9Dom.type.area$crlf));
        
        var curMulquot = null;
        var curOnequot = null;
        
        for(var i=0; i<lines.length; i++)
        {
            var lineDom  = a9dom.newChild(A9Dom.type.area_syntax_code.line_physical);
            var line = lines[i];

            while(line != null && line != "")
            {
                // parser multi-comment if not end;
                if(curMulquot != null)
                {
                    var mqFoot = curMulquot['foot'];
                    var posMqf = -1;
                    
                    var offset = 0;
                    if(mqFoot instanceof RegExp)
                    {
                        var tmp = line.substr(offset);
                        while(tmp != '')
                        {
                            posMqf = tmp.search(mqFoot);
                            
                            // the head or escape
                            if(posMqf > 0 && curMulquot['escc'] != null && A9Util.isEscape(tmp,posMqf-1,curMulquot['escc']))
                            {
                                var relpos = posMqf+1;
                                tmp = tmp.substr(relpos);
                                offset += relpos;
                            }
                            else
                            {
                                break;
                            }
                        }
                        if(posMqf>=0) posMqf+=offset;
                    }
                    else
                    {
                        posMqf = line.indexOf(mqFoot,offset);
                        while(posMqf>=0)
                        {
                            // the head or escape
                            if(posMqf > 0 && curMulquot['escc'] != null && A9Util.isEscape(line,posMqf-1,curMulquot['escc']))
                            {
                                offset += (posMqf+1);
                                posMqf = line.indexOf(mqFoot,offset);
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    
                    //
                    if(posMqf < 0) // not end
                    {
                        var wordDom = lineDom.newChild(curMulquot['type']);
                        wordDom.setText(line);
                        break;
                    }
                    else // end in the line.
                    {
                        var lenFoot = 0;
                        if(mqFoot instanceof RegExp)
                            lenFoot = RegExp.$1.length;
                        else
                            lenFoot = mqFoot.length;
                        
                        var wordDom = lineDom.newChild(curMulquot['type']);
                        wordDom.setText(line.substring(0,curMulquot['isin']?(posMqf+lenFoot):posMqf));
                        
                        line = line.substr(posMqf+lenFoot);
                        curMulquot = null;
                        continue;
                    }
                }
                
                var posOqh = -1; // position of the onequote
                var lenOqh = 0;
                for(var m=0;m<__obj_onequot__.length;m++)
                {
                    var p = -1;
                    var len = 0;
                    var oqHead = __obj_onequot__[m]['head'];
                    
                    var offset = 0;
                    if(oqHead instanceof RegExp)
                    {
                        var tmp = line.substr(offset);
                        while(tmp != '')
                        {
                            p = tmp.search(oqHead);
                            // escape
                            if(p > 0 && __obj_onequot__[m]['escc'] != null && A9Util.isEscape(tmp,p-1,__obj_onequot__[m]['escc']))
                            {
                                var relpos = p+1;
                                tmp = tmp.substr(relpos);
                                offset += relpos;
                            }
                            else
                            {
                                break;
                            }
                        }
                        
                        if(p>=0)
                        {
                            p+=offset;
                            len = RegExp.$1.length;
                        }

                    }
                    else
                    {
                        p = line.indexOf(oqHead,offset);
                        while(p>=0)
                        {
                            // escape
                            if(p > 0 && __obj_onequot__[m]['escc'] != null && A9Util.isEscape(line,p-1,__obj_onequot__[m]['escc']))
                            {
                                offset += (p+1);
                                p = line.indexOf(oqHead,offset);
                            }
                            else
                            {
                                break;
                            }
                        }
                        len = oqHead.length;
                    }
                    
                    if(p>=0 && (posOqh<0 || p<posOqh))
                    {
                        posOqh = p;
                        lenOqh = len;
                        curOnequot = __obj_onequot__[m];
                    }
                }
                
                var posMqh = -1; // postition of the mulquote
                var lenMqh = 0;
                for(var m=0;m<__obj_mulquot__.length;m++)
                {
                    var p = -1;
                    var len = 0;
                    var mqHead = __obj_mulquot__[m]['head'];
                    
                    var offset = 0;
                    if(mqHead instanceof RegExp)
                    {
                        var tmp = line.substr(offset);
                        while(tmp != '')
                        {
                            p = tmp.search(mqHead);
                            // escape
                            if(p > 0 && __obj_mulquot__[m]['escc'] != null && A9Util.isEscape(tmp,p-1,__obj_mulquot__[m]['escc']))
                            {
                                var relpos = p+1;
                                tmp = tmp.substr(relpos);
                                offset += relpos;
                            }
                            else
                            {
                                break;
                            }
                        }
                        if(p>=0)
                        {
                            p+=offset;
                            len = RegExp.$1.length;
                        }

                    }
                    else
                    {
                        p = line.indexOf(mqHead,offset);
                        while(p>=0)
                        {
                            // escape
                            if(p > 0 && __obj_mulquot__[m]['escc'] != null && A9Util.isEscape(line,p-1,__obj_mulquot__[m]['escc']))
                            {
                                offset += (p+1);
                                p = line.indexOf(mqHead,offset);
                            }
                            else
                            {
                                break;
                            }
                        }
                        len = mqHead.length;
                    }
                        
                    if(p>=0 && (posMqh<0 || p<posMqh))
                    {
                        posMqh = p;
                        lenMqh = len;
                        curMulquot = __obj_mulquot__[m];
                    }
                }

                // mulquote before onequote or only mulquote
                if(posMqh >=0 && (posOqh < 0 || posOqh > posMqh)) 
                {
                    if(posMqh>0)
                    {
                        __parseNonquot__(line.substring(0,posMqh),lineDom);
                    }
                    
                    if(curMulquot['isin'])
                    {
                        var wordDom = lineDom.newChild(curMulquot['type']);
                        wordDom.setText(line.substr(posMqh,lenMqh));
                    }
                    
                    line = line.substr(posMqh+lenMqh);
                    continue;
                }
                else
                {
                    curMulquot = null;
                }
                
                // nonquote
                if(posOqh != 0)
                {
                    __parseNonquot__((posOqh<0?line:line.substring(0,posOqh)),lineDom);
                }
                
                // onequote
                if(posOqh >= 0)
                {
                    var wordDom = lineDom.newChild(curOnequot['type']);
                    if(curOnequot['isin'])
                        wordDom.setText(posOqh>0?line.substr(posOqh):line);
                    else
                        wordDom.setText(line.substr(posOqh+lenOqh));
                }
                
                break;
            }
        }
    }
    
    function __parseNonquot__(line,lineDom)
    {
        if(line == null || line == '') return;
        
        if(__obj_pairing__.length == 0 && __obj_keyword__.length == 0)
        {
            var wordDom = lineDom.newChild(A9Dom.type.area_syntax_code.word_literal);
            wordDom.setText(line);
            return;
        }
        
        // split by blank
        var blkParts = [];
        {
            var inBlank = false;
            var lastPos = 0;
            for(var i = 0; i<line.length; i++)
            {
                var c = line.charAt(i);
                if(c == ' ' || c == '\t')
                {
                    if(!inBlank && i>lastPos)
                    {
                        blkParts.push(line.substring(lastPos,i));
                        lastPos = i;
                    }
                    inBlank = true;
                }
                else
                {
                    if(inBlank && i>lastPos) // end blank
                    {
                        blkParts.push(line.substring(lastPos,i));
                        lastPos = i;
                        inBlank = false;
                    }
                    
                    for(var k=0;k<__str_oprchar__.length;k++)
                    {
                        if(__str_oprchar__[k].indexOf(c)>=0)
                        {
                            if(i>lastPos) blkParts.push(line.substring(lastPos,i));
                            
                            blkParts.push(c);
                            lastPos = i+1;
                            inBlank = false;
                            break;
                        }
                    }
                }
            }
            
            if(lastPos < line.length)
            {
                blkParts.push(line.substr(lastPos)); // last part
            }
        }
        
        // check pairing
        var objParts = [];
        for(var i = 0 ; i< blkParts.length; i++)
        {
            var part = blkParts[i];
            
            if(__reg_blank__.test(part))
            {
                objParts.push(part);
                continue;
            }
            
            //
            while(part != null)
            {
                var pos = -1;
                var ih = true;
                var curPair = null;
                for(var m=0;m<__obj_pairing__.length;m++)
                {
                    var pair = __obj_pairing__[m];

                    var ph = part.indexOf(pair['head']);
                    var pf = part.indexOf(pair['foot']);
                    
                    if(ph>=0 && (pos <0 || ph<pos))
                    {
                        pos = ph;
                        ih  = true;
                        curPair = pair;
                    }
                    if(pf>=0 && (pos <0 || pf<pos))
                    {
                        pos = pf;
                        ih  = false;
                        curPair = pair;
                    }
                    
                    if(pos == 0) break;
                }
                
                if(pos <0)
                {
                    objParts.push(part);
                    part = null;
                }
                else
                {
                    if(pos > 0)
                    {
                        objParts.push(part.substr(0,pos));
                    }
                    
                    if(ih)
                    {
                        curPair['seqh'] = curPair['seqh']+1;
                        curPair['seqf'].push(curPair['seqh']);
                        objParts.push({'type':curPair['type'],'text':part.substr(pos,curPair['head'].length),'seq':'H'+curPair['seqh']+'$'+AreaSyntaxCodeParser$PairingSerial+"_"});
                        part = part.substr(pos+curPair['head'].length);
                    }
                    else
                    {
                        objParts.push({'type':curPair['type'],'text':part.substr(pos,curPair['foot'].length),'seq':'F'+curPair['seqf'].pop()+'$'+AreaSyntaxCodeParser$PairingSerial+"_"});
                        part = part.substr(pos+curPair['foot'].length);
                    }
                    
                    if(part == '') part = null;
                }
            }
        }
        
        // obj 2 dom
        var strbuff = "";
        for(var i = 0 ; i< objParts.length; i++)
        {
            var keyt = null;
            if(typeof(objParts[i]) == 'string' && !__reg_blank__.test(objParts[i]))
            {
                for(var m=0;m<__obj_keyword__.length;m++)
                {
                    var keys = __obj_keyword__[m]['keys'];
                    for(var n=0; n<keys.length;n++)
                    {
                        if(typeof(keys[n]) == 'string')
                        {
                            var got = false;
                            
                            if(__obj_keyword__[m]['case'])
                            {
                                got = (keys[n].toLowerCase() == objParts[i].toLowerCase());
                            }
                            else
                            {
                                got = (keys[n] == objParts[i]);
                            }
                            
                            if(got)
                            {
                                keyt = __obj_keyword__[m]['type'];
                                break;
                            }
                        }
                        
                        if(keys[n] instanceof RegExp && keys[n].test(objParts[i]))
                        {
                            keyt = __obj_keyword__[m]['type'];
                            break;
                        }
                    }
                }
            }
            
            if(keyt != null || typeof(objParts[i]) != 'string')
            {
                if(strbuff.length > 0)
                {
                    var wordDom = lineDom.newChild(A9Dom.type.area_syntax_code.word_literal);
                    wordDom.setText(strbuff);
                    strbuff = "";
                }
                
                if(keyt != null)
                {
                    var wordDom = lineDom.newChild(keyt);
                    wordDom.setText(objParts[i]);
                }
                else
                {
                    var wordDom = lineDom.newChild(objParts[i]['type']);
                    wordDom.setText(objParts[i]['text']);
                    wordDom.putInfo(A9Dom.type.area_syntax_code.pair_$serial,objParts[i]['seq']);
                }
            }
            else
            {
                strbuff += objParts[i];
            }
        }
        //
        if(strbuff.length > 0)
        {
            var wordDom = lineDom.newChild(A9Dom.type.area_syntax_code.word_literal);
            wordDom.setText(strbuff);
            strbuff = "";
        }
    }
}