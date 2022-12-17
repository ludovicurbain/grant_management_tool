function orders_handler(){
	$(document).on('click','.add_order_info',function(){
		var document_id=$(this).parents('[iid]').attr('iid');
		var item=get_empty_item2('order_info');
		create_modal(paint_title_modal(if_app_string('add_order_info'))+create_item_card('order_info',{'item': item,'other_item': { 'iclass': 'document', 'iid': document_id}},'div'));
		return false;
	});

	$(document).on('click','.view_order_info',function(){
		api.get_item(
			{'iclass':'order_info','iid':$(this).parents('[order_info_id]').attr('order_info_id')},
			function (order_info) {
				create_modal(paint_title_modal(order_info[0]['description'])+readitem_card('order_info', {'item': order_info[0]}, 'div'));
			}
		);
		return false;
	});

	$(document).on('click','[name="finished"] .table_list_line[iid],[name="waiting_on_delivery"] .table_list_line[iid], [name="ready_for_preparation"] .table_list_line[iid],[name="orders_without_order_info"] .table_list_line[iid]',function(){
		route("#sale_documents|"+$(this).attr('iid'));
	});

	$(document).on('click','.prepare_order',function(){
		//only show start if line class ( based on line.prep_status) is unstarted, show finish if line class is started
		var tablelist=create_ui_element({
			'ui_element':{
				'element_class':'table_list',
				'selected_iids':[],
				'attributes':['product','quantity','prep_status','has_serial','product_id','contact','service_description','service_id'],
				'inline_attributes':['prep_status','has_serial','product_id','service_id'],
				'hidden':['prep_status','has_serial','product_id','service_id'],
				'actions':[
					{'CSSclass':'start','name':if_app_string('start')},
					{'CSSclass':'stop','name':if_app_string('stop')},
					{'CSSclass':'finish','name':if_app_string('finish')},
					{'CSSclass':'restart','name':if_app_string('restart')},
					{'CSSclass':'info','name':if_app_string('info')},
					{'CSSclass':'service_files','name':if_app_string('service_files')},
					{'CSSclass':'edit_service','name':if_app_string('edit_service')}
				]
			},
			'api_call':{'pa':{'m':'run_query','id':'','description':'get_order_lines_product_details','db_id':'this'},'postcontent':{'query_parameters':{'get_order_lines_product_details_document_id':$(this).parents('[iid]').attr('iid')}},'callback':prep_has_serial_lines}
		});	
		create_modal(paint_title_modal(if_app_string('prepare_order'))+tablelist,{'name':'prepare_order_lines'});
		//set serials for all lines that have them, when starting them.
		return false;
	});

	appText['fr']['service_description']='Service';
	appText['nl']['service_description']='Service';
	appText['en']['service_description']='Service';
	
	$(document).on('click','[prep_status] .button.info',function(){
		var config={'iclass':'product','iid':$(this).parents('[product_id]').attr('product_id'),'upload_file':false}
		paint_related_files_carousel_in_modal(config);
	});
	
	$(document).on('click','[prep_status] .button.service_files',function(){
		var config={'iclass':'service','iid':$(this).parents('[service_id]').attr('service_id'),'upload_file':true}
		paint_related_files_carousel_in_modal(config);
	});
	
	$(document).on('click','[prep_status] .button.edit_service',function(){
		service_edit_modal($(this).parents('[service_id]').attr('service_id'));
		return false;
	});
	
	$(document).on('click','[prep_status="unstarted"] .button.start',function(){
		set_line_status('started',$(this).parents('[iid]').attr('iid'));
	});
	
	$(document).on('click','[prep_status="started"] .button.stop',function(){
		set_line_status('unstarted',$(this).parents('[iid]').attr('iid'));
	});
	
	$(document).on('click','[prep_status="started"] .button.finish',function(){
		set_line_status('finished',$(this).parents('[iid]').attr('iid'));
	});
	
	$(document).on('click','[prep_status="finished"] .button.restart',function(){
		set_line_status('started',$(this).parents('[iid]').attr('iid'));
	});

	$('body').on('click','.modal[name="prepare_order_lines"] [name="actions"] .autocompleteItem',function(e){
		var line=$(this).parents('.table_list_line').first();
		if(line.hasAttr('has_serial')){
			api.add_relation(
				{'iclass':'line',
				'iid':line.attr('iid'),
				'iclass_2':'product',
				'iid_2':$(this).attr('iid')},{
					'recipient_type':'to'
				},
				function(){
					//shit. add_relation is not proccing any cache updates yet
					refresh_ui_element('table_list',$('.modal[name="prepare_order_lines"] [element_class="table_list"]').attr('uuid'));
				}
			);
			if(line.hasAttr('service_id')){
				api.add_relation(
					{'iclass':'service',
					'iid':line.attr('service_id'),
					'iclass_2':'product',
					'iid_2':$(this).attr('iid')},{},
					function(){
						//shit. add_relation is not proccing any cache updates yet
						refresh_ui_element('table_list',$('.modal[name="prepare_order_lines"] [element_class="table_list"]').attr('uuid'));
					}
				);
			}
		}
	});
}

function set_line_status(status,iid){
	show_loader();
	api.edit(
		{'iclass':'line','iid':iid},
		{'changes':{'prep_status':status}},
		function(){
			refresh_ui_element('table_list',$('.modal [element_class="table_list"]').attr('uuid'));
			refresh_ui_element('table_list',$('[name="ready_for_preparation"] [element_class="table_list"]').attr('uuid'));
			hide_loader();
		}
	);
}

function prep_has_serial_lines(uuid){
	var table_list=$('[element_class="table_list"][uuid="'+uuid+'"]');
	table_list.find('[has_serial="t"]').each(function(){
		var product_id=$(this).attr('product_id');
		set_storage_for_serialized_product(product_id);
		var config={'target':'serial_for_'+product_id,'name':'description','search_key':'description'};
		$(this).find('[name="actions"]').append(paint_autocomplete(config));
	});
}