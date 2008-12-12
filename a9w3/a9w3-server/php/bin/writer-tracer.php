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
		INF_ADMIN   => 'admin.login admin.cpass admin.sitefp',
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
	
	foreach($infokey_add as $k => $v){
		if(strpos($v,$server_key) !== false
		&& empty($_REQUEST['PID'])){ // new one
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
		updateInfoStat($_REQUEST['UID'],$ikey,$icnt);
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
        'admin.sitefp'
	);
	
	// key YmdHis $UID $PID $IP\n
    $r_pid = empty($_REQUEST['PID'])?"---":$_REQUEST['PID'];
	foreach($eventkey as $v){
		if(strpos($v,$server_key) !== false){
			$evenline = date('YmdHis').'|'.$v.'|'.$r_pid.'|'.$_SERVER['REMOTE_ADDR'];
			break;
		}
	}
	
	if(!empty($evenline)){
		// event
		writeFile(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/status/write/event.htm',$evenline."\n",'a+');
		
		// top30
		$topfl = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/status/write/top30.htm';
		if(!is_file($topfl)){
			writeFile($topfl,$evenline,'w');
		}else{
			$top30 = file($topfl);
			$cntln = count($top30);
			$offst = $cntln>=30?$cntln-30-1:0;
			$topnw = array();
			for($i=$offst;!empty($top30[$i]);$i++){
				array_push($topnw, trim($top30[$i]));
			}
			array_push($topnw,$evenline);
			writeFile($topfl,implode("\n",$topnw),'w');
		}
	}
}

//execute
autoTrace();
?>