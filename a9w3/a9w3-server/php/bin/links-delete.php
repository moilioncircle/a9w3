<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #CODE (UID,PID)
if(empty($_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}

// delete file
if(!deleteFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/address/'.$_REQUEST['PID'].'.htm';)){
    echo RKEY_UNKOWN;
    exit;
}

// remove index
if(!removeIndexFromTotal(IDX_ADDRESS,$_REQUEST['UID'],$_REQUEST['PID'])
|| !removeIndexFromMonth(IDX_ADDRESS,$_REQUEST['UID'],$_REQUEST['PID'])
|| !removeIndexFromLabel(IDX_ADDRESS,$_REQUEST['UID'],$_REQUEST['PID'])){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;
?>