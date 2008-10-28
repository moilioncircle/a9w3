<?php
switch($_REQUEST['type']){
    case 'paper':
        break;
    case 'album':
        break;
    default:
        exit;
}

// checkuid
require_once('common.php');
checkRequestUID();

// checkpid


?>