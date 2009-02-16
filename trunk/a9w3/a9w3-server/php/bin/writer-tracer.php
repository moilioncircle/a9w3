<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);


function autoTrace(){
    
    $keyurlmap = readKeyValues(PATH_ROOT.'a9w3-server/server.htm');

    $phpself = $_SERVER['PHP_SELF'];
    foreach($keyurlmap as $key => $val){
        if(strpos($phpself, $val) !== false){
            $server_key = $key;
            break;
        }
    }
    
    if(empty($server_key)) return;
    
    /* status info */
    require_once('common-infostat.php');
    $infokey_add = array(
        INF_ADMIN   => 'admin.login admin.cpass admin.sitefp admin.sitemap',
        INF_ADDRESS => 'links.commit',
        INF_ARTICLE => 'paper.edit.commit',
        INF_GALLERY => 'album.edit.commit',
        INF_BOARD   => 'board.commit',
        INF_NOTICE  => 'notice.edit.commit'
    );
    $infokey_sub = array(
        INF_ADMIN   => '',
        INF_ADDRESS => 'links.delete',
        INF_ARTICLE => 'paper.edit.delete',
        INF_GALLERY => 'album.edit.delete',
        INF_BOARD   => 'board.delete',
        INF_NOTICE  => 'notice.edit.delete'
    );

    $ikey = null;
    $icnt = 0;

    // alias
    $r_uid   = getNoMagicRequest('UID');
    $r_pid   = getNoMagicRequest('PID');
    
    foreach($infokey_add as $k => $v){
        if(strpos($v,$server_key) !== false
        && empty($r_pid)){ // new one
            $ikey = $k;
            $icnt = 1;
            break;
        }
    }
    foreach($infokey_sub as $k => $v){
        if(strpos($v,$server_key) !== false){
            $ikey = $k;
            $icnt = -1;
            break;
        }
    }
    
    if(!empty($ikey)){
        updateInfoStat($r_uid,$ikey,$icnt);
    }
    
    /* write event */
    $eventkey = array(
        'paper.data.upload',
        'paper.data.delete',
        'paper.edit.commit',
        'paper.edit.delete',
        'paper.view.tracer',
        'album.edit.commit',
        'album.edit.delete',
        'album.view.tracer',
        'links.commit',
        'links.delete',
        'board.delete',
        'notice.data.upload',
        'notice.data.delete',
        'notice.edit.commit',
        'notice.edit.delete',
        'admin.login',
        'admin.cpass',
        'admin.sitefp',
        'admin.sitemap'
    );
    
    // key YmdHis $UID $PID $IP\n
    foreach($eventkey as $v){
        if(strpos($v,$server_key) !== false){
            $evenline = getUserDate('YmdHis',$r_uid).'|'.$v.'|'.(empty($r_pid)?"---":$r_pid).'|'.$_SERVER['REMOTE_ADDR'];
            break;
        }
    }
    
    if(!empty($evenline)){
        // event
        $maxbs = 1024*500; // 500k
        $inuse = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/status/write/inuse.htm';
        if(filesize($inuse) > $maxbs){
            $index = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/status/write/index.htm';
            $seq = 1;
            $pre = 'wrk';
            foreach(file($index) as $v){
                if(strpos($v, $pre)!==false){
                    $tmp = intval(substr($v,strlen($v), 2));
                    if($seq < $tmp) $seq = $tmp;
                }
            }
            $wrkfile = $pre.($seq<10?'0'.$seq:$seq).'.htm';
            writeFile($index,$wrkfile."\n",'a+');
            rename($inuse, PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/status/write/'.$wrkfile);
        }
        
        writeFile($inuse,$evenline."\n",'a+');
        
        // top10
        $topfl = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/helpers/status/write/top10.htm';
        if(!is_file($topfl)){
            writeFile($topfl,$evenline,'w');
        }else{
            $top10 = file($topfl);
            $cntln = count($top10);
            $maxln = 10;
            $offst = $cntln>=$maxln?$cntln-$maxln+1:0;
            $topnw = array();
            for($i=$offst;!empty($top10[$i]);$i++){
                array_push($topnw, trim($top10[$i]));
            }
            array_push($topnw,$evenline);
            writeFile($topfl,implode("\n",$topnw),'w');
        }
    }
}

//execute
autoTrace();
?>