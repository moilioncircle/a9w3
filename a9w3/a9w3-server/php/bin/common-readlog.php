<?php
require_once('common.php');

define('KEY_ADMIN_MTIME',  'admin.mtime');
define('KEY_ADMIN_COUNT',  'admin.count');
define('KEY_ADDRESS_MTIME','address.mtime');
define('KEY_ADDRESS_COUNT','address.count');
define('KEY_ARTICLE_MTIME','article.mtime');
define('KEY_ARTICLE_COUNT','article.count');
define('KEY_GALLERY_MTIME','gallery.mtime');
define('KEY_GALLERY_COUNT','gallery.count');
define('KEY_BOARD_MTIME',  'board.mtime');
define('KEY_BOARD_COUNT',  'board.count');
define('KEY_NOTICE_MTIME', 'notice.mtime');
define('KEY_NOTICE_COUNT', 'notice.count');

define('CHL_ADMIN',  'admin');
define('CHL_ADDRESS','address');
define('CHL_ARTICLE','article');
define('CHL_GALLERY','gallery');
define('CHL_BOARD',  'board');
define('CHL_NOTICE', 'notice');

function traceUserStat($tp,$uid){
    switch($tp){
        case CHL_ADMIN:
            $keymtime = KEY_ADMIN_MTIME;
            $keycount = KEY_ADMIN_COUNT;
            break;
        case CHL_ADDRESS:
            $keymtime = KEY_ADDRESS_MTIME;
            $keycount = KEY_ADDRESS_COUNT;
            break;
        case CHL_ARTICLE:
            $keymtime = KEY_ARTICLE_MTIME;
            $keycount = KEY_ARTICLE_COUNT;
            break;
        case CHL_GALLERY:
            $keymtime = KEY_GALLERY_MTIME;
            $keycount = KEY_GALLERY_COUNT;
            break;
        case CHL_BOARD:
            $keymtime = KEY_BOARD_MTIME;
            $keycount = KEY_BOARD_COUNT;
            break;
        case CHL_NOTICE:
            $keymtime = KEY_NOTICE_MTIME;
            $keycount = KEY_NOTICE_COUNT;
            break;
        default:
            return false;
    }
    
    // load file
    $mtime = date('Y-m-d H:i:s');
    $keyval = array(
       KEY_ADMIN_MTIME  =>$mtime,
       KEY_ADMIN_COUNT  =>'0',
       KEY_ADDRESS_MTIME=>$mtime,
       KEY_ADDRESS_COUNT=>'0',
       KEY_ARTICLE_MTIME=>$mtime,
       KEY_ARTICLE_COUNT=>'0',
       KEY_GALLERY_MTIME=>$mtime,
       KEY_GALLERY_COUNT=>'0',
       KEY_BOARD_MTIME  =>$mtime,
       KEY_BOARD_COUNT  =>'0',
       KEY_NOTICE_MTIME =>$mtime,
       KEY_NOTICE_COUNT =>'0'
    );

    $dstFile = PATH_ROOT.'a9w3-auhome/'.$uid.'/helpers/status/info/stat.htm';
    foreach(file($dstFile) as $line){
        $kv = explode("=", $line);
        if(count($kv) !=2) continue;
        if($kv[0] === $keymtime){
            continue;
        }else if($kv[0] === $keycount){
            $keyval[$kv[0]] = intval(trim($kv[1]))+1;
        }else{
            $keyval[$kv[0]] = trim($kv[1]);
        }
    }
    // write file
    $lines='';
    foreach($keyval as $k => $v){
        $lines.=$k.'='.$v."\n";
    }
    if(!writeFile($dstFile,trim($lines),'w')){
        return false;
    }
    
    return true;
}
?>