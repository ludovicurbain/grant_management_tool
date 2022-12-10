var global_object = {};
query_iclass_register['get_stages']=['stage','sport','week','season'];
query_iclass_register['get_abo']=['stage','sport','season'];
query_iclass_register['get_teacher_availability']=['teacher','season'];
query_iclass_register['get_people_stages']=['stage','people'];

window.onbeforeunload = function () {
	if($('body').attr('has_unsaved_data')=='true'||$('.container_right_state_wrapper[state="documents"] .table_content').attr('has_unsaved_data')=='true'){
		return "Do you really want to leave our brilliant application?"; 
	}else{
		return; 
	}
};

function route(new_route, is_back) {
	$('.modal').remove();
	$('.tooltip').remove();
	if (new_route === undefined) {
		new_route = '';
	}
	if (is_back === undefined) {
		is_back = false;
	}
	if (new_route != '' && !is_back) {
		global_object['url']=new_route;
		history.pushState(global_object, new_route,new_route);
	}
	var url=document.URL;
	if(url.indexOf('.html')==-1){
		url+='index.html';
		history.replaceState('','',url);
	}
	var past_the_square=url.split('.html')[1].split('?');
	var route_url = past_the_square[0].split('|');
	route_url[0] = route_url[0].replace('#', '');
	
	show_loader(route_url[0]+' - chargement');
	if(!hasProp(states,route_url[0])){
		console.error('unknown route:' + route_url.join('|'));
		hide_loader();
		return route('#'+Object.keys(states)[0]);
	}
	var content=painters.menu();
	if(hasProp(states[route_url[0]],'function')){
		content+=states[route_url[0]]['function'](route_url,is_back);
	}
	$('#c').html(content);
	select_menu_item(route_url[0]);
	hide_loader();
}

var states={
	//WHERE TO_TIMESTAMP(w.date)>NOW()-INTERVAL '7 days'
	'stages':{
		'function':function(){
			return painters.button({'iclass_1':'season','iclass_2':'season_type','iid_2':1},'create_related','Ajouter une période')+create_ui_element({
				'ui_element':{
					'element_class':'table_list',
					'selected_iids':[],
					'hidden':['iclass','payment_status'],
					'inline_attributes':['payment_status'],
					'CSSclass':'stages',
					'title_button':{
						'1':[
							{'class':'edit_season','label':''},
							{'class':'add_week','label':''}
						],
						'2':[
							{'class':'edit_week','label':''},
							{'class':'add_stage','label':''}
						],
						'3':[
							{'class':'edit_stage','label':''},
							{'class':'print_stage','label':''}
						],
						'4':[
							{'class':'edit_stage','label':''},
							{'class':'add_participant','label':''}
						]
					},
					'actions':[{'CSSclass':'remove_participant'}]
				},
				'api_call':{'pa':{'id':'','description': 'get_stages','db_id': 'this','m':'run_query'}}
			});
		}
	},
/*
Rajouter en attachment au mail d'inscription un fichier de descriptif du stage qui aurait été lié au stage lors de sa création, il faut donc modifier la création / édition de stage
*/
	'participants':{'function':function(){
			return painters.button({'iclass_1':'people'},'create_related','Ajouter un participant')+create_ui_element({
				'ui_element':{
					'CSSclass':'people_list',
					'element_class':'table_list',
					'selected_iids':[],
					'attributes':['firstname','lastname','email','phone','city','phone2','old_id','proficiency','insurance','lat','lng','address','zipcode','birth_date'],
					'hide_header':false,
					'iclass':'people',
					'hidden':['lat','lng','insurance','address','zipcode','birth_date'],
					'inline_attributes':['insurance']
				},
				'api_call':{'pa':{'iclass':'people','search': '','m':'search_item'},'postcontent':{}}
			});
		}
	},
/*
// trop pas fini 
	'abonnements':{
		'function':function(){
			return painters.button({'iclass_1':'season','iclass_2':'season_type','iid_2':2},'create_related','Ajouter une période')+create_ui_element({
				'ui_element':{
					'element_class':'table_list',
					'selected_iids':[],
					'title_button':{
						'1':[
							{'class':'edit_season','label':'Editer cette période'},
							{'class':'add_abo','label':'Ajouter un abonnement'}
						]
					}
				},
				'api_call':{'pa':{'id':'','description': 'get_abo','db_id': 'this','m':'run_query'}}
			});
		}
	},
// trop pas fini 
	'locations':{
		'function':function(){
			return painters.button({'iclass_1':'season','iclass_2':'season_type','iid_2':3},'create_related','Ajouter une période')+create_ui_element({
				'ui_element':{
					'element_class':'table_list',
					'selected_iids':[],
					'title_button':{
						'1':[
							{'class':'edit_season','label':'Editer cette période'},
							{'class':'add_rental','label':'Ajouter une location'}
						]
					}
				},
				'api_call':{'pa':{'id':'','description': 'get_rentals','db_id': 'this','m':'run_query'}}
			});
		}
	},
	'moniteurs':{
		'function':function(){
			return painters.button({'iclass_1':'teacher'},'create_related','Ajouter un moniteur')+create_ui_element({
				'ui_element':{
					'CSSclass':'teacher_list',
					'element_class':'table_list',
					'selected_iids':[],
					'iclass':'teacher'
				},
				'api_call':{'pa':{'iclass':'teacher','search': '','m':'search_item'},'postcontent':{}}
			});
		}
	},
// pas utilisable en pratique, peut-être pas vraiment utile non plus 
	'paiements':{
		'function':function(){
			return create_ui_element({
				'ui_element':{
					'CSSclass':'payment_list',
					'element_class':'table_list',
					'selected_iids':[],
					'iclass':'stage',
					'hidden':['css_class','id_1'],
					'inline_attributes':['css_class']
				},
				'api_call':{'pa':{'id':'','description': 'get_payments','db_id': 'this','m':'run_query'}}
			});
		}
	}
*/
/*
Recherche de participants:

Interface de recherche avec 3+ filtres sur stage et date de naissance notamment
Bouton export CSV
Bouton pour récupérer juste la liste des adresses e-mails uniques de la liste de résultats
*/
}