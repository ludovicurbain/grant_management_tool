
query_iclass_register['get_import_with_import_plan']=['import','import_plan','files'];
var data_type=[];
var active_data_type=null;

$(document).ready(function(){
	checkLogin();
	$('body').html(standard_login_container()+'<div id=api_answer></div><div id=logoutButton></div>');
	waiting_for['hide_loader_for_real'] = 0;
	$('body').append(paint_loader());
	// $('body').append('<div class="loading_bars"></div>');
});

function on_login(){
	init_lists();
	$('#login_container').hide();
	$('#logoutButton,#api_answer').show();
}

function on_init_lists(){
	// api.search_item(
	// 	{'iclass': 'erp_account','search': ''},
	// 	{'relations' : {'account': cache['rights']['accountid']}},
	// 	function (data) {
			// cache['erp_account'] = data[0];
			event_handlers();
			api.search_item({'iclass':'import_plan','search':''},{},function(data){
				storage['import_plan']=data;
				paint_main();
			});
	// 	}
	// );
}

function paint_main(){
	var tabs=[{'label':'existing_import','name': 'existing_import','fct':'paint_existing_import'},{'label':'new_import','name': 'new_import','fct':'paint_new_import'}]
	var config={
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab','ui_tab_resize','work_order_tabs'],
			'selected_tab_items':'existing_import',
			'model':tabs
		}
	}

	$('body').append('<div class="main">'+create_ui_element(config)+'</div>');
}

function paint_existing_import(){
	var ui_element={'element_class':'table_list','selected_iids':[],'hide_header':true};
	var api_call={'pa':{'m':'run_query','id':'','description':'get_import_with_import_plan','db_id':'this'},'postcontent':{'query_parameters':{}}};
	return create_ui_element({'ui_element':ui_element,'api_call':api_call});
}

function upload_import_file(t){
	show_loader('uploading..')
	active_data_type=t.attr('data_type');

	// if file with data type exist delete file


	var item_card={
		'item':get_empty_item2('files'),
		'relations':{}
	}
	$('body').append('<div class="hidden hidden_item_card">'+create_item_card('files',item_card)+'</div>');
	setTimeout(function(){
		var input_files=$('body').find('input[id="item_card_uploader_"][type="file"]');
		input_files[0]['files']=t[0]['files'];
		input_files.trigger('change');
	},0);
}

function event_handlers(){
	$(document).on('change','select[name="import_plan"]',function(){
		var import_plan=storage_search('import_plan','id',$(this).val());
		data_type=JSON.parse(import_plan['config']);
		// var changes={'description':'Import '+cache['erp_account']['description']+' du '+js_date_to_iso_date(new Date())+' '+ String(new Date().getHours()).padStart(2,0)+':'+String(new Date().getMinutes()).padStart(2,0)};
		var changes={'description':'Import  du '+js_date_to_iso_date(new Date())+' '+ String(new Date().getHours()).padStart(2,0)+':'+String(new Date().getMinutes()).padStart(2,0)};
		api.create_item(
			{'iclass':'import'},
			{
				'changes':changes,
				'relations':{
					'import_plan':import_plan['id'],
					// 'erp_account':cache['erp_account']['id']
				},
			},
			function(import_id){
				changes['id']=import_id;
				storage['import']=[changes];
				import_interface(data_type);
			}
		);
	});

	$(document).on('click','.drop_zone',function(e){$(this).children('input[type="file"]')[0].click();});	
	$(document).on('click','input[type="file"][data_type]',function(e){ e.stopPropagation();});
	$(document).on('click','#import',prepare_import);	
	$(document).on('change','input[type="file"][data_type]',function(){
		if($(this)[0]['files'].length==1){
			$(this).parent('.drop_zone').addClass('drop_zone_has_file');
			upload_import_file($(this));
		}else{
			$(this).parent('.drop_zone').removeClass('drop_zone_has_file');
		}
	});
	
	
	$(document).on(
		'dragenter dragover','.drop_zone',
		function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).addClass('drop_zone_highlight');
		}
	)
	
	$(document).on(
		'dragleave drop','.drop_zone',
		function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).removeClass('drop_zone_highlight');
		}
	)
	
	$(document).on(
		'drop','.drop_zone',
		function(e){		
			e.preventDefault();
			e.stopPropagation();
			if(e.originalEvent.dataTransfer){
				if(e.originalEvent.dataTransfer.files.length==1) {
					$(this).addClass('drop_zone_has_file');
					$(this).children('input[type="file"]')[0]['files']=e.originalEvent.dataTransfer.files;
					upload_import_file($(this).children('input[type="file"]'));
				}else{
					alert('Max one file');
				}
			}
		}
	);


	$(document).on('click','[element_class="tabs"] .ui_tabs_container_tabs>[name]',function(){
		var uuid =$(this).parent().parent().attr('uuid');
		var config = get_ui_element_config(uuid);
		config['ui_element']['selected_tab_items']= $(this).attr('name');
		refresh_ui_element('tabs',uuid);
	});

	$(document).on('click','.table_list_line',edit_import);

}

function paint_new_import(){
	var h=selectValidItemById('import_plan',storage['import_plan'],'','description','Select import plan');
	return h;
}


function import_interface(data_type) {
	var h='';
	for(var i=0;i<data_type.length;i++){
		h+=
		'<div class="import_wrapper">\
			<div class="title">'+data_type[i]+'</div>\
			<div class=drop_zone>\
				<input data_type="'+data_type[i]+'" type="file"></input>\
			</div>\
		</div>';
	}	
	h+='<div class="button disabled" id="import" >Import</div>';
	$('imports').remove();
	$('.ui_tabs_content[name="new_import"]').append('<div class="imports">'+h+'</div>');	
}


function prepare_import(){
	
	if(!confirm('Are you sure ? This will replace existing data')){
		return false;
	}
	show_loader('Importing Your data. This can take a couple of minutes');
	var post=storage['import'][0];
	api.run_import(post,function(data){hide_loader();console.log(data);});
}


callbacks['item_card_edit']['files']=function(data,postcontent){
	api.add_relations(
		{
			'iclass':'files','iid':data
		},
		{
			'relations':
				{
					'import':[{'id':storage['import'][0]['id'],'qual':active_data_type}],
				}
		},
		function(){
			hide_loader();
			$('input[data_type="'+active_data_type+'"]').parents('.drop_zone').addClass('drop_zone_file_uploaded');
			$('.item_card[iclass="files"]').remove();
			active_data_type=null;
			is_ready_for_import();
		}
	);

}

function is_ready_for_import(){
	api.get_all_related(
		{'iclass':'import','iid':storage['import'][0]['id']},
		function(data){
			if(data['files'].length==data_type.length){
				$('#import').removeClass('disabled');
			}else{
				$('#import').addClass('disabled');
			}

		}
	);
}

function edit_import(){
	var id=$(this).attr('iid');
	var pa={'iclass':'import','iid':id,'search':''};
		api.get_item(pa,function(data){
		storage['import']=data;
		api.get_all_related(
			{'iclass':'import','iid':storage['import'][0]['id']},
			function(data){
				storage['files']=data['files'];				
				data_type=JSON.parse(data['import_plan'][0]['config']);
				$('[name="new_import"]').click();
				$('[name="import_plan"]').hide();
				import_interface(data_type);
				for(var i=0;i<storage['files'].length;i++){
					$('input[type="file"][data_type="'+storage['files'][i]['link.qual']+'"]').parents('.drop_zone').addClass('drop_zone_file_uploaded');
				}
				is_ready_for_import();
			}
		);
	});


}