<?php
require_once('common.php');
checkRequestUID();

session_start();
unset($_SESSION[SKEY_UID]);
unset($_SESSION[SKEY_UTIME]);
unset($_SESSION[SKEY_UMODE]);

echo RKEY_SUCCESS;
?>