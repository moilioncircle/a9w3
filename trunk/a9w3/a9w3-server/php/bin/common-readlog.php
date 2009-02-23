<?php
require_once('common.php');

define('RDL_ARTICLE','article');
define('RDL_GALLERY','gallery');

function traceReader($tp,$uid,$pid){
    if($tp !== RDL_ARTICLE
    && $tp !== RDL_GALLERY){
        return false;
    }
    
    $ymdhis = getUserDate('YmdHis',$uid);
    
    /**** read hit/log ****/
    $rfnm = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/read/'.$tp.'/'.$pid;
    $bdr = dirname($rfnm);
    if(!is_dir($bdr) && !mkdir($bdr)){ // mkdir if not exist
        return false;
    }
    // cnt
    $ttl = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/read/'.$tp.'/0000.htm';
    if(!increaseHit($ttl)){
        return false;
    }
    // hit
    $hnm = $rfnm.'-hit.htm';
    if(!increaseHit($hnm)){
        return false;
    }
    // log
    $lnm = $rfnm.'-log.htm';
    $lgt = $ymdhis.'|'.$_SERVER["REMOTE_ADDR"]."\n";
    if(!writeFile($lnm,$lgt,'a+')){
        return false;
    }
    
    /**** stat hit/log ****/
    $sfnm = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/stat/'.$tp;
    $yyyy = substr($ymdhis,0,4);
    $mm   = substr($ymdhis,4,2);
    $dd   = substr($ymdhis,6,2);
    
    $sdfy = $sfnm.'/date/'.$yyyy;
    $sdfm = $sdfy.'/'.$mm;
    $sdf  = $sdfm.'/'.$dd;
    $smfy = $sfnm.'/month/'.$yyyy;
    $smf  = $smfy.'/'.$mm;
    $syf  = $sfnm.'/year/'.$yyyy;
    
    if((!is_dir($sdfy) && !mkdir($sdfy))
    || (!is_dir($sdfm) && !mkdir($sdfm))
    || (!is_dir($smfy) && !mkdir($smfy))){
        echo RKEY_UNKOWN;
        exit;
    }
    
    if(!increaseHit($sdf.'-hit.htm')
    || !increaseHit($smf.'-hit.htm')
    || !increaseHit($syf.'-hit.htm')){
        return false;
    }
    
        // log
    $lnm = $sdf.'-log.htm';
    $lgt = $pid.'|'.$ymdhis.'|'.$_SERVER["REMOTE_ADDR"]."\n";
    if(!writeFile($lnm,$lgt,'a+')){
        return false;
    }
    return true;
}

function increaseHit($fln){
    $cnt = 1;
    if(is_file($fln)){
        $cnt = intval(trim(file_get_contents($fln)))+1;
    }
    if(!writeFile($fln,$cnt,'w')){
        return false;
    }
    return true;
}
?>