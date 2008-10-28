<?php
define('PATH_ROOT','../../../');
define('DEFAULT_PASS','a9w3_1s_g00d');
define('TIMEOUT_MINUTES',5);

define('SKEY_IMGSN','IMGSN_'); // by uid

define('SKEY_UID','UID');
define('SKEY_UTIME','UTIME');
define('SKEY_UMODE','UMODE');

define('UMODE_ADMIN','ADMIN');
define('UMODE_WRITER','WRITER');
define('UMODE_READER','READER');

define('RKEY_UNKOWN','warn.unknown');
define('RKEY_SUCCESS','info.success');
define('RKEY_WRIMGSN','warn.imgsn.wrong');
define('RKEY_ACCDENY','warn.deny');
define('RKEY_SETPASS','warn.pass.change');
define('RKEY_SMPPASS','info.pass.simple');

define('PERMIT_MODE',false);

function checkRequestUID(){
    if(empty($_REQUEST['UID'])
    || !preg_match("/^[a-z0-9]+$/i", $_REQUEST['UID'])
    || !is_dir(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'])){
        echo RKEY_ACCDENY;
        exit;
    }
}

function checkUmodePermit($group){
    if(!PERMIT_MODE) return;
    
    @session_start();
    if(empty($_SESSION[SKEY_UID])
    || empty($_SESSION[SKEY_UTIME])
    || empty($_SESSION[SKEY_UMODE])){
        echo RKEY_ACCDENY;
        exit;
    }
    if(time() - $_SESSION[SKEY_UTIME] > TIMEOUT_MINUTES*60){
        echo RKEY_ACCDENY;
        exit;
    }
    if(strpos($_SESSION[SKEY_UMODE], UMODE_ADMIN) === false){
        if(strpos($_SESSION[SKEY_UMODE], $group) === false
        || $_SESSION[SKEY_UID] !== $_REQUEST['UID']){
            echo RKEY_ACCDENY;
            exit;
        }
    }else{
        // ADMIN(=ADMIN) > WRITER(!=WRITER)
    }
}

function writeFile($filename,$content,$mode){
    
    if (is_file($filename) && !is_writable($filename)) return false;
    
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

function deleteFile($filename){
    if (!is_file($filename)) return false;
    return unlink($filename);
}

function text2line($text){
    if(empty($text)) return '';
    return str_replace(array("\\","\n","\r"),array("\\\\","\\n","\\r"),$text);
}
?>