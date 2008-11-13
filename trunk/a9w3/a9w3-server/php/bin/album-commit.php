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

// alias
$r_uid  = $_REQUEST['UID'];
$r_pid  = $_REQUEST['PID'];
$r_label = $_REQUEST['LABEL'];
$r_brief = $_REQUEST['BRIEF'];
$r_file  = $_FILES['FILE'];

// 
$newFields = array(
    'label'=>preg_split('/[\s,]+/',trim($r_label)),
    'ctime'=>'',
    'mtime'=>'',
    'ftype'=>'',
    'pixel'=>'',
    'sizeb'=>'',
    'brief'=>text2line(trim($r_brief))
);
$isNew = false;
if(empty($r_pid)){ // new one
    $isNew = true;
	require_once('common-upload.php');
    checkUploadFileOnly($r_file['name']);
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
	if($r_file['type'] == 'image/pjpeg'){
    	$im = imagecreatefromjpeg($r_file['tmp_name']);
	}elseif($r_file['type'] == 'image/x-png'){
	    $im = imagecreatefrompng($r_file['tmp_name']);
	}elseif($r_file['type'] == 'image/gif'){
	    $im = imagecreatefromgif($r_file['tmp_name']);
	}
	
	if(empty($im)){
		if (!copy(PATH_ROOT.'a9w3-engine/data/image/default-album-mini.jpg', $g_dir.'mini/'.$r_pid.'.jpg')) {
		    echo RKEY_ACCDENY;
	    	exit;
		}
		$newFields['pixel']='unknown';
	}else{
	    $width  = imagesx($im);
	    $height = imagesy($im);
        $newFields['pixel']=$width.'*'.$height;
        
	    $maxwidth = 120;
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
	        imagejpeg($newim,$g_dir.'mini/'.$r_pid.'.jpg');
	        imagedestroy ($newim);
	    }else{
	        imagejpeg ($im,$g_dir.'mini/'.$r_pid.'.jpg');
	    }
	}
	
	// save image
	$newFields['ftype'] = getExtendFileName($r_file['name']);
	$newFields['sizeb'] = formatSize($r_file['size']);
    $newFields['mtime'] = date('Y-m-d H:i:s');
    $newFields['ctime'] = $newFields['mtime'];
    
	if ($r_file['error'] !== UPLOAD_ERR_OK
	||	move_uploaded_file($r_file['tmp_name'], $g_dir.'data/'.$r_pid.'.'.$newFields['ftype']) === false){
   	    echo RKEY_ACCDENY;
	    exit;
	}
    
    // add index
    require_once('common-indexer.php');
    if(!appendIndexToTotal(IDX_GALLERY,$r_uid,$r_pid,$r_label)
    || !appendIndexToMonth(IDX_GALLERY,$r_uid,$r_pid,$r_label)
    || !appendIndexToLabel(IDX_GALLERY,$r_uid,$r_pid,$r_label,$newFields['label'])){
        echo RKEY_UNKOWN;
        exit;
    }
}else{
    $isNew = false;
    $dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm';
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}+$/', $r_pid)
    || !is_file($dst)){
        echo RKEY_ACCDENY;
        exit;
    }
    // check field changement
    $oldFields = array();
    foreach(file($dst) as $line){
        $pos = strpos($line,'=');
        if($pos !==false){
            $oldFields[substr($line,0,$pos)] = trim(substr($line,$pos+1));
        }
    }
    $changed = false;
    $chkval = array('brief');
    foreach($chkval as $k){
        if(!array_key_exists($k,$oldFields)
        || $oldFields[$k] !== $newFields[$k]){
            $changed = true;
        }
    }
    $k = 'label';
    if(!array_key_exists($k,$oldFields)){
        $changed = true;
    }else{
        require_once('common-indexer.php');
        $fval = preg_split('/[\s,]+/',$oldFields[$k]);
        foreach($newFields[$k] as $v){ // append
            if(array_search($v,$fval) === false){
                if(appendIndexToLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
        foreach($fval as $v){ // remove
            if(array_search($v,$newFields[$k]) === false){
                if(removeIndexFromLabel(IDX_ADDRESS,$r_uid,$r_pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
    }
    if($changed){
        $newFields['pixel'] = $oldFields['pixel'];
        $newFields['ftype'] = $oldFields['ftype'];
        $newFields['sizeb'] = $oldFields['sizeb'];
        $newFields['ctime'] = $oldFields['ctime'];
        $newFields['mtime'] = date('Y-m-d H:i:s');
    }else{
        echo RKEY_SUCCESS;
        exit;
    }
}

$txt  = '
label='.implode(' ',$newFields['label']).'
ctime='.$newFields['ctime'].'
mtime='.$newFields['mtime'].'
ftype='.$newFields['ftype'].'
pixel='.$newFields['pixel'].'
sizeb='.$newFields['sizeb'].'
brief='.$newFields['brief'];

$dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm';
if(!writeFile($dst,trim($txt),'w')){
    echo RKEY_UNKOWN;
    exit;
}
if($isNew){ //new
    echo $r_pid;
}else{
    echo RKEY_SUCCESS;
}
?>