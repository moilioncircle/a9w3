<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// #PID|CODE (UID,[PID],TITLE,[BRIEF],[XTEXT])
if(empty($_REQUEST['TITLE'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid   = getNoMagicRequest('UID');
$r_pid   = getNoMagicRequest('PID');
$r_title = getNoMagicRequest('TITLE');
$r_brief = getNoMagicRequest('BRIEF');
$r_xtext = getNoMagicRequest('XTEXT');

$newFields = array(
    'title'=>trim($r_title),
    'xtext'=>trim($r_xtext),
    'brief'=>text2line(trim($r_brief)),
    'mtime'=>'',
    'ctime'=>'',
    'sizeb'=>''
);

$isNew = false;
if(empty($r_pid)){ // new
    $isNew = true;
    $r_pid = getUserDate('YmdHis',$r_uid);
    $ndir = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$r_pid;
    $head = $ndir.'/head.htm';
    $doby = $ndir.'/body.htm';
    
    if(is_file($doby)){
        echo RKEY_ACCDENY;
        exit;
    }
    
    if(!is_dir($ndir) && !mkdir($ndir)){
        echo RKEY_UNKOWN;
        exit;
    }
    
    $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
    $newFields['ctime'] = $newFields['mtime'];
    
    // add index
    if(!writeFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/00000000000000.htm',"\n$r_pid",'a+')){
        echo RKEY_UNKOWN;
        exit;
    }
}else{ // exists
    $isNew = false;
    $ndir = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$r_pid;
    $head = $ndir.'/head.htm';
    $doby = $ndir.'/body.htm';
    if(!preg_match('/^[0-9]{14}$/', $r_pid)
    || !is_file($head)){
        echo RKEY_ACCDENY;
        exit;
    }
    
    // check field changement
    $oldFields = readKeyValues($head);
    $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
    $newFields['ctime'] = $oldFields['ctime'];
}

// write body and head
if(!writeFile($doby,$r_xtext,'w')){
    echo RKEY_UNKOWN;
    exit;
}
$newFields['sizeb'] = formatSize(filesize($doby));

$txt  = '
title='.$newFields['title'].'
ctime='.$newFields['ctime'].'
mtime='.$newFields['mtime'].'
sizeb='.$newFields['sizeb'].'
brief='.$newFields['brief'];

if(!writeFile($head,trim($txt),'w')){
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