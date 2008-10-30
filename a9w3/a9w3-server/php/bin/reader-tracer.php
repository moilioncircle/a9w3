<?php
require_once('common.php');
checkRequestUID();

// check type and pid
if(empty($_REQUEST['PID'])) exit;

require_once('common-readlog.php');
if($_REQUEST['type'] === 'paper'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}+$/', $_REQUEST['PID'])) exit;
    if(!is_dir(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/article/'.$_REQUEST['PID'])) exit;
    $tp = RDL_ARTICLE;
}else if ($_REQUEST['type'] === 'album'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{13}+$/', $_REQUEST['PID'])) exit;
    if(!is_file(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/info/'.$_REQUEST['PID'].'.htm')) exit;
    $tp = RDL_GALLERY;
}else{
    exit;
}
// write log
traceReader($tp,$_REQUEST['UID'],$_REQUEST['PID']);
?>