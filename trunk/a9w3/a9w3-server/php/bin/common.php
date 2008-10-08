<?php
define("PATH_ROOT","../../../");
define("DEFAULT_PASS","a9w3_1s_g00d");
define("SKEY_IMGSN","IMGSN_");
define("SKEY_UTIME","UTIME_");
define("SKEY_UMODE","UMODE_");
define("UMODE_ADMIN","ADMIN");
define("UMODE_WRITER","WRITER");

define("RKEY_UNKOWN","warn.unknown");
define("RKEY_SUCCESS","info.success");
define("RKEY_WRIMGSN","warn.imgsn.wrong");
define("RKEY_ACCDENY","warn.deny");
define("RKEY_SETPASS","warn.pass.change");
define("RKEY_SMPPASS","info.pass.simple");

function checkRequestUID(){
    if(empty($_REQUEST["UID"])) return false;
    if(!is_dir(PATH_ROOT."a9w3-auhome/".$_REQUEST["UID"])){
        echo RKEY_ACCDENY;
        exit;
    }
}

function checkAdminPermit(){
    @session_start();
    if(empty($_SESSION[SKEY_ADMIN.$_REQUEST["UID"]])){
        echo RKEY_ACCDENY;
        exit;
    }
    if(time() - $_SESSION[SKEY_ADMIN.$_REQUEST["UID"]] >= 5*60){
        echo RKEY_ACCDENY;
        exit;
    }
}
function checkWriterPermit(){
    @session_start();
    if(empty($_SESSION[SKEY_WRITER.$_REQUEST["UID"]])){
        echo RKEY_ACCDENY;
        exit;
    }
    if(time() - $_SESSION[SKEY_WRITER.$_REQUEST["UID"]] >= 5*60){
        echo RKEY_ACCDENY;
        exit;
    }
}

function writeFile($filename,$content,$mode){
    
    if (!is_writable($filename)) return false;
    
    // failed to open
    if (!$handle = fopen($filename, $mode)){
         return false;
    }
    // failed to lock
    if (!flock($handle, LOCK_EX)){
        fclose($handle);
        return false;
    }
    
    // write
    $rtv = (fwrite($handle,$content) === FALSE)?false:true;
    
    // close lock and file
    flock($handle, LOCK_UN);
    fclose($handle);
    return $rtv;
}
?>