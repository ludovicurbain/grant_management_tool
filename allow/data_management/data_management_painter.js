function paint_state_orders(route_data){
	var model_arr=[
		{'label':'orders','name':'orders_without_order_info','params':route_data['route_url'],'fct':'paint_no_order_info_tab'},
		{'label':'waiting_on_delivery','name':'waiting_on_delivery','params':route_data,'fct':'paint_waiting_on_delivery_tab'},
		{'label':'ready_for_preparation','name':'ready_for_preparation','params':route_data,'fct':'paint_ready_for_preparation_tab'},
		{'label':'finished_orders','name':'finished','params':route_data,'fct':'paint_finished_tab'},
		{'label':'started_inventory','name':'started_inventory','params':route_data,'fct':'paint_started_inventory_tab'},
		{'label':'finished_inventory','name':'finished_inventory','params':route_data,'fct':'paint_finished_inventory_tab'}
	];
	if(is_string_function('specific_orders_tabs')){
		specific_orders_tabs(model_arr,route_data);
	}
	return create_ui_element({
		'ui_element':{
			'element_class':'tabs',
			'CSSclass':['ui_tab'],
			'selected_tab_items':route_data['route_url'][1],
			'model':model_arr
		}
	});
}

appText['fr']['waiting_on_delivery']='En attente';
appText['nl']['waiting_on_delivery']='Wachten op levering';
appText['en']['waiting_on_delivery']='Awaiting delivery';
appText['fr']['ready_for_preparation']='A préparer';
appText['nl']['ready_for_preparation']='Klaar';
appText['en']['ready_for_preparation']='Ready';
appText['fr']['finished_orders']='Prêtes';
appText['nl']['finished_orders']='Afgewerkt';
appText['en']['finished_orders']='Finished';
appText['fr']['started_inventory']='Stock en préparation';
appText['nl']['started_inventory']='Afwerking stock';
appText['en']['started_inventory']='Preparation inventory';
appText['fr']['finished_inventory']='Stock terminé';
appText['nl']['finished_inventory']='Voldoende stock';
appText['en']['finished_inventory']='Finished inventory';

function paint_no_order_info_tab(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title','selected_iids':[],'attributes':['client','description','date','due_date'],'format':{'date':'epoch|date|belgian','due_date':'epoch|date|belgian'},'actions':[{'CSSclass':'add_order_info','name':if_app_string('add_order_info')}]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_sales_order_without_order_info','db_id':'this'},'postcontent':{}}
	});
	return h;
}
appText['fr']['add_order_info']='Détails commande';
appText['nl']['add_order_info']='Bestelgegevens';
appText['en']['add_order_info']='Order details';

function paint_waiting_on_delivery_tab(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title','selected_iids':[],'attributes':['client','description','due_date','estimated_delivery_date','order_info_id'],'hidden':['order_info_id'],'inline_attributes':['order_info_id'],'format':{'estimated_delivery_date':'epoch|date|belgian','due_date':'epoch|date|belgian'},'actions':[{'CSSclass':'view_order_info','name':if_app_string('view_order_info')}]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_sales_order_waiting_for_delivery','db_id':'this'},'postcontent':{}}
	});
	return h;
}

function paint_ready_for_preparation_tab(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title double','selected_iids':[],'attributes':['client','description','due_date','estimated_delivery_date','order_info_id'],'hidden':['order_info_id'],'inline_attributes':['order_info_id'],'format':{'estimated_delivery_date':'epoch|date|belgian','due_date':'epoch|date|belgian'},'actions':[{'CSSclass':'prepare_order','name':if_app_string('prepare_order')},{'CSSclass':'view_order_info','name':if_app_string('view_order_info')}]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_sales_order_ready_for_order_preparation','db_id':'this'},'postcontent':{}}
	});
	return h;
}
appText['fr']['prepare_order']='Préparer la commande';
appText['nl']['prepare_order']='Bestelling voorbereiden';
appText['en']['prepare_order']='Prepare order';
appText['fr']['view_order_info']='Afficher détails';
appText['fr']['view_order_info']='Details tonen';
appText['fr']['view_order_info']='Show details';

function paint_finished_tab(){
	var h='<div class="title">'+if_app_string('orders')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title','selected_iids':[],'attributes':['client','description','due_date','estimated_delivery_date','order_info_id'],'hidden':['order_info_id'],'inline_attributes':['order_info_id'],'format':{'estimated_delivery_date':'epoch|date|belgian','due_date':'epoch|date|belgian'},'actions':[{'CSSclass':'view_order_info','name':if_app_string('view_order_info')}]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_sales_order_prep_finished','db_id':'this'},'postcontent':{}}
	});
	return h;
}
appText['fr']['estimated_delivery_date']='Date de livraison estimée';
appText['nl']['estimated_delivery_date']='Geschatte leveringsdatum';
appText['en']['estimated_delivery_date']='Estimated delivery date';


function paint_started_inventory_tab(){
	var h='<div class="title">'+if_app_string('products')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title','selected_iids':[]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_order_lines_with_status','db_id':'this'},'postcontent':{},'postcontent':{'query_parameters':{'get_order_lines_with_status_status_description': 'started'}}}
	});
	return h;
}

function paint_finished_inventory_tab(){
	var h='<div class="title">'+if_app_string('products')+'</div>';
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'has_title','selected_iids':[]},
		'api_call':{'pa':{'m':'run_query','id':'','description':'get_order_lines_with_status','db_id':'this'},'postcontent':{},'postcontent':{'query_parameters':{'get_order_lines_with_status_status_description': 'finished'}}}
	});
	return h;
}