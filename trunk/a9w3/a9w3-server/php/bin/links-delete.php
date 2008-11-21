<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #CODE (UID,PID)
if(empty($_REQUEST['PID'])
|| !preg_match('/^[0-9]{14}$/', $_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];

// delete file
if(!deleteFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'.htm')){
    echo RKEY_UNKOWN;
    exit;
}

// remove index
require_once('common-indexer.php');
if(!removeIndexFromTotal(IDX_ADDRESS,$r_uid,$r_pid)
|| !removeIndexFromMonth(IDX_ADDRESS,$r_uid,$r_pid)
|| !removeIndexFromLabel(IDX_ADDRESS,$r_uid,$r_pid)){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
?>