<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

$r_uid  = getNoMagicRequest('UID');
$r_site = isset($_SERVER['HTTP_X_FORWARDED_HOST'])?$_SERVER['HTTP_X_FORWARDED_HOST']:$_SERVER['HTTP_HOST'];

//
$templetDir = PATH_ROOT.'a9w3-engine/util/templet/';
$sitemapDir = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/sitemap/';

// output
$sitemaps = array(
    'sitemap.xml',
    'sitemap-article.xml',
    'sitemap-gallery.xml',
    'sitemap-notice.xml'
);
$keyvals  = array(
    array('site'=>$r_site,'a9user'=>$r_uid),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/article/total/item.htm')),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/gallery/total/item.htm')),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/00000000000000.htm'))
);
$cnt = count($sitemaps);
for($i=0;$i<$cnt;$i++){
    $tmpm = mergeTemplet(file($templetDir.$sitemaps[$i]),$keyvals[$i]);
    if(!writeFile($sitemapDir.$sitemaps[$i],implode($tmpm),'w')){
    echo RKEY_UNKOWN;
    exit;
    }
}
echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
/* helper */
function getFileVars($fn){
    $text = file_get_contents($fn);
    return preg_split("/[\r\n]+/",$text);
}
function mergeTemplet($templet,$keyval){
    $var_regexp = '/\$\{([\w\d]+)\}/';
    $stm_forbin = '/\bforeach\s+\$\{([\w\d]+)\}\s+in\s+\$\{([\w\d]+)\}/';
    $stm_forend = '/\bendeach\b/';
    
    $result = array();
    
    $forcnt = 0;
    $forkey = null;
    $forlst = null;
    $fortxt = array();
    
    foreach($templet as $line){
        // statement
        if (preg_match($stm_forend,$line)){ // endeach
            $forcnt --;
            if($forcnt ==0 && !empty($keyval[$forlst]) && is_array($keyval[$forlst])){
                foreach($keyval[$forlst] as $lst){
                    if(empty($lst)) continue;
                    $keyval[$forkey] = $lst;
                    $result = array_merge($result, mergeTemplet($fortxt,$keyval)); // recursive
                }
                $fortxt = array();
            }else if($forcnt >0){
                array_push($fortxt,$line);
            }else{
                $forcnt = 0;
                $fortxt = array();
            }
            continue;
        }
        if(preg_match($stm_forbin,$line,$matches)){ // foreach
            if($forcnt>0){
                array_push($fortxt,$line);
            }else{
                $forkey = $matches[1];
                $forlst = $matches[2];
            }
            $forcnt ++;
            continue;
        }
        // line
        if($forcnt >0){ // in foreach
            array_push($fortxt,$line);
        }else {
            if (preg_match_all($var_regexp, $line, $matches, PREG_SET_ORDER)){ //var
                foreach ($matches as $val) {
                    $line = str_replace($val[0], $keyval[$val[1]], $line);
                }
            }
            array_push($result,$line);
        }
    }
    return $result;
}
?>