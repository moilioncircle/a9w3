<?php
require_once("common.php");
checkRequestUID();

// check by js at client
if(empty($_REQUEST["PASS"]) || empty($_REQUEST["CODE"])){
        echo RKEY_ACCDENY;
        exit;
}
// check imgsn
session_start();
if(empty($_SESSION[SKEY_IMGSN.$_REQUEST["UID"]])
   ||strcmp($_REQUEST["CODE"],$_SESSION[SKEY_IMGSN.$_REQUEST["UID"]]) != 0){
    echo RKEY_WRIMGSN;
    exit;
}

// check passwd
$pass = file_get_contents(PATH_ROOT."a9w3-auhome/".$_REQUEST["UID"]."/profile/passwd.txt");
if($pass === '' && DEFAULT_PASS === $_REQUEST["PASS"]){
    $_SESSION[SKEY_CPASS.$_REQUEST["UID"]]=time();
    echo RKEY_SETPASS;
}else if($pass === sha1($_REQUEST["PASS"])){
    $_SESSION[SKEY_ADMIN.$_REQUEST["UID"]]=time();
    echo RKEY_SUCCESS;
}else{
    echo RKEY_ACCDENY;
}
?>