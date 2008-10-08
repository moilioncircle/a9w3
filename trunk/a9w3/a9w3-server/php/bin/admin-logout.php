<?php
require_once("common.php");
checkRequestUID();

session_start();
unset($_SESSION[SKEY_ADMIN.$_REQUEST["UID"]]);
unset($_SESSION[SKEY_IMGSN.$_REQUEST["UID"]]);

echo RKEY_SUCCESS;
?>