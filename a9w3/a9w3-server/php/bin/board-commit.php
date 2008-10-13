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
// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$_REQUEST['UID']])
|| strcasecmp($_REQUEST['CODE'],$_SESSION[SKEY_IMGSN.$_REQUEST['UID']]) != 0){
    echo RKEY_WRIMGSN;
    exit;
}
unset($_SESSION[SKEY_IMGSN.$_REQUEST['UID']]); // clear imgsn

// write board
$boardid = date('YmdHis').sprintf("%03s",rand(1,999));
$boardtx  = '
time='.date('Y-m-d H:i:s').'
user='.preg_replace('/[\r\n]+/','',$_REQUEST['FROM']).'
from='.$_SERVER['REMOTE_ADDR'].'
text='.preg_replace('/[\r\n]+/','\n',$_REQUEST['TEXT']);

if(!writeFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/board/'.$boardid.'.htm',trim($boardtx),'w')){
    echo RKEY_UNKOWN;
    exit;
}
// write index
if(!writeFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/board/00000000000000000.htm',"\n".$boardid,'a+')){
    echo RKEY_UNKOWN;
    exit;
}
echo RKEY_SUCCESS;
?>