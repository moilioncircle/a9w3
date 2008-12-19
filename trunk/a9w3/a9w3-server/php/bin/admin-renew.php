<?php
require_once('common.php');
checkRequestUID();
checkUmodePermit(UMODE_WRITER);

echo RKEY_SUCCESS;
?>