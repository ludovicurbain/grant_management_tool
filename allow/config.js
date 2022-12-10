var edit=true;
var init_edit=true;
var docedit=true;
var create_related_default_itemVar=false;
var create_related_default_itemVarIclass={};
var create_related_default_item_cardVar=true;
var create_related_default_item_cardVarIclass={};
var hiddenAttr=['id','password'];
var cloneTab=false;
var pmask='fr';
var tabs={};
tabs['id']='tab';
tabs['tabs']=[];
var tmptab={};
tmptab['title']='Object';
tabs['tabs'].push(tmptab);
var currentAsyncWait=0;
var publicReCaptchaKey="6LeqbtgSAAAAANooVG940c1gHj9RsdIoIVRGkW7m";
apiTargetApp='grant_management_tool';
var config={'noconfirm':true};
lazyN=0;

api['search_and_read_related_files']=function(pa,postcontent,func,cached=true){
	pa['m']='search_and_read_related_files';
	apiCall(pa,func,postcontent,cached);
}