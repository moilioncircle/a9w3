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
	$infokey = array(
		'admin'   => 'admin.login admin.cpass admin.sitefp',
		'address' => 'links.commit links.delete',
		'article' => 'paper.edit.commit paper.edit.delete',
		'gallery' => 'album.edit.commit album.edit.delete',
		'board'   => 'board.commit board.delete',
		'notice'  => 'notice.edit.commit notice.edit.delete'
	);
	$infokv = array();
	$mtime = date('Y-m-d H:i:s');
	foreach($infokey as $k => $v){
		$infokv[$k.'.mtime']=$mtime;
		$infokv[$k.'.count']='0';
	}
	foreach($infokey as $k => $v){
		if(strpos($v,$server_key) !== false){
			$keymtime = $k.'.mtime';
			$keycount = $k.'.count';
			break;
		}
	}
	
	if(!empty($keymtime)){
	    $infofile = PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/helpers/status/info/stat.htm';
	    foreach(file($infofile) as $line){
	        $kv = explode("=", $line);
	        if(count($kv) !=2) continue;
	        if($kv[0] === $keymtime){
	            continue;
	        }else if($kv[0] === $keycount){
	            $infokv[$kv[0]] = intval(trim($kv[1]))+1;
	        }else{
	            $infokv[$kv[0]] = trim($kv[1]);
	        }
	    }
	    // write file
	    $lines='';
	    foreach($infokv as $k => $v){
	        $lines.=$k.'='.$v."\n";
	    }
	    writeFile($infofile,trim($lines),'w');
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