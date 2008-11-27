<?php
// security check
if(!empty($_SERVER['REQUEST_URI'])){
    echo "can not run on server side";
    exit;
}
//
$self = __FILE__;
for($i=0;$i<4;$i++) $self = dirname($self);
define('PATH_ROOT',$self.'/');
parseCommand($argv);

//////////////////////// Function ///////////////////////////
function parseCommand($argv){
    if(count($argv)<2){command_help();exit;}
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
    if(empty($cmndarg[0]) || !is_dir(PATH_ROOT.'a9w3-auhome/'.$cmndarg[0])){
        echo 'bad parameter: uid';
        exit;
    }
    $treeDir = array(
        PATH_ROOT.'index.htm',
        PATH_ROOT.'a9w3-engine',
        PATH_ROOT.'a9w3-server',
        PATH_ROOT.'a9w3-auhome/'.$cmndarg[0]
    );
    
    foreach($treeDir as $v){
        echo fingerprintTree($v);
    }
}
function command_difffp($cmndarg,$options){
    if(empty($cmndarg[0])||empty($cmndarg[1])){
        echo 'argument missed';
        exit;
    }
    if(!is_file($cmndarg[0])||!is_file($cmndarg[1])){
        echo 'file not existed :'.$cmndarg[0].' or '.$cmndarg[1];
        exit;
    }
    if($cmndarg[0] == $cmndarg[1]) return;
    
    $inFile = array_key_exists('in', $options)?explode(',',$options['in']):array();
    $exFile = array_key_exists('ex', $options)?explode(',',$options['ex']):array();
    
    $lfplines = fpfile2array($cmndarg[0],$inFile,$exFile);
    $rfplines = fpfile2array($cmndarg[1],$inFile,$exFile);
    
    //token | filename | lsize | ltime | rsize | rtime
    $tk_lcl = '>> ';// >> : local  only / !md5 && ltime>=rtime
    $tk_rmt = '<< ';// << : remote only / !md5 && ltime<rtime
    $tk_eql = '== ';// == : equal (md5 && size)
    $tk_unk = '<> ';// <> : unknown,none of above
    $tk_spl = ' | ';
    
    //based on local
    foreach($lfplines as $fn=>$op){
        if(!array_key_exists($fn,$rfplines)){
            echo $tk_rmt.$tk_spl.       // token
                 $fn.$tk_spl.           // filename
                 $op['size'].$tk_spl.   // lsize
                 $op['time'].$tk_spl.   // ltime
                 $tk_spl.               // rsize
                 "\n";                  // rtime
        }else{
            $rop = $rfplines[$fn];
            $tk_its = $tk_unk;
            if($op['md5'] !== $rop['md5']){
                $tk_its = $op['time'] >= $rop['time']?$tk_lcl:$tk_rmt;
            }else{
                if($op['size'] === $rop['size']) $tk_its=$tk_eql;
            }
            echo $tk_its.$tk_spl.       // token
                 $fn.$tk_spl.           // filename
                 $op['size'].$tk_spl.   // lsize
                 $op['time'].$tk_spl.   // ltime
                 $rop['size'].$tk_spl.  // rsize
                 $rop['time']."\n";     // rtime
        }
    }
    
    //remote only
    foreach($rfplines as $fn=>$op){
        if(!array_key_exists($fn,$lfplines)){
            echo $tk_rmt.$tk_spl.     // token
                 $fn.$tk_spl.         // filename
                     $tk_spl.         // lsize
                     $tk_spl.         // ltime
                 $op['size'].$tk_spl. // rsize
                 $op['time']."\n";    // rtime
        }
    }
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
            -in=p1,p2   included file pattens(regexp). ','-splited.
            -ex=p1,p2   excluded file pattens(regexp). ','-splited.
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
function fpfile2array($fn,$in,$ex){
    $fpa = array();
    
    $is_in = !(empty($in)||count($in)==0);
    if($is_in) $in = array_map("escape_preg", $in);
    $is_ex = !(empty($ex)||count($ex)==0);
    if($is_ex) $ex = array_map("escape_preg", $ex);
    
    foreach(file($fn) as $ln){
        $pts = explode('|',trim($ln));
        if(count($pts) != 4) continue;
        
        if($is_in){
            $gt = false;
            foreach($in as $p){
                $gt = preg_match($p,$pts[0]);
                if($gt) break;
            }
            if(!$gt) continue;
        }
        
        if($is_ex){
            $gt = true;
            foreach($ex as $p){
                $gt = preg_match($p,$pts[0]);
                if($gt) break;
            }
            if($gt) continue;
        }
        
        $fpa[$pts[0]] = array('size'=>$pts[1],'time'=>$pts[2],'md5'=>$pts[3]);
    }
    return $fpa;
}
function escape_preg($v){
    return empty($v)?'':'@'.str_replace('@','\\@',$v).'@';
}
?>