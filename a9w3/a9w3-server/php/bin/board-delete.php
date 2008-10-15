<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// check by js at client
if(empty($_REQUEST['PID'])){
    echo RKEY_ACCDENY;
    exit;
}
// delete file
if(!deleteFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/board/'.$_REQUEST['PID'].'.htm')){
    echo RKEY_UNKOWN;
    exit;
}
// remove index
$idxfile = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/board/00000000000000000.htm';
$idxlines = file($idxfile);
foreach ($idxlines as $i => $line){
    if(strpos($line, $_REQUEST['PID']) !== false){
        unset($idxlines[$i]);
        break;
    }
}
if(!writeFile($idxfile,implode('', $idxlines),'w')){
    echo RKEY_UNKOWN;
    exit;
}
echo RKEY_SUCCESS;
?>