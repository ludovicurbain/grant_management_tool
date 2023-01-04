query_iclass_register['get_projects']=['sponsor','grants','project'];

register_callback(['item_card_edit','grants'],function(o){
	delete_modal();
	route('',false,true);
});

register_callback(['item_card_delete','grants'],function(o){
	delete_modal();
	route('',false,true);
});

register_callback(['item_card_edit','project'],function(o){
	delete_modal();
	route('',false,true);
});

register_callback(['item_card_delete','project'],function(o){
	delete_modal();
	route('',false,true);
});


appText['en']['new_grants']='New Grant';
appText['en']['edit_grants']='Edit Grant';
appText['en']['new_project']='New Project';
appText['en']['edit_project']='Edit Project';