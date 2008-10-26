<?php
require_once('common.php');
checkRequestUID();

session_start();
$_SESSION[SKEY_IMGSN.$_REQUEST['UID']]=genImageSn();

// function
function genImageSn()
{   
	$width=70;
    $height=20;
	$im=imagecreate($width,$height);
	imagecolorallocate($im,248,248,255);

	for($i=0;$i<100;$i++)
    {
	    $pointColor=imagecolorallocate($im,rand(0,255),rand(0,255),rand(0,255));
	    imagesetpixel($im,rand(0,100),rand(0,30),$pointColor);
    }
	$borderColor=imagecolorallocate($im,79,79,79);
    imagerectangle($im,0,0,$width-1,$height-1,$borderColor);
    
	for($i=0;$i<2;$i++)
    {
	    $c1=imagecolorallocate($im,rand(0,255),rand(0,255),rand(0,255));
        $c2=imagecolorallocate($im,rand(0,255),rand(0,255),rand(0,255));
        $style=array ($c1,$c2,$c1,$c2,$c1,$c2,$c1,$c2,$c1,$c1,$c2,);
        imagesetstyle($im, $style);
        imageline($im, rand(0,$width), rand(0,$height),rand(0,$width), rand(0,$height), IMG_COLOR_STYLED);
    }

	$valiText='123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$valiNum=5;
	$valiColor=array
	(
		0=>array('0','0','139'),
		1=>array('0','139','0'),
		2=>array('0','139','139'),
		3=>array('139','0','0'),
        4=>array('139','0','139')
	);
	$c=count($valiColor);
    
	$fontX=6;
	$fontY=4;
	$fontM=8;
    
    $sn = '';
	for($i=0;$i<$valiNum;$i++)
	{
		$font=substr($valiText,rand(0,strlen($valiText)-1),1);
		$index=rand(0,$c-1);
		$r=$valiColor[$index][0];
		$g=$valiColor[$index][1];
		$b=$valiColor[$index][2];
		$fontColor=imagecolorallocate($im,$r,$g,$b);
		$charIndex=imagechar($im,rand(3,5),$fontX,rand(1,$fontY),$font,$fontColor);
		$fontX+=(imagefontwidth($charIndex)+$fontM);
		$sn.=$font;
	}
	
    header('Content-type: image/png');
	imagepng($im);
	imagedestroy($im);
    
    return $sn;
}
?>