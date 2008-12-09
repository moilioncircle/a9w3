<?php
// security check
if(!empty($_SERVER['REQUEST_URI'])){
    echo "can not run on server side";
    exit;
}
//
$self = __FILE__;
for($i=0;$i<4;$i++) $self = dirname($self);
define('PATH_ROOT',$self.'/');
parseCommand($argv);

//////////////////////// Function ///////////////////////////
function parseCommand($argv){
    if(count($argv)<2){command_help();exit;}
    //
    $cmndarg = array();
    $options = array();
    // parse arguments
    foreach($argv as $k=>$v){
        if($k<2) continue; // skip 
        if(strpos($v,'-') === 0){ // options
            $es = strpos($v,'=');
            if($es){
                $ok=substr($v,1,$es-1);
                $vl=substr($v,$es+1);
                $options[$ok]=$vl;
            }else{
                $ok = substr($v,1);
                $options[$ok]=$ok;
            }
        }else{ // arguments
            array_push($cmndarg, $v);
        }
    }
    // execute command
    switch($argv[1]){
        case 'sitefp':
            command_sitefp($cmndarg,$options);
            break;
        case 'difffp':
            command_difffp($cmndarg,$options);
            break;
        case 'ftpxfp':
            command_ftpxfp($cmndarg,$options);
            break;
        case 'help':
        default:
            command_help();
    }
} 
//////////////////////// Command ///////////////////////////
function command_sitefp($cmndarg,$options){
    if(empty($cmndarg[0]) || !is_dir(PATH_ROOT.'a9w3-auhome/'.$cmndarg[0])){
        echo 'bad parameter: uid';
        exit;
    }
    $treeDir = array(
        PATH_ROOT.'index.htm',
        PATH_ROOT.'a9w3-engine',
        PATH_ROOT.'a9w3-server',
        PATH_ROOT.'a9w3-auhome/'.$cmndarg[0]
    );
    
    $siteFp = new SiteFp(PATH_ROOT);
    if(!empty($options['in'])){
	    $siteFp->setInclude($options['in']);
    }
    if(!empty($options['ex'])){
	    $siteFp->setExclude($options['ex']);
    }
    foreach($treeDir as $v){
        echo $siteFp->makeFp($v);
    }
}
function command_difffp($cmndarg,$options){
    if(empty($cmndarg[0])||empty($cmndarg[1])){
        echo 'argument missed';
        exit;
    }
    if(!is_file($cmndarg[0])||!is_file($cmndarg[1])){
        echo 'file not found :'.$cmndarg[0].' or '.$cmndarg[1];
        exit;
    }
    if($cmndarg[0] == $cmndarg[1]) return;
    
    $inFile = array_key_exists('in', $options)?explode(',',$options['in']):array();
    $exFile = array_key_exists('ex', $options)?explode(',',$options['ex']):array();
    
    $lfplines = fpfile2array($cmndarg[0],$inFile,$exFile);
    $rfplines = fpfile2array($cmndarg[1],$inFile,$exFile);
    
    //token | filename | lsize | ltime | rsize | rtime
    $tk_lcl = '>>';// >> : local  only / !md5 && ltime>=rtime
    $tk_rmt = '<<';// << : remote only / !md5 && ltime<rtime
    $tk_eql = '==';// == : equal (md5 && size)
    $tk_unk = '<>';// <> : unknown,none of above
    $tk_spl = '|';
    
    //based on local
    $showEq = array_key_exists('eq', $options);
    foreach($lfplines as $fn=>$op){
        if(!array_key_exists($fn,$rfplines)){
            echo $tk_lcl.$tk_spl.       // token
                 $fn.$tk_spl.           // filename
                 $op['size'].$tk_spl.   // lsize
                 $op['time'].$tk_spl.   // ltime
                 $tk_spl.               // rsize
                 "\n";                  // rtime
        }else{
            $rop = $rfplines[$fn];
            $tk_its = $tk_unk;
            if($op['md5'] !== $rop['md5']){
                $tk_its = $op['time'] >= $rop['time']?$tk_lcl:$tk_rmt;
            }else{
                if($op['size'] === $rop['size']){
                    if(!$showEq) continue;
                    $tk_its=$tk_eql;
                }
            }
            echo $tk_its.$tk_spl.       // token
                 $fn.$tk_spl.           // filename
                 $op['size'].$tk_spl.   // lsize
                 $op['time'].$tk_spl.   // ltime
                 $rop['size'].$tk_spl.  // rsize
                 $rop['time']."\n";     // rtime
        }
    }
    
    //remote only
    foreach($rfplines as $fn=>$op){
        if(!array_key_exists($fn,$lfplines)){
            echo $tk_rmt.$tk_spl.     // token
                 $fn.$tk_spl.         // filename
                     $tk_spl.         // lsize
                     $tk_spl.         // ltime
                 $op['size'].$tk_spl. // rsize
                 $op['time']."\n";    // rtime
        }
    }
}
function command_ftpxfp($cmndarg,$options){
    if(count($cmndarg)<2){
        echo 'bad parameter: difffp';
        exit;
    }
    
    $fpfile = $cmndarg[0];
    if(!is_file($fpfile)){
        echo 'file not found: '.$fpfile;
        exit;
    }
    
    $op_put = 'put';
    $op_get = 'get';
    $op_del = 'del';
    $op_nop = 'nop';
    
    $lcl_opr = $op_put;
    $rmt_opr = $op_get;
    
    if(array_key_exists('lcl', $options)){
        $op = $options['lcl'];
        if($op == $op_put
        || $op == $op_del
        || $op == $op_nop){
            $lcl_opr = $op;
        }else{
            echo 'bad parameter -lcl:'.$op;
            exit;
        }
    }
    if(array_key_exists('rmt', $options)){
        $op = $options['rmt'];
        if($op == $op_get
        || $op == $op_del
        || $op == $op_nop){
            $rmt_opr = $op;
        }else{
            echo 'bad parameter -rmt:'.$op;
            exit;
        }
    }
    
    $tk_put = '>>';// >> : upload/del
    $tk_get = '<<';// << : download/del
    $tk_spl = '|';
    //loop in fp file
    $put_arr = array();
    $get_arr = array();
    foreach(file($fpfile) as $line){
        $pts = explode($tk_spl,$line);
        if(count($pts) != 6){
            echo 'skipe line:'.$line."\n";
            continue;
        }
        if($pts[0] === $tk_put && $lcl_opr != $op_nop){
            $put_arr[$pts[1]]=empty($pts[5]);
        }else if($pts[0] === $tk_get && $rmt_opr != $op_nop){
            $get_arr[$pts[1]]=empty($pts[3]);
        }else{
            echo 'skipe line:'.$line."\n";
        }
    }
	if(empty($put_arr) && empty($get_arr)){
        echo 'difffp list is empty,skip it';
        exit;
    }
    
    $ftpstr = $cmndarg[1];//"user[:passwd]@server[:port] a9w3"
    $ps_at = strpos($ftpstr,'@');
    if($ps_at>0){
        $user=substr($ftpstr,0,$ps_at);
        $ps_ps=strpos($user,':');
        if($ps_ps){
            $pass=substr($user,$ps_ps+1);
            $user=substr($user,0,$ps_ps);
        }
        echo 'ftp user: '.$user.(empty($pass)?'(no passwd)':'(with passwd)')."\n";
        $ftpstr= substr($ftpstr,$ps_at+1);
    }else{
        echo 'bad parameter: ftp_server_string';
        exit;
    }

    $port=21;
    $host=$ftpstr;
    $ps_at = strpos($host,':');
    if($ps_at>0){
        $port=substr($host,$ps_at+1);
        $host=intval(substr($host,0,$ps_at));
    }
    if(empty($host)||empty($port)){
    	echo 'bad parameter: ftp_server_string';
    	exit;
    }
    echo 'ftp host: '.$host.':'.$port."\n";
      
    // open ftp
	$conn_id = ftp_connect($host,$port);
	if(!ftp_login($conn_id,$user,$pass)){
		echo 'failed to login';
		exit;
	}
	
	// check home
	echo 'current pwd: '.ftp_pwd($conn_id)."\n";
	if(!empty($cmndarg[2])){
		echo 'change to a9w3 home: '.$cmndarg[2]."\n";
		if(!ftp_chdir($conn_id, $cmndarg[2])){
			echo 'failed to change to a9w3home dir';
			exit;
		}
	}
    // do put
    foreach($put_arr as $k=>$v){
        $lclfile = PATH_ROOT.$k;
        if($v && $lcl_opr == $op_del){//del
            $ok = unlink($lclfile);
            echo ($ok?'OK ':"ERR").' LCL_DEL '.$k."\n";
        }else{//put
            // check and make dir on remote
            $ok = ftp_put($conn_id, $k, $lclfile, FTP_BINARY);
            if(!$ok){ // maybe need mkdir
                $tkpt = '/';
                $crpt = '';
                foreach(explode($tkpt,dirname($k)) as $dn){
                    if(empty($dn)) continue;
                    $crpt.= $dn.$tkpt;
                    $ok = @ftp_mkdir($conn_id, $crpt);
                }
                if($ok){
                    $ok = ftp_put($conn_id, $k, $lclfile, FTP_BINARY);
                }
            }
            echo ($ok?'OK ':"ERR").' LCL_PUT '.$k."\n";
        }
    }
    // do get
    foreach($get_arr as $k=>$v){
        $lclfile = PATH_ROOT.$k;
        if($v && $rmt_opr == $op_del){//del
            $ok = ftp_delete($conn_id, $k);
            echo ($ok?'OK ':"ERR").' RMT_DEL '.$k."\n";
        }else{//get
            // check and make dir on local
            if(!is_dir(dirname($lclfile))){
                $tkpt = '/';
                $crpt = PATH_ROOT;
                foreach(explode($tkpt,dirname($k)) as $dn){
                    if(empty($dn)) continue;
                    $crpt.= $dn.$tkpt;
                    if(!is_dir($crpt)){
                        mkdir($crpt);
                    }
                }
            }
            $ok = ftp_get($conn_id, $lclfile,$k,FTP_BINARY);
            echo ($ok?'OK ':"ERR").' RMT_GET '.$k."\n";
        }
    }
	// close ftp
	ftp_close($conn_id);
    
}
function command_help(){
    echo "
    a simple a9w3 site manager to maintain site at local side.
    
    usage:
        php -f ".basename(__FILE__) ." command [command-option]
    command:
        * sitefp uid
            make local site fingerprint of a9user.
            uid         a9user id.
            -in=p1,p2   included file pattens(regexp). ','-splited.
            -ex=p1,p2   excluded file pattens(regexp). ','-splited.
        * difffp [option] lfp rfp
            make difffp by fingerprint between local and remote.
            lfp         local fingerprint.
            rfp         remote fingerprint.
            -eq         show equal-files(default no)
            -in=p1,p2   included file pattens(regexp). ','-splited.
            -ex=p1,p2   excluded file pattens(regexp). ','-splited.
        * ftpxfp [option] difffp user[:passwd]@server[:port] a9w3
            useing ftp to put/get/del file on local/remote by difffp.
            difffp      made by 'difffp'.
            user        ftp login user.
            passwd      ftp password.
            server      ftp server.
            port        ftp server port,default is 21.
            a9w3        the a9w3 home path on server.
            -lcl=op     op=put|del|nop ,put by default ('>>' operation).
                           put: put every file to remote.
                           del: del local file which not exist at remote.
                           nop: skip all.
            -rmt=op     op=get|del|nop ,get by default ('<<' operation).
                           get: download every file from remote.
                           del: del remote file which not exist at local.
                           nop: skip all.
        * help
            what you see just now.
    ";
}

//////////////////////// Helper ///////////////////////////
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

function fpfile2array($fn,$in,$ex){
    $fpa = array();
    
    if($in){
        foreach($in as $k=>$v){
            if($v){
                $in[$k]='@'.str_replace('@','\@',$v).'@';
            }
        }
    }
    if($ex){
        foreach($ex as $k=>$v){
            if($v){
                $ex[$k]='@'.str_replace('@','\@',$v).'@';
            }
        }
    }
    
    foreach(file($fn) as $ln){
        $pts = explode('|',trim($ln));
        if(count($pts) != 4) continue;
        
        if($in){
            $gt = false;
            foreach($in as $p){
                $gt = preg_match($p,$pts[0]);
                if($gt) break;
            }
            if(!$gt) continue;
        }
        
        if($ex){
            $gt = true;
            foreach($ex as $p){
                $gt = preg_match($p,$pts[0]);
                if($gt) break;
            }
            if($gt) continue;
        }
        
        $fpa[$pts[0]] = array('size'=>$pts[1],'time'=>$pts[2],'md5'=>$pts[3]);
    }
    return $fpa;
}
?>