<?php
define('IDX_ADDRESS','address');
define('IDX_ARTICLE','article');
define('IDX_GALLERY','gallery');
require_once('common.php');
function appendIndex($tp,$uid,$pid,$lbl){
    if(!isValidType($tp)){
        return false;
    }
    
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
?>