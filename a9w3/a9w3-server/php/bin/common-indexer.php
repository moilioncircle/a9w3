<?php
define('IDX_ADDRESS','address');
define('IDX_ARTICLE','article');
define('IDX_GALLERY','gallery');
require_once('common.php');
function appendIndex($tp,$uid,$pid,$lbl){
    if(!isValidType($tp)){
        return false;
    }
    $idir = PATH_ROOT.'a9w3-auhome/'.$uid.'/indexer/'.$tp; //address
    // label
    if(!empty($lbl)){
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
        foreach(preg_split('/[\s,=]+/', $lbl) as $part){
            
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
    }
    // month
    $quto = date('Y').'$'.intval((date('m')-1)/4+1); //2008$3
    $itemdir = $idir.'/month/'.$quto; //month/2008$3/
    if(!is_dir($itemdir)
    && mkdir($itemdir) 
    && !writeFile($idir.'/month/item.htm',"\n".$quto,'a+')){
        return false; //month/item.htm
    }
    if(!writeFile($itemdir.'/item.htm',"\n".$pid,'a+')){
        return false;//month/2008$3/item.htm
    }
    // total
    if(!writeFile($idir.'/total/item.htm',"\n".$pid,'a+')){
        return false;//month/2008$3/item.htm
    }
    
    return true;
}
function deleteIndex($tp,$uid,$pid,$lbl){
    if(!isValidType($tp)){
        return false;
    }
}

function isValidType($tp){
    return ($tp === IDX_ADDRESS
    || $tp === IDX_ARTICLE
    || $tp === IDX_GALLERY);
}

/*if(appendIndex(IDX_ADDRESS,'a9admin','20081015212121','ฮาตฤ, ฒโสิ abc')){
    echo 'ok';
}*/
?>