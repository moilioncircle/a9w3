<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// #PID|CODE (UID,[PID],TITLE,[BRIEF],[LABEL],[XTEXT])
if(empty($_REQUEST['TITLE'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid   = $_REQUEST['UID'];
$r_pid   = $_REQUEST['PID'];
$r_title = $_REQUEST['TITLE'];
$r_label = $_REQUEST['LABEL'];
$r_brief = $_REQUEST['BRIEF'];
$r_xtext = $_REQUEST['XTEXT'];

$newFields = array(
    'title'=>trim($r_title),
    'label'=>preg_split('/[\s,]+/',trim($r_label)),
    'xtext'=>trim($r_xtext),
    'brief'=>text2line(trim($r_brief)),
    'mtime'=>'',
    'ctime'=>'',
    'sizeb'=>''
);

$isNew = false;
if(empty($r_pid)){ // new
    $isNew = true;
    $r_pid = date('Y/mdHis');
    $head = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'/head.htm';
    $doby = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid.'/body.htm';
    
    if(!is_file($doby)){
        echo RKEY_ACCDENY;
        exit;
    }
    
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
    $head = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'/head.htm';
    $doby = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/address/'.$r_pid.'/body.htm';
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)
    || !is_file($head)){
        echo RKEY_ACCDENY;
        exit;
    }
    
    // check field changement
    $oldFields = readKeyValues($head);
    
    $k = 'label';
    if(array_key_exists($k,$oldFields)){
        require_once('common-indexer.php');
        $fval = preg_split('/[\s,]+/',$oldFields[$k]);
        foreach($newFields[$k] as $v){ // append
            if(array_search($v,$fval) === false){
                if(!appendIndexToLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
        foreach($fval as $v){ // remove
            if(array_search($v,$newFields[$k]) === false){
                if(!removeIndexFromLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
    }
    
    $newFields['mtime'] = date('Y-m-d H:i:s');
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
label='.implode(' ',$newFields['label']).'
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