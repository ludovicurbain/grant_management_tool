$(document).ready(function(){
	checkLogin();
	$('body').html(standard_login_container([]));
	$('body').append(paint_loader()+'<div id=c>'+painters.menu()+painters.states()+'</div>');
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
	var a=['salary_cap','degree_type','account_code','people'];
	for(var i=0;i<a.length;i++){
		preload_for_iclass(a[i]);
	}
}

function preload_for_iclass(iclass){
	apiCall(
		{'m':'search_item','search':'','iclass':iclass},
		function(data){
			push_to_storage(data);
		},
		{
			'iclass':iclass,
			'full_object':true,
			'full_object_relations':[],
			'paths':{}
		},
	false);
}

$(document).on('click','.bg',function(){
	$('.bg,.popup').remove();
});

$(document).on('click','#menu div',function(){
	route('#'+$(this).attr('route'));
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

register_callback(['item_card_edit','category'],function(o){
	delete_modal();
	route('',false,true);
});

function generic_new_item_modal(c,app_string,relations={}){
	api.empty_item({ 'iclass': c['iclass'] }, function (data) {
		create_modal('<div class="title">'+app_string+'</div>' + create_item_card(c['iclass'], { 'item': data,"relations": relations,'other_item': { 'iclass': c['iclass_2'], 'iid': c['iid_2'] } }, 'div'));
	});
}

painters['menu']=function(){
	var s='';
	for(var route in states){
		s+='<div route="'+route+'">'+states[route]['label']+'</div>';
	}
	return '<div id=menu>'+s+'</div>';
};

function standard_action(s){
	return  {
		'CSSclass':s,
		'name':if_app_string(s),
		'action':s
	};
}

function specific_actions(iclass, item){
	var actions = [];
	var iid = item['id'];
	switch(iclass){
		case 'people':
			if (!isNaN(iid)) {
				actions.push(standard_action('manage_salaries'));
				actions.push(standard_action('effort_reporting'));
			}
			break;
	}
	return actions;
}

function select_menu_item(route_url){
	$('#menu>div.selected').removeClass('selected');
	$('#menu>div:contains('+route_url+')').addClass('selected');
}

$(document).on('click','[element_class="tabs"]:not(.no_route_tab)>.ui_tabs_container_tabs>[name]',function(){
	var url=copy(global_object['route_url']);
	var i=url.indexOf($(this).parents('.ui_tabs_container_tabs').find('[label].selected').attr('name'));
	if(i!=-1){
		url.splice(i);
	}
	url.push($(this).attr('name'));
	route('#'+url.join('|'));
});