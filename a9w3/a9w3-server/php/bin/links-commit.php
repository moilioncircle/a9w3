<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #PID|CODE (UID,[PID],TITLE,ADDRS,BRIEF,[LABEL])
if(empty($_REQUEST['TITLE'])
|| empty($_REQUEST['ADDRS'])
|| empty($_REQUEST['BRIEF'])){
    echo RKEY_ACCDENY;
    exit;
}

if(empty($_REQUEST['PID'])){ // new
    $id = date('YmdHis');
    $fn = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/address/'.$id.'.htm';
    $ct = date('Y-m-d H:i:s');
}else{
    $id = $_REQUEST['PID'];
    $fn = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/address/'.$id.'.htm';
    if(!is_file($fn)){
        echo RKEY_ACCDENY;
        exit;
    }
    foreach(file($fn) as $line){
        if(strpos($line,'ctime')!==false){
            $ct = trim(substr($line,strpos($line,'=')+1));
            break;
        }
    }
}

// write links
$txt  = '
title='.$_REQUEST['TITLE'].'
label='.$_REQUEST['LABEL'].'
ctime='.$ct.'
mtime='.date('Y-m-d H:i:s').'
addrs='.$_REQUEST['ADDRS'].'
brief='.$_REQUEST['BRIEF'];

if(!writeFile($fn,trim($txt),'w')){
    echo RKEY_UNKOWN;
    exit;
}

// build index
require_once('common-indexer.php');
appendIndex(IDX_ADDRESS,);
if(!appendIndex(IDX_ADDRESS,$id,$_REQUEST['LABEL'])){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;
?>