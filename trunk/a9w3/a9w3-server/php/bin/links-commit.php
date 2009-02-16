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

// alias
$r_uid  = getNoMagicRequest('UID');
$r_pid  = getNoMagicRequest('PID');
$r_title = getNoMagicRequest('TITLE');
$r_label = getNoMagicRequest('LABEL');
$r_addrs = getNoMagicRequest('ADDRS');
$r_brief = getNoMagicRequest('BRIEF');

$newFields = array(
    'title'=>trim($r_title),
    'label'=>preg_split('/[\s,]+/',trim($r_label)),
    'addrs'=>trim($r_addrs),
    'brief'=>text2line(trim($r_brief))
);
$isNew = false;
if(empty($r_pid)){ // new
    $isNew = true;
    $r_pid = getUserDate('YmdHis',$r_uid);
    $dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'.htm';
    
    if(is_file($dst)){
    	echo RKEY_ACCDENY;
        exit;
    }
    
    $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
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
    $oldFields = readKeyValues($dst);
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
        $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
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