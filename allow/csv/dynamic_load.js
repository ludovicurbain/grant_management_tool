var dynamic_load_files={};

dynamic_load_files.generic_css=[
	'ui_tabs.css'
];

dynamic_load_files.local_css=[
	'csv/index.css',
	'index.css',
	'table_list.css'
];

dynamic_load_files.specific_css=[];

dynamic_load_files.generic_js=[
	'lib/jquery-1.11.1.min.js',
	'lib/jquery.tablesorter.min.js',
	'lib/jquery.validate.js',
	'lib/jquery.json-2.2.min.js',
	'gen.js',
	'painters.js',
	'api.js',
	'tree.js',
	'tab.js',
	'popup.js',
	'login.js',
	'lang.js',
	'relation_tab.js',
	'google_auth.js',
	'ui_element.js',
	'ui_elements/table_list.js',
	'ui_elements/ui_tabs.js',
	'fresh.js',
	'item_card.js',
	'uploader.js',
	'tags.js',
	'/lib/papaparse.min.js'
];

dynamic_load_files.local_js=[
	'config.js',
	'csv/index.js'
];

dynamic_load_files.specific_js=[

];



load_css(script_target('/generic/allow/css/'),dynamic_load_files.generic_css);
load_css(script_target('../',true),dynamic_load_files.local_css);
load_css(script_target('../',true),dynamic_load_files.specific_css);

load_scripts(script_target('/generic/allow/js/'),dynamic_load_files.generic_js);
load_scripts(script_target('../',true),dynamic_load_files.local_js);
load_scripts(script_target('../',true),dynamic_load_files.specific_js);



function load_css(target,array){
	for(var i=0;i<array.length;i++){
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = target+array[i];
		$('head').append(link);
	}
}


function load_scripts(target,array,cb){
	for(var i=0;i<array.length;i++){
		var script = document.createElement('script');
		script.src = target+array[i];
		script.async=false;
		document.body.appendChild(script);
		script.onload = function () {
			if(cb){
				cb();
			}
		};
	}
}

function script_target(url,is_local=false){
	var target='';
	if(window.location.href.indexOf('file:///')!=-1){
		if(!is_local){
			target='https://www.warpcore.io';
		}
	}
	return target+url;
}

