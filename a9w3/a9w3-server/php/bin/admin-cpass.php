<?php
require_once("common.php");
checkRequestUID();

// check by js at client
if(empty($_REQUEST["PASS"]) 
|| empty($_REQUEST["CODE"])
|| empty($_REQUEST["NEWP"])){
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
$rtv = checkPass();
if($rtv !== RKEY_SUCCESS){
    echo $rtv;
    exit;
}

// write new passwd
if(writeFile(PATH_ROOT."a9w3-auhome/".$_REQUEST["UID"]."/profile/passwd.txt",sha1($_REQUEST["NEWP"]),"w")){
    echo RKEY_SUCCESS;
}else{
    echo RKEY_UNKOWN;
}

////
function checkPass()
{
    $pass = file_get_contents(PATH_ROOT."a9w3-auhome/".$_REQUEST["UID"]."/profile/passwd.txt");
    if(($pass === '' && DEFAULT_PASS === $_REQUEST["PASS"])
    || $pass === sha1($_REQUEST["PASS"])){
        // ok
    }else{
        return RKEY_ACCDENY;
    }
    
    // old or default
    if(DEFAULT_PASS === $_REQUEST["NEWP"]
    || $pass === sha1($_REQUEST["NEWP"])){
        return RKEY_SMPPASS;
    }
    
    // js-check
    if(strlen($_REQUEST["NEWP"])<10) return RKEY_SMPPASS;
    if(preg_match("/^\d+$/", $_REQUEST["NEWP"])) return RKEY_SMPPASS;
    if(preg_match("/^[a-zA-Z]+$/", $_REQUEST["NEWP"])) return RKEY_SMPPASS;
    if(strlen(preg_replace("/[0-9a-zA-Z]/", '', $_REQUEST["NEWP"]))<=0) return RKEY_SMPPASS;
    
    return RKEY_SUCCESS;
}
?>