<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client #CODE (UID,PID)
if(empty($_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}

// delete file

// remove index

echo RKEY_SUCCESS;
?>