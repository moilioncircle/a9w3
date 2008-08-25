//UTF8(BOM)  LGPL  trydofor.com  Mar. 2008
/* property name is lowercase, class name is uppercase*/
var ProgressBar = function(doc)
{
	if(doc == null) throw "para[doc] is null";
	if(!doc.body) document.write("<body></body>");
	ProgressBar.__counter__++;
	var __barId__  = ProgressBar.__counter__;
	var __divObj__ = null;
	var __infoObj__ = null;
	var __percObj__ = null;
	var __worked__ = 0;
	
	function __show__(x,y){
	    
	    if(x==null) x=5;
	    if(y==null) y=5;
	    
	    try{
    		if(__divObj__ == null){
    			var divHTML = ""+
    			//"<div id='id' style='position:absolute; left:100px; top:100px; width:210px; height:30px; z-index:1;'>"+
    			"  <table width='210' height='30' border='0' cellpadding='0' cellspacing='1' style='border:1px solid #000000;'>"+
    			"    <tr><td height='16'><div id='"+__barId__+"_info' style='font-size:12px; height:16px; width:100%; overflow:hidden;padding:2px;color:#3366CC'>loading...</div></td></tr>"+
    			"    <tr><td height='14' style='border:1px solid #000000;'><div id='"+__barId__+"_perc' style='font-size:12px;width:"+__worked__+"%;height:14px; background-color:#3366CC; color:#FFFFFF; text-align:center; overflow:hidden'>"+
    			"    "+__worked__+"%"+
    			"    </div></td></tr>"+
    			"  </table>";
    			//"</div>";
    			
    			__divObj__ = doc.createElement('DIV');
    		    __divObj__.setAttribute('id',__barId__);
    		    __divObj__.setAttribute('style','left:'+x+'px; top:'+y+'px; width:210px; height:30px;background-color:#FFFFFF;',0);
    		    //__divObj__.setAttribute('style','position:absolute; left:'+x+'px; top:'+y+'px; width:210px; height:30px; z-index:1;',0);
    		    __divObj__.innerHTML=divHTML;
    		    doc.body.insertBefore(__divObj__, doc.body.firstChild)
    		}else{
    			__divObj__.style.display='';
                __divObj__.style.left  = x+'px';
                __divObj__.style.top   = y+'px';
    		}
	    }catch(e){
	        // ignore
	        __divObj__ = null;
	    }
	}
	
	function __work__(w,info,inner){
		if(w == null) return;
		try{
    		__worked__ += w;
    		if(__worked__ >100) __worked__ =100;
    		if(__worked__ <0) __worked__ = 0;
    		
    		if(__divObj__  == null) __show__();
    		
    		if(__infoObj__ == null) __infoObj__ = doc.getElementById(__barId__+"_info");
    		if(__percObj__ == null) __percObj__ = doc.getElementById(__barId__+"_perc");
    		
    		if(info != null)__infoObj__.innerHTML = info;
    		__percObj__.style.width=__worked__+"%";
    		__percObj__.innerHTML=__worked__+"%";
		}catch(e){
		    __divObj__  = null;
		    __infoObj__ = null;
		    __percObj__ = null;
		}
	}
	
	function __done__(){
	    try{
    		__worked__ = 0;
    		__divObj__.style.display='none';
	    }catch(e){
            __divObj__  = null;
            __infoObj__ = null;
            __percObj__ = null;
	    }
	}
	
	this.done = __done__;
	this.work = __work__;
	this.show = __show__;
}
ProgressBar.__counter__ = 0;
