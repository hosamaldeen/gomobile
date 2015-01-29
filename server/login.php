<?php
$return=array();
if(@$_GET['username']=="admin" && @$_GET['password']=="admin")
    $return = array("login"=>true);
else
    $return = array("login"=>false);
echo json_encode($return);
?>