$(document).on('click','#s_people [element_class="tree"] [type][iclass="people"]',function(){
    var iclass=$(this).closest('[iclass]').attr('iclass')
    var iid=$(this).attr('iid');
    edit_with_generic_relations_item_card(iclass,iid,'.people_container');
});

$(document).on('click','.effort_reporting',function(){
    create_modal(effort_reporting_interface($(this).parents('[iid]').attr('iid')),{'name':'effort_reporting'});
});

$(document).on('click','.manage_salaries',function(){
    create_modal(manage_salaries_interface($(this).parents('[iid]').attr('iid')),{'name':'manage_salaries'});
});

$(document).on('click','#effort_reporting .month',function(){
    var people_id=$(this).parents('[people_id]').attr('people_id');
    var month=$(this).find('.label').html();
    create_modal(effort_reporting_one_month(people_id,month),{'name':'effort_reporting_one_month'});
});

$(document).on('wheel','.modal[name="effort_reporting"] .modal_content',function(e){
	$(this)[0].scrollLeft+=e.originalEvent.deltaY;
});

bubble_click('.create_related',function(c,t){
    create_modal(create_item_card(c['iclass_1'],{'item':get_empty_item2(c['iclass_1']),'other_item':{'iclass':c['iclass_2'],'iid':c['iid_2']}}));
});

$(document).on('click','.modal[name="manage_salaries"] .table_list_line[iid]',function(){
    var iclass='salary';
    var iid=$(this).attr('iid');
    edit_with_generic_relations_popup_inner(iclass,iid);
});

$(document).on('click','#s_people .drop_zone',function(e){
	$(this).children('input[type="file"]')[0].click();
});	

$(document).on('click','#s_people input[type="file"][data_type]',function(e){
	e.stopPropagation();
});	

$(document).on('dragenter dragover','#s_people .drop_zone',function(e) {
		e.preventDefault();
		e.stopPropagation();
		$(this).addClass('drop_zone_highlight');
	}
);
$(document).on('dragleave drop','#s_people .drop_zone',
	function(e) {
		e.preventDefault();
		e.stopPropagation();
		$(this).removeClass('drop_zone_highlight');
	}
)

$(document).on('change','#s_people input[type="file"][data_type]',function(){
	var that=$(this);
	if(that[0]['files'].length==1){
		that.parent('.drop_zone').addClass('drop_zone_has_file');
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var workbook = XLSX.read(e.target.result);
			var worksheet = workbook.Sheets[workbook.SheetNames[0]];
			var json=JSON.stringify(XLSX.utils.sheet_to_json(worksheet,{'defval':''}));

			show_loader(if_app_string('import'));
			apiCall(
                {'m':'import_people'},
                function(data){
                    that.parent('.drop_zone').addClass('drop_zone_file_uploaded');
                    route();
                    hide_loader();
                    for(var key in data){
                        notify(if_app_string(key)+': '+data[key],(data[key]>0) ? 'green':'blue');
                    }
                },{'content':json,'name':'import_people.json'}
	    	);
		};
		reader.readAsArrayBuffer(file);
	}else{
		that.parent('.drop_zone').removeClass('drop_zone_has_file');
	}
});

$(document).on(
	'drop','#s_people .drop_zone',
	function(e){		
		e.preventDefault();
		e.stopPropagation();
		if(e.originalEvent.dataTransfer){
			if(e.originalEvent.dataTransfer.files.length==1) {
				$(this).addClass('drop_zone_has_file');
				$(this).children('input[type="file"]')[0]['files']=e.originalEvent.dataTransfer.files;
				$(this).children('input[type="file"]').change();
			}else{
				alert('Max one file');
			}
		}
	}
);
