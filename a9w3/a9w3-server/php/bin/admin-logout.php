<?php
require_once("common.php");
checkRequestUID();

session_start();
unset($_SESSION[SKEY_ADMIN.$_REQUEST["UID"]]);
echo RKEY_SUCCESS;
?>