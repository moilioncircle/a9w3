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
$DEFAULT_PASS = "a9w3_1s_g00d";
if($DEFAULT_PASS === $_REQUEST["PASS"]){
    $_SESSION[SKEY_CPASS.$_REQUEST["UID"]]=time();
    echo RKEY_SETPASS;
    exit;
}

$pass = file_get_contents(PATH_ROOT."a9w3-auhome/".$_REQUEST["UID"]."/profile/passwd.txt");
if($pass === ''){
    $_SESSION[SKEY_CPASS.$_REQUEST["UID"]]=time();
    echo RKEY_SETPASS;
    exit;
}else if($pass === sha1($_REQUEST["PASS"])){
    $_SESSION[SKEY_ADMIN.$_REQUEST["UID"]]=time();
    echo RKEY_SUCCESS;
    exit;
}
?>