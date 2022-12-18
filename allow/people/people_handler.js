$(document).on('click','#s_people [element_class="tree"] [type][iclass="people"]',edit_with_generic_relations_popup);

$(document).on('click','.effort_reporting',function(){
    create_modal(effort_reporting_interface($(this).parents('[iid]').attr('iid')),{'name':'effort_reporting'});
});