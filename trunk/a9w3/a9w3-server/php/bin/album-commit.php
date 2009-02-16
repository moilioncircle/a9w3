<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

// PID|CODE (UID,PID|FILE*,[LABEL],BRIEF)
if(empty($_REQUEST['BRIEF'])
||(empty($_REQUEST['PID']) && empty($_FILES['FILE']))
||(!empty($_REQUEST['PID']) && !empty($_FILES['FILE']))){
    echo RKEY_ACCDENY;
    exit;
}

// alias
$r_uid  = getNoMagicRequest('UID');
$r_pid  = getNoMagicRequest('PID');
$r_label = getNoMagicRequest('LABEL');
$r_brief = getNoMagicRequest('BRIEF');

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
    $r_file  = $_FILES['FILE'];
	require_once('common-upload.php');
    checkUploadFileOnly($r_file['name']);
    $r_pid  = getUserDate('Y/mdHis',$r_uid);
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
	    echo RKEY_UNKOWN;
	    exit;
	}

	// save thumb
    $extn = getExtendFileName($r_file['name']);
	if($extn == 'jpg'){
    	$im = imagecreatefromjpeg($r_file['tmp_name']);
	}elseif($extn == 'png'){
	    $im = imagecreatefrompng($r_file['tmp_name']);
	}elseif($extn == 'gif'){
	    $im = imagecreatefromgif($r_file['tmp_name']);
	}
	
	if(empty($im)){
		if (!copy(PATH_ROOT.'a9w3-engine/data/image/default-album-mini.jpg', $g_dir.'mini/'.$r_pid.'.jpg')) {
		    echo RKEY_UNKOWN;
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
    $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
    $newFields['ctime'] = $newFields['mtime'];
    
	if ($r_file['error'] !== UPLOAD_ERR_OK
	||	move_uploaded_file($r_file['tmp_name'], $g_dir.'data/'.$r_pid.'.'.$newFields['ftype']) === false){
   	    echo RKEY_UNKOWN;
	    exit;
	}
    
    // add index
    require_once('common-indexer.php');
    if(!appendIndexToTotal(IDX_GALLERY,$r_uid,$r_pid)
    || !appendIndexToMonth(IDX_GALLERY,$r_uid,$r_pid)
    || !appendIndexToLabel(IDX_GALLERY,$r_uid,$r_pid,$newFields['label'])){
        echo RKEY_UNKOWN;
        exit;
    }
}else{
    $isNew = false;
    $dst = PATH_ROOT.'a9w3-auhome/'.$r_uid.'/gallery/info/'.$r_pid.'.htm';
    if(!preg_match('/^[0-9]{4}\/[0-9]{10}$/', $r_pid)
    || !is_file($dst)){
        echo RKEY_ACCDENY;
        exit;
    }
    // check field changement
    $oldFields = readKeyValues($dst);

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
                if(appendIndexToLabel(IDX_GALLERY,$r_uid,$r_pid,$v)){
                    $changed = true;
                }else{
                    echo RKEY_UNKOWN;
                    exit;
                }
            }
        }
        foreach($fval as $v){ // remove
            if(array_search($v,$newFields[$k]) === false){
                if(removeIndexFromLabel(IDX_GALLERY,$r_uid,$r_pid,$v)){
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
        $newFields['mtime'] = getUserDate('Y-m-d H:i:s',$r_uid);
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

// trace stat
require_once('writer-tracer.php');
?>