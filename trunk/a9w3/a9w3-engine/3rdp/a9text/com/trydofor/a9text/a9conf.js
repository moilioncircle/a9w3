//UTF8(BOM)  LGPL  trydofor.com  Dec.2007
/* property name is lowercase, class name is uppercase*/
var A9Conf = new CnfReaderClass();

A9Conf.loadFormFile(A9Loader.getCorePath()+"com/trydofor/a9text/a9conf.txt");

A9Conf.__EnvPath__ = {
    '$PAGE_PATH/':   A9Loader.getPagePath(),
    '$CORE_PATH/':   A9Loader.getCorePath(),
    '${PAGE_PATH}/': A9Loader.getPagePath(),
    '${CORE_PATH}/': A9Loader.getCorePath()
};

//
A9Conf.valueEnv = function(str)
{
    if(str == null || str == "") return str;
    
    for(var key in A9Conf.__EnvPath__)
    {
        if(str.indexOf(key)>=0)
        {
            str = str.replace(key,A9Conf.__EnvPath__[key]);
        }
    }
    
    return str;
}

A9Conf.getConf = function(key)
{
    var str = A9Conf.getValue(key);
    return A9Conf.valueEnv(str);
}