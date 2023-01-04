//utility erp jquery
var timezone_offset = new Date().getTimezoneOffset()*60;

// function get_belgian_date_format(date) {
// 	date=get_iso_date(date).split('-');
// 	return date[2]+'/'+ date[1]+'/'+ date[0];
// }

// function belgian_format_to_date(belgian){
// 	date=belgian.split('/');
// 	return new Date(date[1]+'/'+date[0]+'/'+date[2])
// }

// function epoch_to_belgian_date(epoch){
// 	return get_belgian_date_format(epoch_to_js_date(epoch));
// }


function scroll_to(target,scrolls){
	if(!hasProp(scrolls,'top')){
		scrolls['top']=0;
	}
	if(!hasProp(scrolls,'left')){
		scrolls['left']=0;
	}	
	$(target).scrollTop(scrolls['top']);
	$(target).scrollLeft(scrolls['left']);
}



function string_to_array(string){
	if(string == undefined){return;}
	if( Array.isArray(string)){
		return string;	
	}
	var a = [];
	for(var i = 0; i < string.split('|').length;i++){
		a.push(string.split('|')[i]);
	}
	return a;
}

function boolean_from_db(object_array,key){
	for(let i = 0; i < object_array.length;i++){
		if(object_array[i][key] == 't'){
			object_array[i][key] = true;
		} else if(object_array[i][key] == 'f') {
			object_array[i][key] = false;
		}			
	}	
}

function dateDiff(date1, date2){
	var diff = {}                           // Initialisation du retour
	var tmp = date2 - date1;
 
	tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
	diff['sec'] = tmp % 60;                 // Extraction du nombre de secondes
 
	tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
	diff['min'] = tmp % 60;                 // Extraction du nombre de minutes
 
	tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
	diff['hour'] = tmp % 24;                // Extraction du nombre d'heures
	 
	tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
	diff['day'] = tmp;
	 
	return diff;
}

function sort_array(array,key){
	array.sort(function(a,b){
		return a[key] - b[key];
		});
	return array;
}

function sort_array_alphabet(array,sort_key) {		
	array.sort(function(a,b) {
		let x = a[sort_key]?  a[sort_key].toLowerCase() : a[sort_key];
		let y = b[sort_key]? b[sort_key].toLowerCase() : b[sort_key];
		if( x < y ) {return -1;}
		if (x > y) {return 1;}
		return 0;
	})
	return array;
}

function split_item(o,k){
	o=copy(o);
	var r={'extracts':{},'item':o}
	for(var a in o){
		for(var i=0;i<k.length;i++){
			if(a==k[i]){
				r['extracts'][k[i]]=o[a];
				delete r['item'][k[i]];
			}
		}
	}
	return r;
}

function warpcore_input(el,type){
	var el=$(this);
	var type=el.attr('type');
	var new_value=el.val().replace(/,/g,'.');
	var old_value=new_value.slice(0, -1);
	var regex={
		'integer':/^-?\d*$/,
		'float':/^-?(\d+\.?\d*)?$/,
		'number':/^-?(\d+\.?\d*)?$/
	};
	if(!regex[type].test(new_value)){
		new_value=old_value;
	}
	var val_max=el.attr('max');
	var val_min=el.attr('min');
	if(isset(val_max) && Number(new_value)<Number(val_min)){
		new_value=val_min;
	}
	if(isset(val_min) && Number(new_value)>Number(val_max)){
		new_value=val_max;
	}
	el.val(new_value);
}

function pattern_format(value,pattern){ //value: any, pattern: [{ offset: number, insert: string }]
		value = value.replace(/[^\d\A-Z]/gi, '');
		let offset = 0;
		let string_array = value.split('');
		for (let i = 0; i < pattern.length; i++) {
			if (offset + pattern[i]['offset'] >= string_array.length) {
				break;
			}
			offset += pattern[i]['offset'];
			string_array.splice(offset, 0, pattern[i]['insert']);
			offset += pattern[i]['insert'].length;
		}
		return string_array.join('');
}



function two_decimals(n){
	return Math.round(100 * n) /100;
}

function padout(nbr){
	if(Number(nbr)<10){
		nbr='0'+nbr;
	}
	return nbr;
}

function null_to_empty_string(value){
	if(value == null){
		return '';
	}
	return value;
}

function date_calc(epoch,interval){
	var o = {'second':'Seconds','Minute':'Minutes','hour':'Hours','day':'Date','week':'Date','month':'Month','year':'FullYear'};
	var date = epoch_to_js_datetime(epoch);
	interval=interval.split(' ');
	if(date == 'Invalid Date'){
		console.error(date);
		return date;
	}
	if(!hasProp(o,interval[1])){
		console.error('Unknown offset');
		return 'Unknown offset';	
	}
	var orig_tz=date.getTimezoneOffset()*60;
	switch(interval[1]){
		case 'week':
			date = new Date(date['set'+o[interval[1]]](date['get'+o[interval[1]]]() +  (Number(interval[0])*7) ));
			break;
		default:
			date = new Date(date['set'+o[interval[1]]](date['get'+o[interval[1]]]() +  Number(interval[0]) ));
	}
	var new_tz=date.getTimezoneOffset()*60;
	return Number(js_datetime_to_epoch(date)+(orig_tz-new_tz));
}

function set_date_to_day(date,day){
	var weekday = date.getDay();
	if(weekday==0){
		weekday = 7;
	}
	return date.setDate(date.getDate() + (day - weekday));
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


function zoomgrad(min,max,step){
	var x =  ((max-min)/(step))+1;
	var max_steps=10;
	var factors=[];
	var n=x;
	while(n!=1){
		var f=biggest_factor(n,max_steps);
		if(!f){
			n++;
		}else{
			factors.push(f);
			n=n/factors[factors.length-1];
		}
	}
	factors.sort(function(a,b){return a-b});



	return factors
}

function biggest_factor(n,max){
	for(var i=max;i>1;i--){
		if(n%i==0){
			return i;
		}
	}
	return false;
}




function adjust_datepicker(el,epoch){ 
    if(el.attr('datepicker') == 'from_date' && epoch > $('[datepicker="to_date"]').attr('value')){
        adjust_datepicker_for_real('to_date',epoch,el.attr('scope'));
    }else if(el.attr('datepicker') == 'to_date' && epoch < $('[datepicker="from_date"]').attr('value')){
		adjust_datepicker_for_real('from_date',epoch,el.attr('scope'));
    }
}

function adjust_datepicker_for_real(datepicker,epoch,scope){
	$('[datepicker="'+datepicker+'"]').attr('value',epoch);
	var belgian_date=epoch_to_belgian_date(epoch);
	if(scope=='month'){
		belgian_date=belgian_date_without_day(belgian_date);
	}
	$('[datepicker="'+datepicker+'"]').html(belgian_date);        
}

function adjust_the_time_or_date(el,type,name){
	var item_card=el.parents('.item_card');
	var o={
		'name':name,
		'opposite_value':{'end_date':'start_date','start_date':'end_date'},
		'input_val':{
			'start_date':item_card.find('[virtual]input[type=date][name=start_date]').val(),
			'start_time':item_card.find('[virtual]input[type=time][name=start_date]').val(),
			'end_date':item_card.find('[virtual]input[type=date][name=end_date]').val(),
			'end_time':item_card.find('[virtual]input[type=time][name=end_date]').val()
		}
	};
	switch(type){
		case 'time':
			if(o['input_val']['start_date']==o['input_val']['end_date']&&Number(o['input_val']['start_time'].replace(':',''))>Number(o['input_val']['end_time'].replace(':',''))){
				overwrite_opposite_input(o,type,item_card);
			}
		break;
		case 'date':
			if(iso_date_to_epoch(o['input_val']['start_date']) > iso_date_to_epoch(o['input_val']['end_date'])){
				overwrite_opposite_input(o,type,item_card);
			}
			if(item_card.find('[virtual]input[type=time][name=start_date]').length!=0&&item_card.find('[virtual]input[type=time][name=end_date]').legnth!=0){
				if(o['input_val']['start_date']==o['input_val']['end_date']&&Number(o['input_val']['start_time'].replace(':',''))>Number(o['input_val']['end_time'].replace(':',''))){
					overwrite_opposite_input(o,'time',item_card);
				}
			}
		break;
	}
}

function overwrite_opposite_input(o,type,item_card){
	o['input_val'][o['opposite_value'][o['name']]]=item_card.find('[virtual]input[type='+type+'][name='+o['name']+']').val();
	item_card.find('[virtual]input[type='+type+'][name='+o['opposite_value'][o['name']]+']').val(o['input_val'][o['opposite_value'][o['name']]]);
}

function px_to_vw(px){
	if(px.toString().indexOf('px')!=-1){
		px=px.toString().replace('px','');
	}
	px=Number(px);
	var coefficient=100/document.documentElement.clientWidth;
	return px*coefficient;
}

function extract_ids(array){
	var ids=[];
	for(var i=0;i<array.length;i++){
		ids.push(array[i]['id']);
	}
	return ids;
}

function extract_iids(array){
	var iids=[];
	for(var i=0;i<array.length;i++){
		iids.push(array[i]['iid']);
	}
	return iids;
}

function extract_key(array,key){
	var r=[];
	for(var i=0;i<array.length;i++){
		r.push(array[i][key]);
	}
	return r;
}

function countdown(epoch,selector,cb=null) {
	safe_interval('countdown',
		function(){

			var o=countdown_part2(epoch);

			$(selector).html(o['str']);	  

			if (o['time_left'] <= 0) {
				if(cb!=null){
					cb();
				}
				clearInterval(js_intervals['countdown']);
			}
		},1000
	);
	return countdown_part2(epoch)['str'];;
}

function countdown_part2(epoch){
	var now = js_datetime_to_epoch(new Date());
	var time_left=Math.max(epoch-now,0);
	var hours = Math.floor((time_left % (24*60*60)) / (60*60));
	var minutes = Math.floor((time_left % (60*60)) / (60));
	var seconds = Math.floor((time_left % (60))); 
	var str=hours + 'h '+ minutes + 'm ' + seconds + 's ';
	return {'str':str,'time_left':time_left};
}

function time_to_human_readable(time){
	var hours=Math.floor(time/3600);
	time=time-hours*3600;
	var minutes=Math.floor(time/60);
	return hours+' '+if_app_string('hour_shorthand')+' '+double_digit_string(minutes);
}

function double_digit_string(number){
	return String(number).padStart(2,'0');
}

function get_bank_holidays_between_dates(start_date,end_date){
	var year=epoch_to_js_datetime(start_date).getFullYear();
	var year_end=epoch_to_js_datetime(end_date).getFullYear();
	var holiday_count=0;
	while(year<=year_end){
		var bank_holidays=find_bank_holidays(year);
		for(var holiday in bank_holidays){
			if(in_range(bank_holidays[holiday],start_date,end_date,true)){
				holiday_count++;
			}
		}
		year++;
	}
	return holiday_count;
}

function find_bank_holidays(year){
	var bank_holidays={'new_years_day':new Date(year,0,1),'labor_day':new Date(year,4,1),'national_holiday':new Date(year,6,21),'assumption':new Date(year,7,15),'toussaint':new Date(year,10,1),'armistice':new Date(year,10,11),'christmas_day':new Date(year,11,25)};
	var set_from_easter={'easter_sunday':0,'easter_monday':1,'ascension':(5*7)+4,'whit_sunday':7*7,'whit_monday':(7*7)+1};
	var easter=find_easter(year);
	for(var holiday in set_from_easter){
		bank_holidays[holiday]=set_relative_datetime(easter,set_from_easter[holiday]);
	}
	for(var holiday in bank_holidays){
		bank_holidays[holiday]=js_date_to_epoch(bank_holidays[holiday]);
	}
	return bank_holidays;
}

function find_easter(year){
	year=Number(year);
    var c=Math.floor(year/100);
    var n=year-19*Math.floor(year/19);
    var k=Math.floor((c-17)/25);
    var i=c-Math.floor(c/4)-Math.floor((c-k)/3)+19*n+15;
    i-=30*Math.floor((i/30));
    i-=Math.floor(i/28)*(1-Math.floor(i/28)*Math.floor(29/(i+1))*Math.floor((21-n)/11));
    var j=year+Math.floor(year/4)+i+2-c+Math.floor(c/4);
	j-=7*Math.floor(j/7);
    var l=i-j;
    var m=3+Math.floor((l+40)/44);
    var d=l+28-31*Math.floor(m/4);
    return new Date(year,double_digit_string(m-1),double_digit_string(d));
}

function set_relative_datetime(date,k,h=0,m=0){
	var relative_date=copy(date);
	relative_date.setDate(date.getDate()+k);
	relative_date.setHours(h,m);
	return relative_date;
}

function calc_product(output,product){
	switch(output){
		case 'vate':
			return calc_vate(product['tvac_price'],product['vat']);
		case 'vati':
			return calc_vati(product['unit_price'],product['vat']);
	}
}

function calc_vati(vate,vat){
	return Number(vate)*(1+Number(vat)/100);
}

function calc_vate(vati,vat){
	return Number(vati)/(1+Number(vat)/100);
}

function set_media_tags(){
	if(matchMedia('(hover: hover)').matches && matchMedia('(pointer:fine)').matches){
		$('body').addClass('has_hover');
	}else if(matchMedia('(pointer:coarse)').matches){ //touchscreen
		$('html').attr('is_mobile','');
		screen_orientation();
		detect_virtual_keyboard();
	}
	check_support();
}

function screen_orientation(){
	if (screen.orientation){
		screen.orientation.addEventListener("change", function(e){
			console.log(screen.orientation.type);
			screen_orientation_for_real();
			ifexec('prevent_portrait');
		});
		screen_orientation_for_real();
	}
}

function screen_orientation_for_real(){
	if(screen.orientation.type.indexOf('portrait')!=-1){
		$('html').removeAttr('is_landscape_mobile').attr('is_mobile','');
	}else{
		$('html').removeAttr('is_mobile').attr('is_landscape_mobile','');
	}
}

function detect_virtual_keyboard(){
		$(document).on('focus blur','input,textarea',function() {
			 $('body').attr('keyboard',!(document.activeElement == null || document.activeElement == $('body')[0])); // 		 
		});	
}

function check_support(){
	if(navigator.userAgent.indexOf('Mac') > 0){
		$('html').addClass('mac-os');
	} else {
		$('html').addClass('pc');//but not really (phone,tablet)
	}
}


$(document).on('mousedown','select[multiple] option',function(e){// restore scroll properly. fucked up by preventDefault.
	var that = this;
	var scroll = that.parentElement.scrollTop;
	this.selected = !this.selected;
	e.preventDefault();	
	setTimeout(function() {
		that.parentElement.scrollTop = scroll;
	}, 0);	
	return false;
});

function call_phone_number(phone_number){
	window.location.href='tel://'+phone_number;
}

function is_new_or_iid_or_home(route_url,i){
	return is_new_or_iid(route_url,i) || route_url[i]=='home';
}

function is_new_or_iid(route_url,i){
	return is_strictly_iid(route_url,i) || route_url[i]=='new';
}

function is_strictly_iid(route_url,i){
	return !isNaN(Number(route_url[i])) && route_url[i]>0 && Math.round(route_url[i])==route_url[i];
}

function is_iso_date(route_url,i){
	var temp=route_url[i].split('-');
	return temp.length==3 && temp[0]>=1970 && temp[0]<=2037 && temp[1]>=1 && temp[1]<=12 && temp[2]>=1 && temp[2]<=31;
}

function is_even(n){
	return (n%2)==0;
}

function app_string_template(k,p){
	var s=if_app_string(k);
	for(var key in p){
		s=s.replace('{{'+key+'}}',p[key]);
	}
	return s;
}

function string_template(s,p){
	for(var key in p){
		s=s.replace('{{'+key+'}}',p[key]);
	}
	return s;
}

function middle_color(color1,color2,ratio=0.5){
	if(color1.indexOf('#')!=-1){
		color1=color1.substring(1);
	}
	if(color2.indexOf('#')!=-1){
		color2=color2.substring(1);
	}
	var r=Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g=Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b=Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
	return rgb_to_hex(r,g,b);
}
  
function rgb_to_hex(r,g,b){
	return "#"+component_to_hex(r)+component_to_hex(g)+component_to_hex(b);
}

function component_to_hex(c){
	var hex=Number(c).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function belgian_date_without_day(belgian_date){
	belgian_date=belgian_date.split('/');
	belgian_date.splice(0,1);
	belgian_date=belgian_date.join('/');
	return belgian_date;
}

function iso_date_change_month(iso_date,interval){//dont use if random day of the month
	interval=Number(interval);
	if(interval==0){
		return;
	}
	iso_date=iso_date.split('-');
	for(var i=0;i<iso_date.length;i++){
		iso_date[i]=Number(iso_date[i]);
	}
	var step=interval/Math.abs(interval);
	for(var i=0;i<Math.abs(interval);i++){
		if(iso_date[1]+step==0){
			iso_date[0]+=step;
			iso_date[1]=12;
		}else if(iso_date[1]+step==13){
			iso_date[0]+=step;
			iso_date[1]=1;
		}else{
			iso_date[1]+=step;
		}
	}
	return iso_date.join('-');
}

function is_last_day_of_month(iso_date){
	iso_date=iso_date.split('-');
	var temp=iso_date_to_epoch(iso_date)+24*60*60;
	var iso_date_next_day=epoch_to_iso_date(temp);
	iso_date_next_day=iso_date_next_day.split('-');
	return Number(iso_date_next_day[1])!=Number(iso_date[1]);
}

function set_to_last_day_of_month(iso_date){
	iso_date=iso_date.split('-');
	for(var i=0;i<iso_date.length;i++){
		iso_date[i]=Number(iso_date[i]);
	}
	iso_date[2]=1;
	if(iso_date[1]==12){
		iso_date[0]=iso_date[0]+1;
		iso_date[1]=1;
	}else{
		iso_date[1]=iso_date[1]+1;
	}
	iso_date=iso_date.join('-');
	var temp=iso_date_to_epoch(iso_date)-24*60*60;
	return epoch_to_iso_date(temp);
}

function scroll_into_view_within_parent(el,parent){
	var rect_el=el[0].getBoundingClientRect();
	var rect_parent=parent[0].getBoundingClientRect();
	if(rect_el['bottom'] > rect_parent['bottom']){
		el[0].scrollIntoView(false);
	}
	if(rect_el['top'] < rect_parent['top']){
		el[0].scrollIntoView();
	}
}

function insert_before_last_occurence(str_to_search, str_to_find, str_to_insert) {
    var n = str_to_search.lastIndexOf(str_to_find);
    if (n < 0) return str_to_search;
    return str_to_search.substring(0,n) + str_to_insert + str_to_search.substring(n);    
}

function create_modal(modal_content,attributes={}){
	var attribute='';
	var layer=0;
	layer_down_modals();
	for(var key in attributes){
		attribute+=' '+key+'="'+attributes[key]+'"';
	}
	$('body').append('\
		<div class="modal" '+attribute+' layer="'+layer+'">\
			<div class="modal_glasspane"></div>\
			<div class="modal_content">\
				'+modal_content+'\
			</div>\
		</div>'
	);
}

function delete_modal(attr){
	if($('.modal').length<1 || ($('.modal').hasAttr('locked') && attr!='unlock')){
		return;
	}
	var is_modal_route=$('.modal').hasAttr('modal_route');
	$('.modal[layer="0"]').remove();
	layer_up_modals();
	if(is_modal_route){
		var url = global_object['route_url'];
		url.pop();
		route('#'+url.join('|'));
	}
}

function layer_down_modals(){
	$('.modal').each(function(){
		$(this).attr('layer',Number($(this).attr('layer'))-1);
	});
}

function layer_up_modals(){
	$('.modal').each(function(){
		$(this).attr('layer',Number($(this).attr('layer'))+1);
	});
}

$(document).on('click','.modal_glasspane',delete_modal);
$(document).on('click','.close_modal', delete_modal);

function create_modal_with_title(modal_content,label,attr){
	create_modal(paint_title_modal(label)+modal_content,attr);
}

function paint_title_modal(title=''){
	return '<div class="title">'+title+'<div class="close_modal"></div></div>'
}

function check_if_element_already_exist(value, type){
	var check=false;
	for (var i=0;i<storage[type].length; i++) {
		if(storage[type][i]['description']!=null&&(storage[type][i]['description'].toLowerCase() == value.toLowerCase()||if_app_string(storage[type][i]['description']).toLowerCase() == value.toLowerCase())){
			check=true;
		}
	}
	return check;
}

function paint_generic_list_edit_iclass_tab(iclass){
	var h=painters.create_button(iclass);
	h+=create_ui_element({
		'ui_element':{'element_class':'table_list','CSSclass':'generic_item_list','selected_iids':[],'iclass':iclass},
		'api_call':{'pa':{'m':'search_item','iclass':iclass,'search':''},'postcontent':{}}
	});
	return h;
}

var item_card_default_relations={};
item_card_default_relations['grants']=[{'iclass':'people'}];
item_card_default_relations['people']=[{'iclass':'degree_type'}];

$(document).on('click','.create.button[iclass]',function(){
	var iclass=$(this).attr('iclass');
	var relations={};
	if(hasProp(item_card_default_relations,iclass)){
		for(var i=0;i<item_card_default_relations[iclass].length;i++){
			relations[item_card_default_relations[iclass][i]['iclass']]={'iid':[],'relation_label':if_app_string(item_card_default_relations[iclass][i]['iclass']),'multiple':false,'mandatory':false};
		}
	}
	create_modal(paint_title_modal(if_app_string('create_new_'+iclass)) +create_item_card(iclass,{'item': get_empty_item2(iclass),'relations':relations},'div'));
});

//{'iid':get_full_object_relation_iids(document_data['relations'][iclass]),'relation_label':if_app_string(iclass),'multiple':false,'mandatory':false};

$(document).on('click','.generic_item_list .table_list_line[iid]',edit_with_generic_relations_popup);

function edit_with_generic_relations_popup(){
	var iclass=$(this).closest('[iclass]').attr('iclass');
	var iid=$(this).attr('iid');
	var get_relations=[];
	if(hasProp(item_card_default_relations,iclass)){
		for(var i=0;i<item_card_default_relations[iclass].length;i++){
			get_relations.push(item_card_default_relations[iclass][i]['iclass']);
		}
	}
	apiCall(
		{'m':'get_item_with_related_items'},
		function(data){
			push_to_storage(data);
			var item_card_relations={};
			if(hasProp(item_card_default_relations,iclass)){
				for(var i=0;i<item_card_default_relations[iclass].length;i++){
					var iclass_2=item_card_default_relations[iclass][i]['iclass'];
					if(!hasProp(storage['full_object'][iclass][iid]['relations'],iclass_2)){
						storage['full_object'][iclass][iid]['relations'][iclass_2]=[];
					}
					item_card_relations[iclass_2]={'iid':get_full_object_relation_iids(storage['full_object'][iclass][iid]['relations'][iclass_2]),'relation_label':if_app_string(iclass_2),'multiple':false,'mandatory':false};
				}
			}
			var item_card_config={'item': storage['full_object'][iclass][iid]['changes'],'relations':item_card_relations};
			item_card_default_override(iclass,item_card_config);
			create_modal(paint_title_modal(if_app_string('edit_'+iclass)) +readitem_card(iclass,item_card_config));
		},
		{
			'iclass':iclass,
			'iid':iid,
			'relations':get_relations
		},
	false);
}

function edit_with_generic_relations_item_card(iclass,iid,selector){
	var get_relations=[];
	if(hasProp(item_card_default_relations,iclass)){
		for(var i=0;i<item_card_default_relations[iclass].length;i++){
			get_relations.push(item_card_default_relations[iclass][i]['iclass']);
		}
	}
	apiCall(
		{'m':'get_item_with_related_items'},
		function(data){
			push_to_storage(data);
			var item_card_relations={};
			if(hasProp(item_card_default_relations,iclass)){
				for(var i=0;i<item_card_default_relations[iclass].length;i++){
					var iclass_2=item_card_default_relations[iclass][i]['iclass'];
					if(!hasProp(storage['full_object'][iclass][iid]['relations'],iclass_2)){
						storage['full_object'][iclass][iid]['relations'][iclass_2]=[];
					}
					item_card_relations[iclass_2]={'iid':get_full_object_relation_iids(storage['full_object'][iclass][iid]['relations'][iclass_2]),'relation_label':if_app_string(iclass_2),'multiple':false,'mandatory':false};
				}
			}
			var item_card_config={'item': storage['full_object'][iclass][iid]['changes'],'relations':item_card_relations};
			item_card_default_override(iclass,item_card_config);
			$(selector).html(readitem_card(iclass,item_card_config));
		},
		{
			'iclass':iclass,
			'iid':iid,
			'relations':get_relations
		},
	false);
}

function item_card_default_override(iclass,item_card_config){
	switch(iclass){
		case 'contract_blueprint':
			item_card_config['relations']['files']={};
			break;
	}
}

function currency(){
	return storage['config'][0]['currency'];
}

function item_card_to_search_item_relations(relations){
	var search_relations={};
	for(var iclass2 in relations){
		if(is_object(relations[iclass2])){
			search_relations[iclass2]=relations[iclass2]['iid'];
		}else{
			search_relations[iclass2]=relations[iclass2];
		}
	}
	return search_relations;
}

function api_search_create_related(storage_key,iclass,changes,relations,callback){
	if(!hasProp(storage[storage_key],iclass)){
		storage[storage_key][iclass]=[];
	}
	var search_relations=item_card_to_search_item_relations(relations);
	api.search_item(
		{'iclass':iclass,'search':''},
		{'relations':search_relations},
		function(items){
			if(items.length>0){
				storage[storage_key][iclass]=items;
				callback();
			}else{
				api.create_item(
					{'iclass':iclass},
					{'changes':changes,'relations':relations},
					function(created_id){
						changes['id']=created_id;
						storage[storage_key][iclass].push(changes);
						callback();
					}
				);
			}
		}
	);
}

function api_search_create_read_related(storage_key,iclass,changes,relations,callback){
	if(!hasProp(storage[storage_key],iclass)){
		storage[storage_key][iclass]=[];
	}
	var search_relations=item_card_to_search_item_relations(relations);
	api.search_item(
		{'iclass':iclass,'search':''},
		{'relations':search_relations},
		function(items){
			if(items.length>0){
				storage[storage_key][iclass]=items;
				callback();
			}else{
				api.create_item(
					{'iclass':iclass},
					{'changes':changes,'relations':relations},
					function(created_id){//i had made a get item and it didn't work so .. well . had to work . 
						api.search_item(
							{'iclass':iclass,'search':''},
							{'relations':search_relations},
							function(items){
								if(items.length>0){
									storage[storage_key][iclass]=items;
									callback();
								}
							}
						);
					}
				);
			}
		}
	);
}

function api_search_or_empty(storage_key,iclass,changes,relations,callback){	
	if(!hasProp(storage[storage_key],iclass)){
		storage[storage_key][iclass]=[];
	}
	var search_relations=item_card_to_search_item_relations(relations);
	api.search_item(
		{'iclass':iclass,'search':''},
		{'relations':search_relations},
		function(search_results){
			if(search_results.length==0){
				var item=get_empty_item2(iclass);
				Object.assign(item,changes);
				storage[storage_key][iclass].push({'item':item,'relations':relations});
			}else{
				for(var i=0;i<search_results.length;i++){
					storage[storage_key][iclass].push({'item':search_results[i],'relations':relations});
				}
			}
			callback();
		}
	);
}

function read_or_create_item_card(iclass,item){
	if(item['id']==''){
		return create_item_card(iclass,item);
	}else{
		return readitem_card(iclass,item);
	}
}

function get_iclass_from_iclass_full_object(iclass,iid,iclass_2){
    var r=[];
    for(var i=0;i<storage['full_object'][iclass][iid]['relations'][iclass_2].length;i++){
        r.push(storage['full_object'][iclass_2][storage['full_object'][iclass][iid]['relations'][iclass_2][i]['iid']]);
    }
    return r;
}

function popup_create_related_item_card(that,iclass,config={}){
    var related_iclass=$(that).attr('iclass');
    var related_iid=$(that).attr('iid');
    var item=get_empty_item2(iclass);
    config['item']=item;
    config['other_item']={'iclass':related_iclass,'iid':related_iid};
    create_modal(paint_title_modal(if_app_string('new_'+iclass))+create_item_card(iclass,config),{'name':'new_'+iclass});
}

function popup_read_item_card(that,config={}){
    var iclass=$(that).attr('iclass');
    var iid=$(that).attr('iid');
    api.get_item(
        {'iclass':iclass,'iid':iid},
        function(item){
            config['item']=item[0];
            create_modal(paint_title_modal(if_app_string('edit_'+iclass))+readitem_card(iclass,config));
        }
    );
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