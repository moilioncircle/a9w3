<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// PID|CODE (UID,[PID],[LABEL],BRIEF,[FILE?PID!=NULL])
if(empty($_REQUEST['BRIEF'])
||(empty($_REQUEST['PID']) && empty($_REQUEST['FILE']))){
    echo RKEY_ACCDENY;
    exit;
}

?>