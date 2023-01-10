<?php
include_once "/var/www/generic/deny/erp/import.php";

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

function import_people(&$p){
	$table_name='tmp_people';
	$old_count=qp("SELECT count(p.id) FROM people p;",array())[0]['count'];
	create_tmp_table_from_json($p['post']['content'],$table_name);
	import_people_generic($p,$table_name);
	$data_count=count(json_decode($p['post']['content'],true));
	$new_count=qp("SELECT count(p.id) FROM people p;",array())[0]['count'];

	$created=$new_count-$old_count;

	$updated=$data_count-$created;

	return array('created'=>$created,'updated'=>$updated);
}

function create_tmp_table_from_json($data,$table_name){
	$data=json_decode($data,true);
	$tmp_table=array('table_name'=>$table_name,'content'=>array());
	$headers=array_keys($data[0]);
	$clean_headers=array();	
	for($i=0;$i<count($headers);$i++){
		$clean_headers[]=str_clean($headers[$i]);	
		$tmp_table['content'][$clean_headers[$i]]='text';
	}
	create_tmp_table($tmp_table);
	for($i=0;$i<count($data);$i++){
		for($j=0;$j<count($headers);$j++){
			$data[$i][$clean_headers[$j]]=$data[$i][$headers[$j]];
			if($headers[$j]!==$clean_headers[$j]){	
				unset($data[$i][$headers[$j]]);
			}
		}
	}
	insert_into_tmp_table($data,$tmp_table['table_name']);
}

function import_people_generic($p,$table_name){
	qp(
		"
		UPDATE people p
		SET
			firstname=t.firstname,
			lastname=t.lastname,
			phone=t.phone,
			fte_percentage=t.fte_percentage::float,
			benefit_rate=t.benefit_rate::float
		FROM
			people p2
		INNER JOIN
			".$table_name." t
		ON
			t.email=p2.email
		WHERE
			p.id=p2.id; ",array()
	);

	qp(
		"INSERT INTO people(firstname,lastname,email,phone,fte_percentage,benefit_rate)
		SELECT
			t.firstname,
			t.lastname,
			t.email,
			t.phone,
			t.fte_percentage::float,
			t.benefit_rate::float
		FROM ".$table_name." t
		LEFT JOIN
			(
				SELECT p2.id,p2.email FROM people p2 GROUP BY p2.id
			) p
		ON p.email=t.email
		WHERE p.id IS NULL;",array()
	);

	qp(
		"INSERT INTO r_people_degree_type(id_1,id_2)
		SELECT
			p.id,
			dt.id
		FROM ".$table_name." t
		INNER JOIN people p ON p.email=t.email
		INNER JOIN degree_type dt ON dt.description=t.terminal_degree
		LEFT JOIN r_people_degree_type rpdt ON rpdt.id_1=p.id
		WHERE rpdt.id_2 IS NULL;",array()
	);

	qp(
		"INSERT INTO salary(start_date,amount,old_id)
		SELECT
			EXTRACT(EPOCH FROM NOW()),
			t.salary,
			p.id
		FROM ".$table_name." t
		INNER JOIN people p ON p.email=t.email
		LEFT JOIN r_people_salary rps ON rps.id_1=p.id
		WHERE rps.id_2 IS NULL;",array()
	);

	qp(
		"INSERT INTO r_people_salary(id_1,id_2)
		SELECT
			p.id,
			s.id
		FROM ".$table_name." t
		INNER JOIN people p ON p.email=t.email
		INNER JOIN salary s ON s.old_id=p.id
		LEFT JOIN r_people_salary rps ON rps.id_1=p.id
		WHERE rps.id_2 IS NULL;",array()
	);
}
?>