<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #CODE (UID,PID)
if(empty($_REQUEST['PID'])
||!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];

foreach(file(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm') as $line){
    if(strpos($line, 'ftype') !== false){
        $ftype = trim(substr($line,strpos($line,'=')+1));
        break;
    }
}
// delete files
if(!deleteFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/data/'.$r_pid.'.'.$ftype)
|| !deleteFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/mini/'.$r_pid.'.jpg')
|| !deleteFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm')){
    echo RKEY_UNKOWN;
    exit;
}
// remove index
require_once('common-indexer.php');
if(!removeIndexFromTotal(IDX_GALLERY,$r_uid,$r_pid)
|| !removeIndexFromMonth(IDX_GALLERY,$r_uid,$r_pid)
|| !removeIndexFromLabel(IDX_GALLERY,$r_uid,$r_pid)){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
?>