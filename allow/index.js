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
	api.search_item({'iclass':iclass,'search':''},{},function(data){storage[iclass]=data;},false);	
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
	api.empty_item({ 'iclass': c['iclass_1'] }, function (data) {
		create_modal('<div class="title">'+app_string+'</div>' + create_item_card(c['iclass_1'], { 'item': data,"relations": relations,'other_item': { 'iclass': c['iclass_2'], 'iid': c['iid_2'] } }, 'div'));
	});
}

painters['menu']=function(){
	var s='';
	for(var route in states){
		s+='<div route="'+route+'">'+states[route]['label']+'</div>';
	}
	return '<div id=menu>'+s+'</div>';
};

bubble_click('.button.create_related[iclass_1="season"]',function(c,t){
	generic_new_item_modal(c,'Nouvelle période');
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

$(document).on('click','[element_class="tabs"]:not(.no_route_tab)>.ui_tabs_container_tabs>[name]',function(){
	var url=copy(global_object['route_url']);
	var i=url.indexOf($(this).parents('.ui_tabs_container_tabs').find('[label].selected').attr('name'));
	if(i!=-1){
		url.splice(i);
	}
	url.push($(this).attr('name'));
	route('#'+url.join('|'));
});