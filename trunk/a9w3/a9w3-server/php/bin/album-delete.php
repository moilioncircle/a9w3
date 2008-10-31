<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #CODE (UID,PID)
if(empty($_REQUEST['PID'])
||!preg_match('/^[0-9]{4}\/[0-9]{13}+$/', $_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}

foreach(file(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/info/'.$_REQUEST['PID'].'.htm') as $line){
    if(strpos($line, 'ftype') !== false){
        $ftype = trim(substr($line,strpos($line,'=')+1));
        break;
    }
}
// delete files
if(!deleteFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/data/'.$_REQUEST['PID'].'.'.$ftype)
|| !deleteFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/mini/'.$_REQUEST['PID'].'.jpg')
|| !deleteFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/info/'.$_REQUEST['PID'].'.htm')){
    echo RKEY_UNKOWN;
    exit;
}
// remove index
require_once('common-indexer.php');
if(!removeIndexFromTotal(IDX_GALLERY,$_REQUEST['UID'],$_REQUEST['PID'])
|| !removeIndexFromMonth(IDX_GALLERY,$_REQUEST['UID'],$_REQUEST['PID'])
|| !removeIndexFromLabel(IDX_GALLERY,$_REQUEST['UID'],$_REQUEST['PID'])){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;
?>