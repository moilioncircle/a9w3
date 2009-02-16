<?php
define('PATH_ROOT','../../../');
define('DEFAULT_PASS','a9w3_1s_g00d');
define('TIMEOUT_MINUTES',5);

define('SKEY_IMGSN','IMGSN_'); // by uid

define('SKEY_UID','UID');
define('SKEY_UTIME','UTIME');
define('SKEY_UMODE','UMODE');

define('UMODE_ADMIN','ADMIN');
define('UMODE_WRITER','WRITER');
define('UMODE_READER','READER');

define('RKEY_UNKOWN','warn.unknown');
define('RKEY_SUCCESS','info.success');
define('RKEY_WRIMGSN','warn.imgsn.wrong');
define('RKEY_ACCDENY','warn.deny');
define('RKEY_SETPASS','warn.pass.change');
define('RKEY_SMPPASS','info.pass.simple');
define('RKEY_SYSDENY','warn.sysfile.deny');

define('PERMIT_MODE',true);

function checkRequestUID(){
    if(empty($_REQUEST['UID'])
    || !preg_match('/^[a-z_0-9]+$/i', $_REQUEST['UID'])
    || !is_dir(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'])){
        echo RKEY_ACCDENY;
        exit;
    }
}

function checkUmodePermit($group){
    if(!PERMIT_MODE) return;
    
    @session_start();
    if(empty($_SESSION[SKEY_UID])
    || empty($_SESSION[SKEY_UTIME])
    || empty($_SESSION[SKEY_UMODE])){
        echo RKEY_ACCDENY;
        exit;
    }
    if(time() - $_SESSION[SKEY_UTIME] > TIMEOUT_MINUTES*60){
        echo RKEY_ACCDENY;
        exit;
    }
    if(strpos($_SESSION[SKEY_UMODE], UMODE_ADMIN) === false){
        if(strpos($_SESSION[SKEY_UMODE], $group) === false
        || $_SESSION[SKEY_UID] !== $_REQUEST['UID']){
            echo RKEY_ACCDENY;
            exit;
        }
    }else{
        // ADMIN(=ADMIN) > WRITER(!=WRITER)
    }
    // touch time
    $_SESSION[SKEY_UTIME]=time();
}

function writeFile($filename,$content,$mode){
    
    if (is_file($filename) && !is_writable($filename)) return false;
    
    // failed to open
    if (!$handle = fopen($filename, $mode)){
         return false;
    }
    // failed to lock
    if (!flock($handle, LOCK_EX)){
        fclose($handle);
        return false;
    }
    
    // write
    $rtv = (fwrite($handle,$content) === FALSE)?false:true;
    
    // close lock and file
    flock($handle, LOCK_UN);
    fclose($handle);
    return $rtv;
}

function deleteFile($filename){
    if (!is_file($filename)) return false;
    return unlink($filename);
}
function deleteTree($filepath){
    if(!file_exists($filepath)) return false;
    
    if (is_dir($filepath) && !is_link($filepath)){
        if ($dh = opendir($filepath)){
            while (($sf = readdir($dh)) !== false){
                if ($sf == '.' || $sf == '..'){
                    continue;
                }
                if (!deleteTree($filepath.'/'.$sf)){
                    return false;
                }
            }
            closedir($dh);
        }
        return rmdir($filepath);
    }
    return unlink($filepath);
}

function text2line($text){
    if(empty($text)) return '';
    return str_replace(array("\\","\n","\r"),array("\\\\","\\n","\\r"),$text);
}

function getNoMagicRequest($key){
	if(empty($_REQUEST[$key])) return '';
	return get_magic_quotes_gpc()?stripslashes($_REQUEST[$key]):$_REQUEST[$key];
}

function formatSize($size){
    if($size == 0) return '0B';
    $sizename = array('?','B', 'K', 'M');
    $powx = 1;
    $dotx = 0;
    while($size>1024){
        $dotx = round($size%1024);
        $size = round($size/1024);
        $powx ++;
    }
    if($powx > count($sizename)) $powx = 0;
    $sstr = $size<100?$size.'.'.sprintf("%-02s",$dotx):$size;
    return substr($sstr,0,4).$sizename[$powx]; 
}

function readKeyValues($fn){
    $rs = array();
    if(is_file($fn)){
        foreach(file($fn) as $line){
            $line = trim($line);
            if(strpos($line,'#') === 0) continue;
            $pos = strpos($line,'=');
            if($pos > 0){
                $rs[trim(substr($line,0,$pos))] = trim(substr($line,$pos+1));
            }
        }
    }
    return $rs;
}

function getUserDate($format,$uid){
    $tof = PATH_ROOT.'a9w3-auhome/'.$uid.'/profile/timeoffset.htm';
    if(is_file($tof)){
        $offset = intval(file_get_contents($tof));
        return date($format,time()+$offset);
    }else{
        return date($format);
    }
}
?>