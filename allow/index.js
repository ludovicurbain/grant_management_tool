$(document).ready(function(){
	checkLogin();
	$('body').html(standard_login_container([]));
	$('body').append(paint_loader()+'<div id=c></div>');
	
	hiddenAttr.push('old_id');
});

function on_login(){
	init_lists();
}

function on_init_lists(){
	preload_data();
	$('#login_container').hide();
	$('#logoutButton').show();
	route();
}

function preload_data(){
	var a=['season','week','sport','teacher','people'];
	for(var i=0;i<a.length;i++){
		preload_for_iclass(a[i]);
	}
}

function preload_for_iclass(iclass){
	api.search_item({'iclass':iclass,'search':''},{},function(data){storage[iclass]=data;},false);	
}

$(document).on('click','.bg',function(){
	$('.bg,.popup').remove();
});

$(document).on('click','#menu div',function(){
	route('#'+$(this).html());
});

function create_modal(modal_content,attributes={}){
	var attribute='';
	for(var key in attributes){
		attribute+=' '+key+'="'+attributes[key]+'"';
	}
	$('body').append('\
		<div class="modal" '+attribute+'>\
			<div class="modal_glasspane"></div>\
			<div class="modal_content">\
				<div class="button close_modal"></div>\
				'+modal_content+'\
			</div>\
		</div>'
	);
}

function delete_modal(){
	$('.modal').remove();
}

$(document).on('click','.modal_glasspane,.close_modal',delete_modal);

callbacks['item_card_delete']['stage']=callbacks['item_card_edit']['stage'] = function(){
	preload_data();
	route();
}
callbacks['item_card_delete']['week']=callbacks['item_card_edit']['week'] = function(){
	preload_data();
	route();
}
callbacks['item_card_delete']['season']=callbacks['item_card_edit']['season'] = function(){
	preload_data();
	route();
}
callbacks['item_card_delete']['teacher']=callbacks['item_card_edit']['teacher'] = function(){
	delete_modal();
}
callbacks['item_card_delete']['people']=callbacks['item_card_edit']['people'] = function(){
	delete_modal();
}
callbacks['item_card_delete']['payment']=function(){	
	delete_modal();
	$('.table_list_line[iid="'+people_iid+'"][iclass="people"]').click();
}
callbacks['item_card_edit']['payment'] = function(data){
	api.add_relation({'iclass':'people','iid':people_iid,'iclass_2':'payment','iid_2':data});
	delete_modal();
	setTimeout(function(){$('.table_list_line[iid="'+people_iid+'"][iclass="people"]').click();},500);
}

function generic_new_item_modal(c,app_string,relations={}){
	api.empty_item({ 'iclass': c['iclass_1'] }, function (data) {
		create_modal('<div class="title">'+app_string+'</div>' + create_item_card(c['iclass_1'], { 'item': data,"relations": relations,'other_item': { 'iclass': c['iclass_2'], 'iid': c['iid_2'] } }, 'div'));
	});
}

painters['menu']=function(){
	var menu=Object.keys(states);
	var s='';
	for(var i=0;i<menu.length;i++){
		s+='<div>'+menu[i]+'</div>';
	}
	return '<div id=menu>'+s+'</div>';
};

bubble_click('.button.create_related[iclass_1="season"]',function(c,t){
	generic_new_item_modal(c,'Nouvelle période');
});

bubble_click('.button.create_related[iclass_1="teacher"]',function(c,t){
	generic_new_item_modal(c,'Nouveau moniteur',{"sport":{"iid": 1, "relation_key": "description", "relation_label": 'Sport' }});
});

bubble_click('.button.create_related[iclass_1="people"]',function(c,t){
	generic_new_item_modal(c,'Nouveau participant');
});

function specific_actions(iclass, item){
	html = '';
	var iid = item['id'];
	switch(iclass){
		case 'people':
			if (!isNaN(iid)) {
				html += '<div class="duplicate button" iid="'+iid+'"><div>Dupliquer</div></div>';
				html += '<div class="select_new_stage button" iid="'+iid+'"><div>Inscrire à un stage</div></div>';
			}
			break;
		case 'stage':
			/*if (!isNaN(iid)) {
				html += '<div class="duplicate button" iid="'+iid+'"><div>Dupliquer</div></div>';
			}*/
			break;
	}
	return html;
}

$(document).on('click','.duplicate',function(){
	$(this).parents('.item_card').attr('iid','');
	$(this).parents('.item_card').find('.item_cardSave').click();
	return false;
});

var people_iid=null;
$(document).on('click','.select_new_stage',function(){
	$(this).parents('.table_list_line').addClass('selected');
	create_modal(
		create_ui_element({
			'ui_element':{
				'element_class':'table_list',
				'selected_iids':[],
				'hidden':['level','price'],
				'actions':[{'CSSclass':'sign_up_for_stage','name':'Inscrire à ce stage'}]
			},
			'api_call':{'pa':{'m':'search_item','iclass':'stage','search':''},'postcontent':{}}
		})
	);
	return false;
});

$(document).on('click','.add_payment',function(){
	var c={'iclass_1':'payment','iclass_2':'stage','iid_2':$(this).parents('[iid]').attr('iid')};
	generic_new_item_modal(c,'Enregistrer un payement');
	return false;
});



$(document).on('click','.sign_up_for_stage',function(){
	api['add_relation']({'iclass':'people','iid':people_iid,'iclass_2':'stage','iid_2':$(this).parents('.table_list_line').attr('iid')},{},function(){
		delete_modal();
		$('.table_list_line[iid="'+people_iid+'"][iclass="people"]').click();
	});
	return false;
});

$(document).on('click','.table_list_line[iclass="stage"]',function(){
	switch($('#menu .selected').text()){
		case 'stages':
			api.get_item_with_relations(
				{'iclass':'stage','iid':$(this).attr('iid')},
				function (data) {
					create_modal(
						readitem_card('stage', {'item': data[0]['item'],'relations':{"sport":{"iid": data[0]['relations']['sport']['iid'], "relation_key": "description", "relation_label": 'Sport' },"teacher":{"iid": data[0]['relations']['teacher']['iid'], "relation_key": "description", "relation_label": 'Moniteur' }}})
					);
				}
			);
			break;
		case 'paiements':
			people_iid=$(this).parents('[container]').first().prev().attr('iid');
			if($(this).children('[name="description"][value="Assurance"]').length>0){
				open_people_modal();
			}else{
				var c={'iclass_1':'payment','iclass_2':'stage','iid_2':$(this).attr('iid')};
				generic_new_item_modal(c,'Enregistrer un payement');
			}
			break;
		default:
			break;
	}
	return false;
});

$(document).on('click','.table_list_line[iclass="people"]',function(){
	people_iid=$(this).attr('iid');
	open_people_modal();
	return false;
});

function open_people_modal(){
	api.get_item(
		{'iclass':'people','iid':people_iid},
		function (data) {
			create_modal(
				'<div class=title>Editer un participant</div>'+
				readitem_card('people', {'item': data[0]})+
				create_ui_element(
					{
						'ui_element':{
							'CSSclass':'people_stages',
							'element_class':'table_list',
							'selected_iids':[],
							'actions':[{'CSSclass':'add_payment','name':'Ajouter un payement'}],
							'hidden':['css_class'],
							'inline_attributes':['css_class']
						},
						'api_call':{
							'pa':{
								'id':'','description': 'get_people_stages','db_id': 'this','m':'run_query'
							},
							'postcontent': {
								'query_parameters': {'people_id': people_iid }
							}
						}
					}
				)
			);
		}
	);
}

$(document).on('click','[element_class="table_list"] [iclass="teacher"][iid]',function(){
	var iid=$(this).attr('iid');
	api.get_item_with_relations(
		{'iclass':'teacher','iid':iid},
		function (data) {
			create_modal(
				'<div class=title>Editer un moniteur</div>'+
				readitem_card('teacher', {'item': data[0]['item'],'relations':{"sport":{"iid": data[0]['relations']['sport']['iid'], "relation_key": "description", "relation_label": 'Sport' }}})+
				create_ui_element({
				'ui_element':{
					'CSSclass':'teacher_availability',
					'element_class':'table_list',
					'selected_iids':[],
					'hidden':['css_class'],
					'inline_attributes':['css_class']
				},
				'api_call':{'pa':{'id':'','description': 'get_teacher_availability','db_id': 'this','m':'run_query'},'postcontent': {'query_parameters': {'teacher_id': iid }}}}));
		}
	);
	return false;
});

$(document).on('click','.teacher_availability .table_list_line',function(){
	var teacher_line=$('.teacher_list .table_list_line.selected');
	var method='add_relation';
	if($(this).attr('css_class')=='green'){
		method='delete_relation';
	}
	api[method](
		{'iclass':'teacher','iid':teacher_line.attr('iid'),'iclass_2':'week','iid_2':$(this).attr('iid')},{},function(){
		refresh_ui_element('table_list',$('.teacher_availability').attr('uuid'));
	});
});

$(document).on('click','.button.edit_season,.button.edit_week,.button.edit_stage',function(){
	var iclass=$(this).attr('iclass');
	api.get_item(
		{'iclass':iclass,'iid':$(this).attr('iid')},
		function (data) {
			create_modal(readitem_card(iclass, {'item': data[0]}, 'div'));
		}
	);
	return false;
});
$(document).on('click','.button.add_week',function(){
	var c={'iclass_1':'week','iclass_2':'season','iid_2':$(this).attr('iid')};
	generic_new_item_modal(c,'Nouvelle semaine');
	return false;
});

$(document).on('click','.button.add_stage',function(){
	var c={'iclass_1':'stage','iclass_2':'week','iid_2':$(this).attr('iid')};
	generic_new_item_modal(c,'Nouveau stage',{
		"sport":{"relation_key": "description", "relation_label": 'Sport' }
	});
	return false;
});

$(document).on('click','.button.add_participant',function(){
	//autocomplete people
	var people_autocomplete='\
	<div class="autocomplete">\
		<input autocomplete="off" placeholder="chercher" type="text" target="people" search_key="firstname|lastname|phone" name="add_participant">\
	  <input type="hidden" class="add_and_relate_participant" name="id" stage_id="'+$(this).attr('iid')+'">\
	</div>';
	//new modal
	create_modal(people_autocomplete,{'modal_type':'add_participant'});
	setTimeout(function(){$('[autocomplete]').focus();},100);
});

$(document).on('change','.add_and_relate_participant',function(){
	//select one > relate to stage > o happy day.
	show_loader();
	api.add_relations(
		{
			'iclass':'people','iid':$(this).val()
		},
		{
			'relations':
				{
					'stage':[$(this).attr('stage_id')]
				}
		},
		function(){
			hide_loader();
			route();
		}
	);
});

$(document).on('click','.remove_participant',function(){
	//select one > relate to stage > o happy day.
	show_loader();
	api.delete_relations(
		{
			'iclass':'people','iid':$(this).parents('[iclass="people"]').attr('iid')
		},
		{
			'relremove':
				{
					'stage':[$(this).parents('[container]').first().prev().attr('iid')]
				}
		},
		function(){
			hide_loader();
			route();
		}
	);
	return false;
});



$(document).on('click','.button.add_abo',function(){
	var c={'iclass_1':'stage','iclass_2':'season','iid_2':$(this).attr('iid')};
	generic_new_item_modal(c,'Nouvel abonnement',{"sport":{"iid": 1, "relation_key": "description", "relation_label": 'Sport' }});
	return false;
});

$(document).on('click','.button.add_rental',function(){
	var c={'iclass_1':'stage','iclass_2':'season','iid_2':$(this).attr('iid')};
	generic_new_item_modal(c,'Nouvelle location',{"sport":{"iid": 1, "relation_key": "description", "relation_label": 'Sport' }});
	return false;
});

$(document).on('click','.print_stage',function(){
	var iids=[];
	switch($(this).parents('[iclass]').attr('iclass')){
		case 'stage':
			iids.push($(this).parents('.table_list_line').attr('iid'));
			break;
		case 'sport':
			var target=$(this).parents('[description]').first().attr('description');
			if($(this).parents('[iclass="sport"]').attr('description')!='piscine'){
				$(this).parents('[container]').first().find('[container="'+target+'"] .table_list_line[iid]').each(function(){
					iids.push($(this).attr('iid'));
				});
			}
			apiCall(
				{'m':'generate_week_summary'},
					function(data){
						download_file(data);
					}
				,{'order':'p.lastname,p.firstname,t2.level','sport_id':$(this).parents('[iclass]').attr('iid'), 'week_id':$('[iclass="week"][description="'+$(this).parents('[container]').first().attr('container')+'"]').attr('iid')});
				
			apiCall(
				{'m':'generate_week_summary'},
					function(data){
						download_file(data);
					}
				,{'order':'t2.level,p.lastname,p.firstname','sport_id':$(this).parents('[iclass]').attr('iid'), 'week_id':$('[iclass="week"][description="'+$(this).parents('[container]').first().attr('container')+'"]').attr('iid')});
			break;
	}
	if(iids.length>0){
		apiCall(
			{'m':'generate_stage_summary'},
				function(data){
					for(var i=0;i<data.length;i++){
						download_file(data[i]);
					}
				}
			,{'iid':iids});
	}
	return false;
});

function select_menu_item(route_url){
	$('#menu>div.selected').removeClass('selected');
	$('#menu>div:contains('+route_url+')').addClass('selected');
}

$(document).on('keyup','input[type="float"]',warpcore_float_input);
function warpcore_float_input() {
    var el = $(this);
    var new_value = el.val().replace(/,/g,'.');
    var old_value=new_value.slice(0, -1);
    var val_max = el.attr('max');
    var val_min = el.attr('min');
    if(!/^-?(\d+\.?\d*)?$/.test(new_value)){
        el.val(old_value);
    }else{
        el.val(new_value);
    }
    if(typeof val_max != undefined || typeof val_min != undefined){
        el.one('keydown',function(e){
            if(e.key == 'Enter'){
                if(Number(el.val())<Number(val_min)){
                    el.val(val_min);
                }
                if(Number(el.val())>Number(val_max)){
                    el.val(val_max);
                }
                if(el.val()[el.val().length-1] == '.'){
                    el.val(Math.floor(el.val()));
                }
            }
        });
    }
    
}

function highlight_next_element(parent_element,item_selector,highlight_class,direction='next'){
	var step=1;
	var current=parent_element.find(item_selector+'.'+highlight_class);
	var all_list_items=parent_element.find(item_selector+':visible');
	if(direction=='prev'){
		step=-1;
	}
	$(current).removeClass(highlight_class);
	var next=all_list_items.eq( all_list_items.index( $(current) ) + step );
	if(next.length==0){
		parent_element.find(item_selector+':visible').first().addClass(highlight_class);
	}else{
		next.addClass(highlight_class);
	}
}

function scroll_to_element(container,target){
	target=$(target);
	container=$(container);
	if (target.position()['top'] + target.outerHeight() + container.scrollTop() ==  container[0].scrollHeight ){
		container.scrollTop(container[0].scrollHeight);		
   }else if(target.position()['top'] < 0){
		container.scrollTop(container.scrollTop() + target.position()['top']);
   }else if(target.position()['top'] > container.height() - target.outerHeight()){
		 container.scrollTop((container.scrollTop() + target.position()['top']) - (container.height()- target.outerHeight()));
   }
}