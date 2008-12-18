<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

//
$templetDir = PATH_ROOT.'a9w3-engine/util/templet/';
$sitemapDir = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/sitemap/';

// output

// trace stat
require_once('writer-tracer.php');

/* helper */
function mergeTemplet($templet,$keyval){
	$var_regexp = '/\$\{([\w\d]+)\}/';
	$stm_forbin = '/\bforeach\s+\$\{([\w\d]+)\}\s+in\s+\$\{([\w\d]+)\}\b/';
	$stm_forend = '/\bendeach\b/';
	
	$result = array();
	
	$result;
}
?>