<?php
// security check
if(!empty($_SERVER['REQUEST_URI'])){
    echo "can not run on server side";
    exit;
}
define('PATH_ROOT','../../../');
parseCommand($argv);

//////////////////////// Function ///////////////////////////
function parseCommand($argv){
    if(empty($argv)){command_help();exit;}
    //
    $cmndarg = array();
    $options = array();
    // parse arguments
    foreach($argv as $k=>$v){
        if($k<2) continue; // skip 
        if(strpos($v,'-') === 0){ // options
            $es = strpos($v,'=');
            if($es){
                $ok=substr($v,1,$es-1);
                $vl=substr($v,$es+1);
                $options[$ok]=$vl;
            }else{
                $options[$v]=$v;
            }
        }else{ // arguments
            array_push($cmndarg, $v);
        }
    }
    // execute command
    switch($argv[1]){
        case 'sitefp':
            command_sitefp($cmndarg,$options);
            break;
        case 'difffp':
            command_difffp($cmndarg,$options);
            break;
        case 'ftpsfp':
            command_ftpsfp($cmndarg,$options);
            break;
        case 'help':
        default:
            command_help();
    }
} 
//////////////////////// Command ///////////////////////////
function command_sitefp($cmndarg,$options){
    $uid = $cmndarg[0];
    if(!is_dir(PATH_ROOT.'a9w3-auhome/'.$uid)){
        echo 'bad uid:'.$uid;
        exit;
    }
    $treeDir = array(
        PATH_ROOT.'index.htm',
        PATH_ROOT.'a9w3-engine',
        PATH_ROOT.'a9w3-server',
        PATH_ROOT.'a9w3-auhome/'.$uid
    );
    
    foreach($treeDir as $v){
        echo fingerprintTree($v);
    }
}
function command_difffp($cmndarg,$options){
    
}
function command_ftpsfp($cmndarg,$options){
}
function command_help(){
    echo "
    a simple a9w3 site manager to maintain site at local side.
    
    usage:
        php -f ".basename(__FILE__) ." command [command-option]
    command:
        * sitefp uid
            make local site fingerprint of a9user.
            uid         a9user id.
        * difffp [option] lfp rfp
            make difffp by fingerprint between local and remote.
            lfp         local fingerprint.
            rfp         remote fingerprint.
            -in=p1,p2   included file pattens. ','-splited.
            -ex=p1,p2   excluded file pattens. ','-splited.
            -size       compare size
            -time       compare time
            -md5        compare md5 [default]
        * ftpsfp [option] difffp user[:passwd]@server[:port]/a9w3
            useing ftp to put/get/del file on local/remote by difffp.
            difffp      made by 'difffp'.
            user        ftp login user.
            passwd      ftp password.
            server      ftp server.
            port        ftp server port,default is 21.
            a9w3        the a9w3 home path on server.
            -dell       delete local file instead of uploading.
            -delr       delete remote file instead of downloading.
        * help
            what you see right now.
    ";
}

//////////////////////// Helper ///////////////////////////
function fingerprintTree($fn){
    if(!file_exists($fn)) return '';
    $result = '';
    if (is_dir($fn)){
        if ($dh = opendir($fn)){
            while (($sf = readdir($dh)) !== false){
                if ($sf != '.' && $sf != '..'){
                    $result.=fingerprintTree($fn.'/'.$sf);
                }
            }
            closedir($dh);
        }
    }else if(is_file($fn)){
        $result.=str_replace(PATH_ROOT, '',$fn).'|'.
            filesize($fn).'|'.
            date('YmdHis',filemtime($fn)).'|'.
            md5_file($fn)."\n";
    }
    return $result;
}

?>