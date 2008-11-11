<?php
require_once('common.php');

define('POST_FILE_NAME','FILE');
define('RKEY_FILE_ONLY','warn.upload.only');
define('RKEY_FILE_DENY','warn.upload.deny');
define('PATH_RULE_FILE',PATH_ROOT.'a9w3-server/upload.htm');

function checkUploadFileOnly($fn){
    $ext = getExtendFileName($fn);
    $rul = getFileNameRules('image.only');
    foreach($rul as $rl){
        if($ext === $rl) return;
    }
    echo RKEY_FILE_ONLY;
    exit;
}
function checkUploadFileDeny($fn){
    $ext = getExtendFileName($fn);
    $rul = getFileNameRules('datum.deny');
    foreach($rul as $rl){
        if($ext === $rl){
            echo RKEY_FILE_DENY;
            exit;
        }
    }
}

function getExtendFileName($fn){
    $pos = strrpos ($fn, '.');
    return ($pos === false) ? '':strtolower(substr($fn,$pos+1));
}

function getFileNameRules($cd){
    foreach(file(PATH_RULE_FILE) as $line){
        if(strpos($line,$cd) !== false){
            return preg_split("/[ \t]*,[ \t]*/", strtolower(substr($line,strpos($line,'=')+1)));
        }
    }
    return array();
}
?>