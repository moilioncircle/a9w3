<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// PID|CODE (UID,PID|FILE,[LABEL],BRIEF)
if(empty($_REQUEST['BRIEF'])
||(empty($_REQUEST['PID']) && empty($_FILES['FILE']))
||(!empty($_REQUEST['PID']) && !empty($_FILES['FILE']))){
    echo RKEY_ACCDENY;
    exit;
}

if(!empty($_FILES['FILE'])){
    require_once('common.php');
    checkUploadFileOnly($_FILES['FILE']['name']));
    
    // save image
    // save thumb
    
}

// save info

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];

?>