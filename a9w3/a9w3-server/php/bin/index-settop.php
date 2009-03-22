<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_type = $_REQUEST['type'];

// delete file
if($r_type === 'paper'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)){echo RKEY_UNKOWN;exit;}
    $topfile=PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/article/total/top.htm';
}else if ($r_type === 'album'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)){echo RKEY_UNKOWN;exit;}
    $topfile=PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/gallery/total/top.htm';
}else if ($r_type === 'links'){
    if(!preg_match('/^[0-9]{14}$/', $r_pid)){echo RKEY_UNKOWN;exit;}
    $topfile=PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/address/total/top.htm';
}else{
    echo RKEY_UNKOWN;
    exit;
}
$items = array();
$istop = false;
if(is_file($topfile)){
    foreach(file($topfile) as $line){
        $tl = trim($line);
        if($tl === $r_pid){
            $istop = true;
            continue;
        }
        if(strlen($tl) > 0){
            array_push($items,$tl);
        }
    }
}
if(!$istop){
    array_push($items,$r_pid);
}

// write
if(!writeFile($topfile,implode("\n",$items),'w')){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
?>