$(document).on('click','#s_people [element_class="tree"] [type][iclass="people"]',function(){
    var iclass=$(this).closest('[iclass]').attr('iclass')
    var iid=$(this).attr('iid');
    edit_with_generic_relations_item_card(iclass,iid,'.people_container');
});

$(document).on('click','.effort_reporting',function(){
    create_modal(effort_reporting_interface($(this).parents('[iid]').attr('iid')),{'name':'effort_reporting'});
});

$(document).on('click','#effort_reporting .month',function(){
    var people_id=$(this).parents('[people_id]').attr('people_id');
    var month=$(this).find('.label').html();
    create_modal(effort_reporting_one_month(people_id,month),{'name':'effort_reporting_one_month'});
});

$(document).on('wheel','.modal[name="effort_reporting"] .modal_content',function(e){
	$(this)[0].scrollLeft+=e.originalEvent.deltaY;
});