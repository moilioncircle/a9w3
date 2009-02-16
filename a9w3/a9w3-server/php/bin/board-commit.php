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
$r_uid  = getNoMagicRequest('UID');
$r_pid  = getNoMagicRequest('PID');
$r_from  = getNoMagicRequest('FROM');
$r_text  = getNoMagicRequest('TEXT');
$r_code  = getNoMagicRequest('CODE');

// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$r_uid])
|| strcasecmp($r_code,$_SESSION[SKEY_IMGSN.$r_uid]) != 0){
    echo RKEY_WRIMGSN;
    exit;
}
unset($_SESSION[SKEY_IMGSN.$r_uid]); // clear imgsn

// write board
$boardid = getUserDate('YmdHis',$r_uid).sprintf("%03s",rand(1,999));
$boardtx  = '
time='.getUserDate('Y-m-d H:i:s',$r_uid).'
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

require_once('common-infostat.php');
updateInfoStat($r_uid,INF_BOARD,1);

echo RKEY_SUCCESS;
?>