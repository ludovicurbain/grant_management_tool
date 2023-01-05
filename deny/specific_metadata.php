<?php

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


function get_people_tree(){
	$people=qp("SELECT
		p1.firstname||' '||p1.lastname AS child,
		p1.id AS child_id,
		p1.old_id,
		p2.firstname||' '||p2.lastname AS parent_cat,
		p2.id AS parent_id,
		p1.*
	FROM
		".rights_view('people','read')." p1
	LEFT JOIN
		r_people_people r1 ON r1.id_2=p1.id
	LEFT JOIN 
		people p2 ON r1.id_1=p2.id
	GROUP BY
		p1.id,p1.firstname,p1.lastname,p2.id,p2.firstname,p2.lastname,p1.old_id
	ORDER BY
		p1.lastname",array());	
	return array('people'=>$people);
}
?>