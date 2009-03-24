<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

$r_uid  = getNoMagicRequest('UID');
$r_site = isset($_SERVER['HTTP_X_FORWARDED_HOST'])?$_SERVER['HTTP_X_FORWARDED_HOST']:$_SERVER['HTTP_HOST'];
$art_ls = getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/article/total/item.htm');
$gal_ls = getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/indexer/gallery/total/item.htm');
$ntc_ls = getFileVars(PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/00000000000000.htm');
//
$templetDir = PATH_ROOT.'a9w3-engine/util/templet/';
$destineDir = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/sitemap/';

// sitemap
$templet = array(
    'sitemap.xml',
    'sitemap-article.xml',
    'sitemap-gallery.xml',
    'sitemap-notice.xml'
);
$keyvals = array(
    array('site'=>$r_site,'a9user'=>$r_uid),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>$art_ls),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>$gal_ls),
    array('site'=>$r_site,'a9user'=>$r_uid,'index_pids'=>$ntc_ls)
);
$cnt = count($templet);
for($i=0;$i<$cnt;$i++){
    $tmpm = mergeTemplet(file($templetDir.$templet[$i]),$keyvals[$i]);
    if(!writeFile($destineDir.$templet[$i],implode($tmpm),'w')){
    echo RKEY_UNKOWN;
    exit;
    }
}

// rss and atom
$df_2822 ='D, d M Y H:i:s e';
$df_atom ='Y-m-d\TH:i:sP';
if(version_compare(PHP_VERSION,"5.1.3")<0){ // <5.1.3
    $df_2822 ='D, d M Y H:i:s \G\M\T';
    $df_atom ='Y-m-d\TH:i:s+00:00';
}

$rss_time = date($df_2822); // Sat, 07 Sep 2002 00:00:01 GMT @ DATE_RFC2822
$atm_time = date($df_atom);    // 2003-12-13T18:30:02+01:00 @ DATE_ATOM
$all_item = array();

foreach($art_ls as $pid){ // article
    $hdfl = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/article/'.$pid.'/head.htm';
    $kval = readKeyValues($hdfl);
    $mtme = filemtime($hdfl);
    $item = array(
        'type'      =>'article',
        'title'     =>htmlspecialchars($kval['title']),
        'brief'     =>htmlspecialchars($kval['brief']),
        'label'     =>'article '.htmlspecialchars($kval['label']),
        'mtime_rss' =>date($df_2822,$mtme),
        'mtime_atom'=>date($df_atom,$mtme),
        'ulink'     =>'a9w3-auhome/'.$r_uid.'/article/'.$pid.'/body.htm'
    );
    array_push($all_item,$item);
}
foreach($gal_ls as $pid){ // gallery
    $hdfl = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$pid.'.htm';
    $kval = readKeyValues($hdfl);
    $mtme = filemtime($hdfl);
    $item = array(
        'type'      =>'gallery',
        'title'     =>htmlspecialchars($kval['brief']),
        'brief'     =>'pixel:'.$kval['pixel'].' size:'.$kval['sizeb'].' type:'.$kval['ftype'],
        'label'     =>'gallery '.htmlspecialchars($kval['label']),
        'mtime_rss' =>date($df_2822,$mtme),
        'mtime_atom'=>date($df_atom,$mtme),
        'ulink'     =>'a9w3-auhome/'.$r_uid.'/gallery/data/'.$pid.'.'.$kval['ftype']
    );
    array_push($all_item,$item);
}
foreach($ntc_ls as $pid){ // notice
    $hdfl = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$pid.'/head.htm';
    $kval = readKeyValues($hdfl);
    $mtme = filemtime($hdfl);
    $item = array(
        'type'      =>'notice',
        'title'     =>htmlspecialchars($kval['title']),
        'brief'     =>htmlspecialchars($kval['brief']),
        'label'     =>'notice',
        'mtime_rss' =>date($df_2822,$mtme),
        'mtime_atom'=>date($df_atom,$mtme),
        'ulink'     =>'a9w3-auhome/'.$r_uid.'/helpers/notice/'.$pid.'/body.htm'
    );
    array_push($all_item,$item);
}

$templet = array(
    'atom.xml',
    'rss.xml'
);
$keyvals = array(
    array('site'=>$r_site,'a9user'=>$r_uid,'time'=>$atm_time,'item_list'=>$all_item),
    array('site'=>$r_site,'a9user'=>$r_uid,'time'=>$rss_time,'item_list'=>$all_item)
);

$cnt = count($templet);
for($i=0;$i<$cnt;$i++){
    $tmpm = mergeTemplet(file($templetDir.$templet[$i]),$keyvals[$i]);
    if(!writeFile($destineDir.$templet[$i],implode($tmpm),'w')){
    echo RKEY_UNKOWN;
    exit;
    }
}
# end
echo RKEY_SUCCESS;

// trace stat
require_once('writer-tracer.php');
/* helper */
function getFileVars($fn){
    $text = file_get_contents($fn);
    return preg_split("/[\r\n]+/",trim($text));
}
function mergeTemplet($templet,$keyval){
    $var_regexp = '/\$\{([\w:\d]+)\}/';
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
                    if(strpos($val[1],':')>0){
                        $objs = explode(':', $val[1]);
                        $line = str_replace($val[0], $keyval[$objs[0]][$objs[1]], $line);
                    }else{
                        $line = str_replace($val[0], $keyval[$val[1]], $line);
                    }
                }
            }
            array_push($result,$line);
        }
    }
    return $result;
}
?>