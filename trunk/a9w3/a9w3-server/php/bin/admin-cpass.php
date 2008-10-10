<?php
require_once('common.php');
checkRequestUID();

// check by js at client
if(empty($_REQUEST['PASS']) 
|| empty($_REQUEST['CODE'])
|| empty($_REQUEST['NEWP'])){
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
unset($_SESSION[SKEY_IMGSN.$_REQUEST['UID']]);  // clear imgsn

// check passwd
$pass = file_get_contents(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/profile/passwd.htm');
if(!(($pass === '' && DEFAULT_PASS === $_REQUEST['PASS'])
|| $pass === sha1($_REQUEST['PASS']))){ // access
    echo RKEY_ACCDENY;
    exit;
}

if(DEFAULT_PASS === $_REQUEST['NEWP']
|| $pass === sha1($_REQUEST['NEWP'])){ // old or default
    echo RKEY_SMPPASS;
    exit;
}

if(strlen($_REQUEST['NEWP'])<10 
|| strlen(preg_replace('/[0-9a-zA-Z]/', '', $_REQUEST['NEWP']))<=0){ // simple passwd
    echo RKEY_SMPPASS;
    exit;
}

// write new passwd
if(writeFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/profile/passwd.htm',sha1($_REQUEST['NEWP']),'w')){
    echo RKEY_SUCCESS;
}else{
    echo RKEY_UNKOWN;
}
?>