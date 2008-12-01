<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// CODE (UID,PID,FILE)
if(empty($_REQUEST['PID'])
|| empty($_REQUEST['FILE'])){
    echo RKEY_ACCDENY;
    exit;
}

$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_file = $_REQUEST['FILE'];

$hd = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid.'/head.htm';
if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)
|| !is_file($hd)){
    echo RKEY_ACCDENY;
    exit;
}

if($r_file === 'index.htm'){
    echo RKEY_SYSDENY;
    exit;
}


// delete
$dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid.'/data/'.$r_file;
if(!deleteFile($dst)){
    echo RKEY_UNKOWN;
    exit;
}

$idx = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid.'/data/index.htm';
$arr = array();
foreach(file($idx) as $line){
	$line = trim($line);
    if($line !== '' && $line !== $r_file){
    	array_push($arr, $line);
    }
}
if(count($arr) == 0){
	if(!deleteTree(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid.'/data')){
	    echo RKEY_UNKOWN;
	    exit;
	}
}else{
	if(!writeFile($idx,implode("\n",$arr),'w')){
	    echo RKEY_UNKOWN;
	    exit;
	}
}

echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
?>