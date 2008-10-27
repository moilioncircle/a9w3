<?php
require_once('common.php');

define('RDL_ARTICLE','article');
define('RDL_GALLERY','gallery');

function traceReader($tp,$uid,$pid){
    if($tp != RDL_ARTICLE
    && $tp != RDL_GALLERY){
        return false;
    }
    
    // hit
    
    // log
    return true;
}
?>