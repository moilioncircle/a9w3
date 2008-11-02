<?php
require_once('common.php');
checkRequestUID();

// check by js at client
if(empty($_REQUEST['PASS']) || empty($_REQUEST['CODE'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = $_REQUEST['UID'];
$r_pass  = $_REQUEST['PASS'];
$r_code  = $_REQUEST['CODE'];

// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$r_uid])
|| strcasecmp($r_code,$_SESSION[SKEY_IMGSN.$r_uid]) != 0){
    echo RKEY_WRIMGSN;
    exit;
}
unset($_SESSION[SKEY_IMGSN.$r_uid]); // clear imgsn

// check passwd
$pass = file_get_contents(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/profile/passwd.htm');
if($pass === '' && DEFAULT_PASS === $r_pass){
    echo RKEY_SETPASS;
}else if($pass === sha1($r_pass)){
    echo RKEY_SUCCESS;
}else{
    echo RKEY_ACCDENY;
    exit;
}
$_SESSION[SKEY_UID]=$r_uid;
$_SESSION[SKEY_UTIME]=time();

// set group
foreach(file(PATH_ROOT.'a9w3-engine/conf/group.htm') as $line){
    if (preg_match('/\b'.$r_uid.'\b/', $line)){
        $umd = UMODE_READER;
        if(preg_match('/^admin/i', $line)){
            $umd=UMODE_ADMIN;
        }else if(preg_match('/^writer/i', $line)){
            $umd=UMODE_WRITER;
        }else{
            $umd=UMODE_READER;
        }
        if(empty($_SESSION[SKEY_UMODE])){
            $_SESSION[SKEY_UMODE]=$umd;
        }else{
            $_SESSION[SKEY_UMODE].=','.$umd;
        }
    }
}
// set stat
require_once('common-userstat.php');
if(!traceUserStat(CHL_ADMIN,$r_uid)){
    echo RKEY_UNKOWN;
}
?>