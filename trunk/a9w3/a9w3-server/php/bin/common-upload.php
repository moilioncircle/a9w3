<?php
require_once('common.php');

define('POST_FILE_NAME','FILE');
define('RKEY_FILE_ONLY','warn.upload.only');
define('RKEY_FILE_DENY','warn.upload.deny');
define('PATH_RULE_FILE',PATH_ROOT.'a9w3-server/upload.htm');

function checkUploadFileOnly($fn){
    
    echo RKEY_FILE_ONLY;
    exit;
}
function checkUploadFileDeny($fn){
    
    echo RKEY_FILE_DENY;
    exit;
}

function getExtendFileName($fn){
    $pos = strrpos ($fn, '.');
    return ($pos === false) ? '':substr($fn,$pos+1);
}

function getFileNameRules($cd){
    foreach(file(PATH_RULE_FILE) as $line){
        if(strpos($cd) !== false){
            return preg_split("/[ \t]*,[ \t]*/", $line);
        }
    }
    return array();
}
?>