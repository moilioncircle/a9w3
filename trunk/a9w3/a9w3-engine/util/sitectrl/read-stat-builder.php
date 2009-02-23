<?php
// security check
if(!empty($_SERVER['REQUEST_URI'])){
    echo "can not run on server side";
    exit;
}
//
$self = str_replace("\\", '/', __FILE__);
for($i=0;$i<4;$i++) $self = dirname($self);
define('PATH_ROOT',$self.'/');
parseCommand($argv);

//////////////////////// Function ///////////////////////////
function parseCommand($argv){
    if(count($argv)<2){command_help();exit;}
    //
    $a9user = $argv[1];
    if(is_dir(PATH_ROOT.'a9w3-auhome/'.$a9user)){
        command_build($a9user);
    }else{
        command_help();
    }
} 
//////////////////////// Command ///////////////////////////
function command_help(){
    echo "
    build stat from readlog for an a9user.
    
    usage:
        php -f ".basename(__FILE__) ." a9user
    ";
}

function command_build($a9user){
    $sfd = PATH_ROOT.'a9w3-auhome/'.$a9user.'/helpers/status/stat';
    
    $tp = array('article','gallery');
    $ch = array('date','month','year');
    
    foreach($tp as $t){
        foreach($ch as $c){
            $ph = $sfd.'/'.$t.'/'.$c;
            deleteTree($sfd.'/'.$t.'/'.$c);
            mkdir($ph);
        }
    }
    
    $rfd = PATH_ROOT.'a9w3-auhome/'.$a9user.'/helpers/status/read';
    travelHitlog($rfd);
    
}

//////////////////////// Helper ///////////////////////////
function travelHitlog($path){
    if(is_dir($path)){
        $dp=dir($path);
        while(($file=$dp->read()) !== false )
            if($file!='.'&&$file!='..')
                travelHitlog($path.'/'.$file);
        $dp->close();
    }
    if(strpos($path, '-log.htm') > 0){
        $yy  = basename(dirname($path));
        $xx  = basename($path);
        $pid = $yy.'/'.substr($xx,0,strpos($xx,'-'));
        $ffd = dirname(dirname($path));
        $tp  = basename($ffd);
        $hm  = dirname(dirname($ffd)); // status
        
        echo "build log $tp/$pid\n";
        foreach (file($path) as $line) {
            generateLog($tp,$hm,$pid,trim($line));
        }
    }
}

function generateLog($tp,$hm,$pid,$txt){
    $sfnm = $hm.'/stat/'.$tp;
    $ymdhis = substr($txt,0,14);
    $yyyy = substr($ymdhis,0,4);
    $mm   = substr($ymdhis,4,2);
    $dd   = substr($ymdhis,6,2);
    
    $sdfy = $sfnm.'/date/'.$yyyy;
    $sdfm = $sdfy.'/'.$mm;
    $sdf  = $sdfm.'/'.$dd;
    $smfy = $sfnm.'/month/'.$yyyy;
    $smf  = $smfy.'/'.$mm;
    $syf  = $sfnm.'/year/'.$yyyy;
    
    if((!is_dir($sdfy) && !mkdir($sdfy))
    || (!is_dir($sdfm) && !mkdir($sdfm))
    || (!is_dir($smfy) && !mkdir($smfy))){
        echo "failed to mkdir";
        exit;
    }
    
    if(!increaseHit($sdf.'-hit.htm')
    || !increaseHit($smf.'-hit.htm')
    || !increaseHit($syf.'-hit.htm')){
        return false;
    }
    
        // log
    $lnm = $sdf.'-log.htm';
    $lgt = $pid.'|'.$txt."\n";
    if(!writeFile($lnm,$lgt,'a+')){
        return false;
    }
    return true;
}

function increaseHit($fln){
    $cnt = 1;
    if(is_file($fln)){
        $cnt = intval(trim(file_get_contents($fln)))+1;
    }
    if(!writeFile($fln,$cnt,'w')){
        return false;
    }
    return true;
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

?>