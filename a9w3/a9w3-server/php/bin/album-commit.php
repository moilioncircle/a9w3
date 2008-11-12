<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// PID|CODE (UID,PID|FILE,[LABEL],BRIEF)
if(empty($_REQUEST['BRIEF'])
||(empty($_REQUEST['PID']) && empty($_FILES['FILE']))
||(!empty($_REQUEST['PID']) && !empty($_FILES['FILE']))){
    echo RKEY_ACCDENY;
    exit;
}

$r_uid  = $_REQUEST['UID'];
if(!empty($_REQUEST['PID'])){ // existed one
	if(!preg_match('/^[0-9]{4}\/[0-9]{13}+$/', $_REQUEST['PID'])
	|| !is_file(PATH_ROOT.'a9w3-auhome/'.$_REQUEST['UID'].'/gallery/info/'.$_REQUEST['PID'].'.htm')){
	    echo RKEY_ACCDENY;
	    exit;
	}
	$r_pid  = $_REQUEST['PID'];
	
	// save info

}else{
	require_once('common-upload.php');
    checkUploadFileOnly($_FILES['FILE']['name']);
    $r_pid  = date('Y/mdHis');
    $g_dir  = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/';
    
	// check and mkdir
	$p_dir = dirname($r_pid);
	$d_dir = $g_dir.'data/'.$p_dir;
	$i_dir = $g_dir.'info/'.$p_dir;
	$m_dir = $g_dir.'mini/'.$p_dir;
	
	if((!is_dir($d_dir) && !mkdir($d_dir))
	|| (!is_dir($i_dir) && !mkdir($i_dir))
	|| (!is_dir($m_dir) && !mkdir($m_dir))
	|| is_file($g_dir.'info/'.$r_pid.'.htm')){
	    echo RKEY_ACCDENY;
	    exit;
	}

	// save thumb
	if($_FILES['FILE']['type'] == 'image/pjpeg'){
    	$im = imagecreatefromjpeg($_FILES['FILE']['tmp_name']);
	}elseif($_FILES['FILE']['type'] == 'image/x-png'){
	    $im = imagecreatefrompng($_FILES['FILE']['tmp_name']);
	}elseif($_FILES['FILE']['type'] == 'image/gif'){
	    $im = imagecreatefromgif($_FILES['FILE']['tmp_name']);
	}
	
	if(empty($im)){
		if (!copy(PATH_ROOT.'a9w3-engine/data/image/default-album-mini.jpg', $g_dir.'mini/'.$r_pid.'jpg')) {
		    echo RKEY_ACCDENY;
	    	exit;
		}
		$pixel='unknown';
	}else{
		$maxwidth = 120;
	    $width  = imagesx($im);
	    $height = imagesy($im);
	    $pixel=$width.'*'.$height;
	    
	    if($width > $maxwidth){ // resize
	        $ratio    = $maxwidth/$width;
	        $newwidth = $maxwidth;
	        $newheight = $height * $maxwidth/$width;
	        
	        if(function_exists('imagecopyresampled')){
	              $newim = imagecreatetruecolor($newwidth, $newheight);
	              imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);
	        }else{
	              $newim = imagecreate($newwidth, $newheight);
	              imagecopyresized($newim,$im,0,0,0,0,$newwidth,$newheight,$width,$height);
	        }
	        imagejpeg($newim,$g_dir.'mini/'.$r_pid.'jpg');
	        imagedestroy ($newim);
	    }else{
	        imagejpeg ($im,$g_dir.'mini/'.$r_pid.'jpg');
	    }
	}
	
	// save image
	$ftype = getExtendFileName($_FILES['FILE']['name']);
	$sizeb = formatSize($_FILES['FILE']['size']);
	if ($_FILES['FILE']['error'] !== UPLOAD_ERR_OK
	||	move_uploaded_file($_FILES['FILE']['tmp_name'], $g_dir.'data/'.$r_pid.'.'.$ftype) === false){
   	    echo RKEY_ACCDENY;
	    exit;
	}

	// save info
}

?>