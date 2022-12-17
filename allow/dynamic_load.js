
dynamic_boot();
function dynamic_boot() {
	var dynamic_load_files = {};
	dynamic_load_files.generic_css = [
		'css/CKEditor5.css',
		'js/ui_elements/ui_carousel/ui_carousel.css',
		'js/ui_elements/ui_tag/ui_tag.css',
		'js/ui_elements/ui_dropdown/ui_dropdown.css',
		'js/ui_elements/ui_tree/ui_tree.css',
		'js/ui_elements/ui_tabs.css',
		'js/lib/signature_pad/signature_pad.css',
		'js/ui_elements/table_list.css',
		'css/qr_reader.css'
	];

	dynamic_load_files.local_css = [
		'index.css',
		'data_management/data_management.css',
		'grants/grants.css'
	];

	dynamic_load_files.specific_css = [
	];

	dynamic_load_files.generic_js = [
		'js/lib/ckEditor5/ckeditor.js',
		'js/lib/jquery-1.11.1.min.js',
		'js/lib/jquery.tablesorter.min.js',
		'js/lib/jquery.validate.js',
		'js/lib/jquery.json-2.2.min.js',
		'js/lib/purify.min.js',
		'js/lib/xlsx.bundle.js',
		'js/gen.js',
		'js/painters.js',
		'js/api.js',
		'js/tree.js',
		'js/tab.js',
		'js/popup.js',
		'js/login.js',
		'js/lang.js',
		'js/relation_tab.js',
		'js/google_auth.js',
		'js/ui_element.js',
		'js/ui_elements/ui_tree/ui_tree.js',
		'js/ui_elements/table_list.js',
		'js/ui_elements/ui_tabs.js',
		'js/ui_elements/ui_carousel/ui_carousel.js',
		'js/ui_elements/ui_calendar/ui_calendar.js',
		'js/ui_elements/ui_tag/ui_tag.js',
		'js/ui_elements/ui_dropdown/ui_dropdown.js',
		'js/ui_elements/ui_elements_shortcut.js',
		'js/fresh.js',
		'js/item_card.js',
		'js/uploader.js',
		'js/tags.js',
		'js/gmaps.js',
		'js/autocomplete.js'
	];

	dynamic_load_files.local_js = [
		'config.js',
		'state.js',
		'index.js',
		'utility.js',
		'data_management/data_management.js',
		'data_management/data_management_loader.js',
		'data_management/data_management_handler.js',
		'data_management/data_management_painter.js',
		'grants/grants.js',
		'grants/grants_loader.js',
		'grants/grants_handler.js',
		'grants/grants_painter.js'
	];

	dynamic_load_files.specific_js = [
	];

	var driver = [
		{
			'target': '/generic/allow/', 'uri': { 'js': dynamic_load_files.generic_js, 'css': dynamic_load_files.generic_css }
		},
		{
			'target': '', 'uri': { 'js': dynamic_load_files.local_js, 'css': dynamic_load_files.local_css }
		},
		{
			'target': '', 'uri': { 'js': dynamic_load_files.specific_js, 'css': dynamic_load_files.specific_css }
		}
	];
	load_files_in_html(driver);
}