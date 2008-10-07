<?php
define("PATH_ROOT","../../../");
define("SKEY_IMGSN","IMGSN_");
define("SKEY_ADMIN","ADMIN_");
define("SKEY_CPASS","CPASS_");
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
    if(empty($_SESSION[SKEY_IMGSN.$_REQUEST["UID"]])){
        echo RKEY_ACCDENY;
        exit;
    }
    if(time() - $_SESSION[SKEY_IMGSN.$_REQUEST["UID"]] >= 5*60){
        echo RKEY_ACCDENY;
        exit;
    }
}
?>