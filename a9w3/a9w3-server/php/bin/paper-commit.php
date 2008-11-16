<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// #PID|CODE (UID,[PID],TITLE,[BRIEF],[LABEL],[XTEXT])
if(empty($_REQUEST['TITLE'])
|| empty($_REQUEST['ADDRS'])
|| empty($_REQUEST['BRIEF'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_title = $_REQUEST['TITLE'];
$r_label = $_REQUEST['LABEL'];
$r_addrs = $_REQUEST['ADDRS'];
$r_brief = $_REQUEST['BRIEF'];

$newFields = array(
    'title'=>trim($r_title),
    'label'=>preg_split('/[\s,]+/',trim($r_label)),
    'addrs'=>trim($r_addrs),
    'brief'=>text2line(trim($r_brief))
);
$isNew = false;
if(empty($r_pid)){ // new
    $isNew = true;
    $r_pid = date('YmdHis');
    $dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'.htm';
    $newFields['mtime'] = date('Y-m-d H:i:s');
    $newFields['ctime'] = $newFields['mtime'];
    
    // add index
    require_once('common-indexer.php');
    if(!appendIndexToTotal(IDX_ADDRESS,$r_uid,$r_pid)
    || !appendIndexToMonth(IDX_ADDRESS,$r_uid,$r_pid)
    || !appendIndexToLabel(IDX_ADDRESS,$r_uid,$r_pid,$newFields['label'])){
        echo RKEY_UNKOWN;
        exit;
    }
}else{ // exists
    $isNew = false;
    $dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'.htm';
    if(!preg_match('/^[0-9]{14}$/', $r_pid)
    || !is_file($dst)){
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
                if(appendIndexToLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
        foreach($fval as $v){ // remove
            if(array_search($v,$newFields[$k]) === false){
                if(removeIndexFromLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
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
        $newFields['ctime'] = $oldFields['ctime'];
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
if($isNew){ //new
    echo $r_pid;
}else{
    echo RKEY_SUCCESS;
}

// trace stat
require_once('writer-tracer.php');
?>