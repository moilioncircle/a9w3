<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// PID|CODE (UID,PID|FILE,[LABEL],BRIEF)
if(empty($_REQUEST['BRIEF'])
||(empty($_REQUEST['PID']) && empty($_REQUEST['FILE']))
||(!empty($_REQUEST['PID']) && !empty($_REQUEST['FILE']))){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];

?>