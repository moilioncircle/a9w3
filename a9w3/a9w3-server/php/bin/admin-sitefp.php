<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

//
$treeDir = array(
    PATH_ROOT.'index.htm',
    PATH_ROOT.'a9w3-engine',
    PATH_ROOT.'a9w3-server',
    PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID']
);

$siteFp = new SiteFp(PATH_ROOT);
$siteFp->setInclude(getNoMagicRequest('INCLUDE'));
$siteFp->setExclude(getNoMagicRequest('EXCLUDE'));

// output
header('Content-type: application/force-download');
header('Content-Transfer-Encoding: Binary');
header('Content-disposition: attachment;filename=\"'.$_REQUEST['UID'].'-sitefp-'.date('YmdHis').'.txt\";');

foreach($treeDir as $v){
    echo $siteFp->makeFp($v);
}

// trace stat
require_once('writer-tracer.php');

/* helper */
class SiteFp{
    
    var $root = NULL;
    var $inar = NULL;
    var $exar = NULL;
    var $tkns = '|';
    
    function SiteFp($root){
        $this->root = $root?trim($root):NULL;
    }
    function setInclude($expstrs){
        $this->inar = $this->transExpstr($expstrs);
    }
    function setExclude($expstrs){
        $this->exar = $this->transExpstr($expstrs);
    }
    function transExpstr($expstrs){
        if(!$expstrs) return NULL;
        $exparr = array();
        foreach(explode(',',$expstrs) as $v){
            if(!$v) continue;
            array_push($exparr, '@'.str_replace('@','\@',$v).'@');
        }
        return $exparr?$exparr:NULL;
    }
    function makeFp($path){
        if(!file_exists($path)) return '';
        
        $result = '';
        if (is_dir($path)){
            if ($dh = opendir($path)){
                while (($sf = readdir($dh)) !== false){
                    if ($sf != '.' && $sf != '..'){
                        $result.=$this->makeFp($path.'/'.$sf);
                    }
                }
                closedir($dh);
            }
        }else if(is_file($path)){
            // filter
            if($this->inar){
                $gt = false;
                foreach($this->inar as $p){
                    $gt = preg_match($p,$path);
                    if($gt) break;
                }
                if(!$gt) return '';
            }
            if($this->exar){
                $gt = true;
                foreach($this->exar as $p){
                    $gt = preg_match($p,$path);
                    if($gt) break;
                }
                if($gt) return '';
            }
            $result.=str_replace($this->root,'',$path).$this->tkns.
                filesize($path).$this->tkns.
                date('YmdHis',filemtime($path)).$this->tkns.
                md5_file($path)."\n";
        }
        return $result;
    }
}
?>