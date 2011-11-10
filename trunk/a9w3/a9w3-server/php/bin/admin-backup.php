<?php
require_once('../3rd/pclzip.lib.php');
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

//
$userHome = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'];
$tempFile = $userHome.'.zip';

// zip temp file
$archive = new PclZip($tempFile);
$v_list = $archive->create($userHome,PCLZIP_OPT_REMOVE_PATH, PATH_ROOT);
if ($v_list == 0) {
    deleteFile($tempFile);
    die("error : ".$archive->errorInfo(true));
}

// output & delete
header('Content-type: application/force-download');
header('Content-Transfer-Encoding: Binary');
header('Content-Length: '.filesize($tempFile));
header('Content-disposition: attachment;filename=\"'.basename($tempFile).'\";');
readfile($tempFile);
deleteFile($tempFile);
// trace stat
require_once('writer-tracer.php');
?>