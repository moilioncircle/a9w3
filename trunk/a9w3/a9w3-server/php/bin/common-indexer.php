<?php
require_once('common.php');

define('IDX_ADDRESS','address');
define('IDX_ARTICLE','article');
define('IDX_GALLERY','gallery');

function appendIndexToTotal($tp,$uid,$pid){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    
    // total
    if(!writeFile($idir.'/total/item.htm',"\n".$pid,'a+')){
        return false;
    }
    
    return true;
}
function appendIndexToMonth($tp,$uid,$pid,$mth=''){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    
    // month
    if(empty($mth)){
        $mth = date('Y').'$'.ceil(date('m')/3); //2008$3
    }
    $itemdir = $idir.'/month/'.$mth; //month/2008$3/
    if(!is_dir($itemdir)
    && mkdir($itemdir) 
    && !writeFile($idir.'/month/item.htm',"\n".$mth,'a+')){
        return false; //month/item.htm
    }
    if(!writeFile($itemdir.'/item.htm',"\n".$pid,'a+')){
        return false;//month/2008$3/item.htm
    }
    
    return true;
}

function appendIndexToLabel($tp,$uid,$pid,$lbl=''){
    if(!isValidType($tp)){
        return false;
    }
    if(empty($lbl)){
        return true;
    }else if(is_array($lbl)){
        $lbls = $lbl;
    }else if(is_string($lbl)){
        $lbls = preg_split('/[\s,]+/', $lbl);
    }else{
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    
    $maxseq = 0;
    $valkey = array();
    $idxfl = $idir.'/label/item.htm';
    foreach(file($idxfl) as $line){
        $kv = explode("=", $line);
        if(count($kv) !=2) continue;
        $valkey[trim($kv[1])] = $kv[0];
        if(intval($kv[0])>$maxseq){
            $maxseq = intval($kv[0]);
        }
    }
    foreach($lbls as $part){
        if (array_key_exists($part, $valkey)){
            $lbto = $valkey[$part];
        }else{
            $maxseq ++;
            $lbto = sprintf('%03s',$maxseq);
            if(!is_dir($idir.'/label/'.$lbto)
            &&mkdir($idir.'/label/'.$lbto)
            &&!writeFile($idxfl,"\n$lbto=$part",'a+')){ //label/item.htm
                return false;
            }
        }
        if(!writeFile($idir.'/label/'.$lbto.'/item.htm',"\n$pid",'a+')){
            return false;
        }
    }
    
    return true;
}

function removeIndexFromTotal($tp,$uid,$pid){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    //total
    if(!removeIfHasPid($idir.'/total/item.htm',$pid)){
        return false;
    }
    return true;
}

function removeIndexFromMonth($tp,$uid,$pid,$mth=''){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    //month
    if(empty($mth)){
        $mths = file($idir.'/month/item.htm');
    }else{
        $mths = array($mth);
    }
    
    foreach($mths as $line){
        if(!removeIfHasPid($idir.'/month/'.trim($line).'/item.htm',$pid)){
            return false;
        }
    }
    return true;
}

function removeIndexFromLabel($tp,$uid,$pid,$lbl=''){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    //label
    if(empty($lbl)){
        $lbls = file($idir.'/label/item.htm');
    }else{
        $lbls = array($lbl);
    }
    
    foreach($lbls as $line){
        $line = substr($line, 0, strpos($line,'='));
        if(!removeIfHasPid($idir.'/label/'.trim($line).'/item.htm',$pid)){
            return false;
        }
    }
    return true;
}

/* helper */
function removeIfHasPid($fn,$pid){
    $lines = file($fn);
    $has = false;
    foreach($lines as $i => $line){
        if(strpos($line,$pid) !== false){
            unset($lines[$i]);
            $has = true;
            break;
        }
    }
    if($has && !writeFile($fn,implode('', $lines),'w')){
        return false;
    }
    return true;
}
function isValidType($tp){
    return ($tp === IDX_ADDRESS
    || $tp === IDX_ARTICLE
    || $tp === IDX_GALLERY);
}
?>