<?php
function checkRequestUID(){
    if(empty($_REQUEST["UID"])) return false;
    return is_dir("../../../a9w3-auhome/".$_REQUEST["UID"]);
}
?>