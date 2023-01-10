appText['en']['degree_type']='Terminal degree';
appText['en']['create_new_people']='Add new individual';
appText['en']['edit_people']='Edit personal data';
appText['en']['manage_salaries']='Salaries';
appText['en']['effort_reporting']='Effort Reporting';
appText['en']['manage_salary']='Manage salary';
appText['en']['edit_salary']='Edit salary';

register_callback(['item_card_edit','people'],function(o){
	delete_modal();
	route('',false,true);
});

register_callback(['item_card_delete','people'],function(o){
	delete_modal();
	route('',false,true);
});

register_callback(['item_card_edit','salary'],function(o){
	delete_modal();
    refresh_ui_element('table_list',$('.modal[name="manage_salaries"] [uuid]').attr('uuid'));
});

register_callback(['item_card_delete','salary'],function(o){
	delete_modal();
    refresh_ui_element('table_list',$('.modal[name="manage_salaries"] [uuid]').attr('uuid'));
});