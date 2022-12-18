<?php

include_once '/var/www/grant_management_tool/deny/stage.php';
include_once '/var/www/generic/deny/erp/import.php';
include_once '/var/www/grant_management_tool/deny/club_import.php';

function specific_pre_edit(&$p){
	$return="";	
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
	return $return;
}

function specific_post_edit(&$p){
	$return="";
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
	return $return;
}

function specific_pre_delete(&$p){
	$return='';
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
}

function specific_post_relate(&$p){
	switch($p['relation'][0]["name"]){
		default:
			break;
	}
	return "success";
}
?>