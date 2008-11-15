<?php
require_once('common.php');
checkRequestUID();

// check type and pid
if(empty($_REQUEST['PID'])) exit;

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_type = $_REQUEST['type'];

require_once('common-readlog.php');
if($r_type === 'paper'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)) exit;
    if(!is_dir(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$r_pid)) exit;
    $tp = RDL_ARTICLE;
}else if ($r_type === 'album'){
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)) exit;
    if(!is_file(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm')) exit;
    $tp = RDL_GALLERY;
}else{
    exit;
}
// write log
traceReader($tp,$r_uid,$r_pid);
?>