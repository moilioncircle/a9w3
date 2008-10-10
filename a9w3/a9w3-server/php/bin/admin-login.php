<?php
require_once('common.php');
checkRequestUID();

// check by js at client
if(empty($_REQUEST['PASS']) || empty($_REQUEST['CODE'])){
    echo RKEY_ACCDENY;
    exit;
}
// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$_REQUEST['UID']])
|| $_REQUEST['CODE'] !== $_SESSION[SKEY_IMGSN.$_REQUEST['UID']]){
    echo RKEY_WRIMGSN;
    exit;
}
unset($_SESSION[SKEY_IMGSN.$_REQUEST['UID']]); // clear imgsn

// check passwd
$pass = file_get_contents(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/profile/passwd.htm');
if($pass === '' && DEFAULT_PASS === $_REQUEST['PASS']){
    $_SESSION[SKEY_UTIME.$_REQUEST['UID']]=time();
    echo RKEY_SETPASS;
}else if($pass === sha1($_REQUEST['PASS'])){
    $_SESSION[SKEY_UTIME.$_REQUEST['UID']]=time();
    echo RKEY_SUCCESS;
}else{
    echo RKEY_ACCDENY;
    exit;
}

// set group
foreach(file(PATH_ROOT.'a9w3-engine/conf/group.txt') as $line){
    if (preg_match('/\b'.$_REQUEST['UID'].'\b/', $line)){
        $umd = UMODE_READER;
        if(preg_match('/^admin/i', $line)){
            $umd=UMODE_ADMIN;
        }else if(preg_match('/^writer/i', $line)){
            $umd=UMODE_WRITER;
        }else{
            $umd=UMODE_READER;
        }
        if(empty($_SESSION[SKEY_UMODE.$_REQUEST['UID']])){
            $_SESSION[SKEY_UMODE.$_REQUEST['UID']]=$umd;
        }else{
            $_SESSION[SKEY_UMODE.$_REQUEST['UID']].=','.$umd;
        }
    }
}
?>