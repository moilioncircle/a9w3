/**
UTF8(BOM)  LGPL  trydofor.com  May.2007
===========================================================
MiniTaskClass(timeout,timeStep)
轻量级的轮询任务管理里,参数为默认超时时间和轮询间隔(毫秒)

void putBoolTask(func [,context,tmfunc,timeout])
    轮询执行func(context),直到返回true或timeout结束.
    
    func:    boolean方法,true表示成功,false表示继续轮询.
    context: func的执行上下文.
    tmfunc:  发生超时执行的boolean方法,ture表重新计时,false表结束.
    timeout: timeout 毫秒

void putFlowTask(funcArray [,context,tmfunc,timeout])
    funcArray是一组返回boolean值的方法,轮询执行func(context),
    直到每个方法都返回true或timeout结束(不重复执行已完成的func)
    
    funcArray: boolean方法的数组.
    context: func的执行上下文.
    tmfunc:  发生超时执行的boolean方法,ture表重新计时,false表结束.
    timeout: timeout 毫秒
*/

var MiniTaskClass = function(timeout,timeStep)
{
    var __boolTask__ = [];
    var __flowTask__ = [];
    var __inTiming__ = false;
    var __dTimeout__ = 10*1000;
    var __timeStep__ = 1*1000;
    
    if(timeout != null && typeof timeout != 'number' && timeout <= 0) 
        throw 'param timeou must be integer(>0)';
    if(timeStep != null && typeof timeStep != 'number' && timeStep <= 0) 
        throw 'param timeStep must be integer(>0)';
    
    if(typeof timeout == 'number' && timeout > 0) __dTimeout__ = timeout;
    if(typeof timeStep == 'number' && timeStep > 0) __timeStep__ = timeStep;
    
    function __startTimer__()
    {
        if(__inTiming__) return;
        window.setTimeout(__wakeupHandler__,__timeStep__);
        __inTiming__ = true;
    }
    
    function __wakeupHandler__()
    {
        var now = (new Date()).getTime();
        
        // exec bool-task
        var isDirty = false;
        for(var i=0;i<__boolTask__.length;i++)
        {
            var entry = __boolTask__[i];
            var delit = false;
            
            try{
                delit = entry.func(entry.context);
            }catch(e){
                delit = true;
            }
            
            if(!delit && (now-entry.regtime) > entry.timeout)
            {
                delit = true;
                if(entry.tmfunc != null)
                {
                    try
                    {
                        var r = entry.tmfunc(entry.context);
                        if(r) delit = false;
                    }catch(e){
                    }
                }
                
                if(!delit) entry.regtime = now;
            }
            
            if(delit)
            {
                __boolTask__[i] = null;
                isDirty = true;
                continue;
            }
        }
        // clean bool-task
        if(isDirty)
        {
            var _tmp_ = [];
            for(var i=0;i<__boolTask__.length;i++)
                if(__boolTask__[i] != null)
                    _tmp_.push(_whenexe_[i]);
            
            __boolTask__ = _tmp_;
        }
        
        //=========
        // exec flow-task
        var isDirty = false;
        for(var i=0;i<__flowTask__.length;i++)
        {
            var entry = __flowTask__[i];
            var delit = false;
            try{
                for(var j=entry.curstep;j<entry.funcArray.length;j++)
                {
                    var r = entry.funcArray[j](entry.context);
                    if(!r) break;
                    
                    entry.curstep ++;
                    if(entry.curstep == entry.funcArray.length) delit = true;
                }
            }catch(e){
                delit = true;
            }
            
            if(!delit && (now-entry.regtime) > entry.timeout) // timeout
            {
                delit = true;
                if(entry.tmfunc != null)
                {
                    try
                    {
                        var r = entry.tmfunc(entry.context);
                        if(r) delit = false;
                    }catch(e){
                        delit = true;
                    }
                }
                
                if(!delit) entry.regtime = now;
            }
            
            if(delit)
            {
                __flowTask__[i] = null;
                isDirty = true;
                continue;
            }
        }
        // clean flow-task
        if(isDirty)
        {
            var _tmp_ = [];
            for(var i=0;i<__flowTask__.length;i++)
                if(__flowTask__[i] != null)
                    _tmp_.push(_whenexe_[i]);
            
            __flowTask__ = _tmp_;
        }
        
        
        // timer
        if(__boolTask__.length == 0 && __flowTask__.length == 0)
            __inTiming__ = false;
        else
            window.setTimeout(__wakeupHandler__,__timeStep__);
    }

    function __putBoolTask__(func,context,tmfunc,timeout)
    {
        if(typeof func != "function") throw "func is not function,when registBoolFunc.";
        if(tmfunc != null && typeof tmfunc != "function") throw "tmfunc is not function";
        if(timeout !=null && typeof timeout != "number" && timeout < 0)
        throw "timeout is not positive number";
        
        if(timeout == null) timeout = __dTimeout__;

        var funcstr = ""+func;
        var fpos = funcstr.indexOf("function");
        var rpos = funcstr.indexOf("(");
        var pos1 = fpos>=0?fpos+8:0;
        var pos2 = rpos>=fpos?rpos:pos1+20;

        var entry = {};
        entry.name    = funcstr.substring(pos1,pos2);
        entry.func    = func;
        entry.context = context;
        entry.tmfunc  = tmfunc;
        entry.timeout = timeout;
        entry.regtime = (new Date()).getTime();
        
        __boolTask__.push(entry);
        __startTimer__();
    }
    
    function __putFlowTask__(funcArray,context,tmfunc,timeout)
    {
        for(var i=0;i<funcArray.length;i++)
        if(typeof funcArray[i] != "function") throw "funcArray contains non-function,when registWorkFlow.";
        
        if(tmfunc != null && typeof tmfunc != "function") throw "tmfunc is not function";
        if(timeout !=null && typeof timeout != "number" && timeout < 0)
        throw "timeout is not positive number";

        if(timeout == null) timeout = __dTimeout__;

        var funname = "";
        for(var i=0;i<funcArray.length;i++)
        {
            var funcstr = ""+funcArray[i];
            var fpos = funcstr.indexOf("function");
            var rpos = funcstr.indexOf("(");
            var pos1 = fpos>=0?fpos+8:0;
            var pos2 = rpos>=fpos?rpos:pos1+20;
            
            funname += funcstr.substring(pos1,pos2)+"|";
        }

        var entry = {};
        entry.name      = funname;
        entry.funcArray = funcArray;
        entry.context   = context;
        entry.tmfunc    = tmfunc;
        entry.timeout   = timeout;
        entry.regtime   = (new Date()).getTime();
        entry.curstep   = 0;

        __flowTask__.push(entry);
        __startTimer__();
    }
    
    /////// public members /////////
    this.putBoolTask = __putBoolTask__;
    this.putFlowTask = __putFlowTask__;
    
    this.toString = function()
    {
        var str = "MiniTaskClass:";
        str += "\nboolTask size:"+__boolTask__.length;
        str += "\nflowTask size:"+__flowTask__.length;
        str += "\nin timing:"+__inTiming__;
        str += "\ntimeout:"+__dTimeout__;
        str += "\ntimeStep:"+__timeStep__;
        return str;
    };
}
