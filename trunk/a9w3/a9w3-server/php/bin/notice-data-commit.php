<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// CODE (UID,PID,FILE*)
if(empty($_REQUEST['PID'])
|| empty($_FILES['FILE'])){
    echo RKEY_ACCDENY;
    exit;
}

$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_file = $_FILES['FILE'];

$hd = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$r_pid.'/head.htm';
if(!preg_match('/^[0-9]{14}$/', $r_pid)
|| !is_file($hd)){
    echo RKEY_ACCDENY;
    exit;
}

if($r_file['name'] === 'index.htm'){
    echo RKEY_SYSDENY;
    exit;
}

require_once('common-upload.php');
checkUploadFileDeny($r_file['name']);

// save
$dt = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$r_pid.'/data';
if(!is_dir($dt) && !mkdir($dt)){
    echo RKEY_UNKOWN;
    exit;
}

if ($r_file['error'] !== UPLOAD_ERR_OK
||  move_uploaded_file($r_file['tmp_name'], $dt.'/'.$r_file['name']) === false){
    echo RKEY_UNKOWN;
    exit;
}

if(!writeFile($dt.'/index.htm',$r_file['name']."\n",'a+')){
    echo RKEY_UNKOWN;
    exit;
}

echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
?>