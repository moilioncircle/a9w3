<?php
require_once('common.php');

define('RDL_ARTICLE','article');
define('RDL_GALLERY','gallery');

function traceReader($tp,$uid,$pid){
    if($tp !== RDL_ARTICLE
    && $tp !== RDL_GALLERY){
        return false;
    }
    $fnm = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/read/'.$tp.'/'.$pid;
    $bdr = dirname($fnm);
    if(!is_dir($bdr) && !mkdir($bdr)){ // mkdir if not exist
        return false;
    }
    
    // log
    $lnm = $fnm.'-log.htm';
    $lgt = date('YmdHis').'|'.$_SERVER["REMOTE_ADDR"]."\n";
    if(!writeFile($lnm,$lgt,'a+')){
        return false;
    }
    
    // hit
    $hnm = $fnm.'-hit.htm';
    if(is_file($hnm)){
        $hit = intval(trim(file_get_contents($hnm)))+1;
    }else{
        $hit = 1;
    }
    if(!writeFile($hnm,$hit,'w')){
        return false;
    }
    
    return true;
}
?>