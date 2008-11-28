<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client
if(empty($_REQUEST['PASS']) 
|| empty($_REQUEST['NEWP'])){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = getNoMagicRequest('UID');
$r_pass  = getNoMagicRequest('PASS');
$r_newp  = getNoMagicRequest('NEWP');

// check passwd
$pass = file_get_contents(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/profile/passwd.htm');
if(!(($pass === '' && DEFAULT_PASS === $r_pass)
|| $pass === sha1($r_pass))){ // access
    echo RKEY_ACCDENY;
    exit;
}

if(DEFAULT_PASS === $r_newp
|| $pass === sha1($r_newp)){ // old or default
    echo RKEY_SMPPASS;
    exit;
}

if(strlen($r_newp)<10 
|| strlen(preg_replace('/[0-9a-zA-Z]/', '', $r_newp))<=0){ // simple passwd
    echo RKEY_SMPPASS;
    exit;
}

// write new passwd
if(writeFile(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/profile/passwd.htm',sha1($r_newp),'w')){
    echo RKEY_SUCCESS;
}else{
    echo RKEY_UNKOWN;
}

// trace stat
require_once('writer-tracer.php');
?>