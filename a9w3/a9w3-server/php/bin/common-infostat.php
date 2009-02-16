<?php
require_once('common.php');

define('INF_ADMIN',  'admin');
define('INF_ADDRESS','address');
define('INF_ARTICLE','article');
define('INF_GALLERY','gallery');
define('INF_BOARD',  'board');
define('INF_NOTICE', 'notice');

function updateInfoStat($uid,$key,$cnt){
	
	if(empty($uid)) return;
	if($key != INF_ADMIN
	&& $key != INF_ADDRESS
	&& $key != INF_ARTICLE
	&& $key != INF_GALLERY
	&& $key != INF_BOARD
	&& $key != INF_NOTICE
	) return;
	
	/* status info */
	
    $infofile = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/info/stat.htm';
    if(is_file($infofile)){
    	$infokv = readKeyValues($infofile);
    	$infokv[$key.'.mtime'] = getUserDate('Y-m-d H:i:s',$uid);
    	$infokv[$key.'.count'] = intval($infokv[$key.'.count'])+$cnt;

	    // write file
	    $lines='';
	    foreach($infokv as $k => $v){
	        $lines.=$k.'='.$v."\n";
	    }
	    writeFile($infofile,trim($lines),'w');
    }
}
?>