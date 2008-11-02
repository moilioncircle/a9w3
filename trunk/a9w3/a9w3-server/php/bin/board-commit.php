<?php
require_once('common.php');
checkRequestUID();

// check by js at client
if(empty($_REQUEST['FROM']) 
|| empty($_REQUEST['TEXT'])
|| empty($_REQUEST['CODE'])){
    echo RKEY_ACCDENY;
    exit;
}
// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_from  = $_REQUEST['FROM'];
$r_text  = $_REQUEST['TEXT'];
$r_code  = $_REQUEST['CODE'];

// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$r_uid])
|| strcasecmp($r_code,$_SESSION[SKEY_IMGSN.$r_uid]) != 0){
    echo RKEY_WRIMGSN;
    exit;
}
unset($_SESSION[SKEY_IMGSN.$r_uid]); // clear imgsn

// write board
$boardid = date('YmdHis').sprintf("%03s",rand(1,999));
$boardtx  = '
time='.date('Y-m-d H:i:s').'
user='.text2line($r_from).'
from='.$_SERVER['REMOTE_ADDR'].'
text='.text2line($r_text);

if(!writeFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/board/'.$boardid.'.htm',trim($boardtx),'w')){
    echo RKEY_UNKOWN;
    exit;
}
// write index
if(!writeFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/board/00000000000000000.htm',"\n".$boardid,'a+')){
    echo RKEY_UNKOWN;
    exit;
}
echo RKEY_SUCCESS;
?>