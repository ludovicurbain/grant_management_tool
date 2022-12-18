$(document).on('click','.add_grant',function(){
    popup_create_related_item_card(this,'grants');
});

$(document).on('click','.add_project',function(){
    popup_create_related_item_card(this,'project');
});

$(document).on('click','.table_list_line[iclass="project"]',function(){
    popup_read_item_card(this);
});