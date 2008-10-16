<?php
require_once('common.php');
checkRequestUID();
//checkUmodePermit(UMODE_WRITER);

// check by js at client #PID|CODE (UID,[PID],TITLE,ADDRS,BRIEF,[LABEL])
if(empty($_REQUEST['TITLE'])
|| empty($_REQUEST['ADDRS'])
|| empty($_REQUEST['BRIEF'])){
    echo RKEY_ACCDENY;
    exit;
}

$newFields = array(
    'title'=>trim($_REQUEST['TITLE']),
    'label'=>preg_split('/[\s,]+/',trim($_REQUEST['LABEL'])),
    'addrs'=>trim($_REQUEST['ADDRS']),
    'brief'=>text2line(trim($_REQUEST['BRIEF']))
);

if(empty($_REQUEST['PID'])){ // new
    $pid = date('YmdHis');
    $dst = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/address/'.$pid.'.htm';
    $newFields['mtime'] = date('Y-m-d H:i:s');
    $newFields['ctime'] = $newFields['mtime'];
    
    // add index
    require_once('common-indexer.php');
    if(!appendIndexToTotal(IDX_ADDRESS,$_REQUEST['UID'],$pid,$_REQUEST['LABEL'])
    || !appendIndexToMonth(IDX_ADDRESS,$_REQUEST['UID'],$pid,$_REQUEST['LABEL'])
    || !appendIndexToLabel(IDX_ADDRESS,$_REQUEST['UID'],$pid,$_REQUEST['LABEL'],$newFields['label'])){
        echo RKEY_UNKOWN;
        exit;
    }
}else{ // exists
    $pid = $_REQUEST['PID'];
    $dst = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/address/'.$pid.'.htm';
    if(!is_file($dst)){
        echo RKEY_ACCDENY;
        exit;
    }
    // check field changement
    $oldFields = array();
    foreach(file($dst) as $line){
        $pos = strpos($line,'=');
        if($pos !==false){
            $oldFields[substr($line,0,$pos)] = trim(substr($line,$pos+1));
        }
    }
    $changed = false;
    $chkval = array('title','addrs','brief');
    foreach($chkval as $k){
        if(!array_key_exists($k,$oldFields)
        || $oldFields[$k] !== $newFields[$k]){
            $changed = true;
        }
    }
    $k = 'label';
    if(!array_key_exists($k,$oldFields)){
        $changed = true;
    }else{
        require_once('common-indexer.php');
        $fval = preg_split('/[\s,]+/',$oldFields[$k]);
        foreach($newFields[$k] as $v){ // append
            if(array_search($v,$fval) === false){
                if(appendIndexToLabel(IDX_ADDRESS,$_REQUEST['UID'],$pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
        foreach($fval as $v){ // remove
            if(array_search($v,$newFields[$k]) === false){
                if(removeIndexFromLabel(IDX_ADDRESS,$_REQUEST['UID'],$pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
    }
    if($changed){
        $newFields['mtime'] = date('Y-m-d H:i:s');
        $newFields['ctime'] = array_key_exists('ctime',$oldFields)?$oldFields['ctime']:$newFields['mtime'];
    }else{
        echo RKEY_SUCCESS;
        exit;
    }
}

// write links
$txt  = '
title='.$newFields['title'].'
label='.implode(' ',$newFields['label']).'
ctime='.$newFields['ctime'].'
mtime='.$newFields['mtime'].'
addrs='.$newFields['addrs'].'
brief='.$newFields['brief'];

if(!writeFile($dst,trim($txt),'w')){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;
?>