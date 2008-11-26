<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

//
$treeDir = array(
PATH_ROOT.'index.htm',
PATH_ROOT.'a9w3-engine',
PATH_ROOT.'a9w3-server',
PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID']
);

foreach($treeDir as $v){
	echo fingerprintTree($v);
}

// trace stat
require_once('writer-tracer.php');

/* functions */
function fingerprintTree($fn){
    if(!file_exists($fn)) return '';
    $result = '';
    if (is_dir($fn)){
        if ($dh = opendir($fn)){
            while (($sf = readdir($dh)) !== false){
                if ($sf != '.' && $sf != '..'){
                    $result.=fingerprintTree($fn.'/'.$sf);
                }
            }
            closedir($dh);
        }
    }else if(is_file($fn)){
        $result.=str_replace(PATH_ROOT, '',$fn).'|'.
            filesize($fn).'|'.
            date('YmdHis',filemtime($fn)).'|'.
            md5_file($fn)."\n";
    }

    return $result;
}
?>