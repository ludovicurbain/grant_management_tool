<?php

function import_grant_management_tool($p){
	$p['data_types']=json_decode($p['import_plan'][0]['config']);
	for($i=0;$i<count($p['data_types']);$i++){
		if(is_import_file_missing($p['data_types'][$i],$p)){
			continue;
		}
		$method='import_'.$p['data_types'][$i];
		$method($p,'tmp_'.$p['data_types'][$i]);
	}
	return 'success';
}

function import_stage($p,$table_name){
	$x=q("SELECT * FROM ".$table_name);
	print_r($x);
}


?>