$(document).on('click','.add_grant',function(){
    popup_create_related_item_card(this,'grants');
    return false;
});

$(document).on('click','.edit_grant',function(){
    popup_read_item_card(this);
    return false;
});

$(document).on('click','.add_project',function(){
    popup_create_related_item_card(this,'project');
    return false;
});

$(document).on('click','.table_list_line[iclass="project"]',function(){
    popup_read_item_card(this);
    return false;
});