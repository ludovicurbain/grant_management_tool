<?php

include_once '/var/www/grant_management_tool/deny/stage.php';
include_once '/var/www/generic/deny/erp/import.php';
include_once '/var/www/grant_management_tool/deny/club_import.php';

function specific_pre_edit(&$p){
	$return="";	
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
	return $return;
}

function specific_post_edit(&$p){
	$return="";
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
	return $return;
}

function specific_pre_delete(&$p){
	$return='';
	switch($p["iclass"]){
		default:
			$return='';
			break;
	}
}

function specific_post_relate(&$p){
	switch($p['relation'][0]["name"]){
		case 'r_people_stage':
			$stage=get_item(array('iid'=>$p['iid_2'],'iclass'=>'stage'));
			$people=get_item(array('iid'=>$p['iid'],'iclass'=>'people'));
			edit(array('iclass'=>'relation','post'=>array('changes'=>array('address_1'=>'concept','address_2'=>$i[0]['address'],'unique_1'=>'f','unique_2'=>'f'))));
			$p2=array();
			$p2['to']=array($people[0]['email']);
			$p2['bcc']=array('c.dewaele@belgacom.net');
			$assurance="Vous êtes en ordre d'assurance";
			if($people[0]['assurance']!='t'){
				$assurance="
<br>&nbsp;&nbsp;&nbsp;&nbsp;- '.$assurance.'Merci de payer également la cotisation de 10€ pour l'assurance valable jusqu'aux 12 ans de l'enfant.";
			}
			$p2['body']='
<head><meta charset="UTF-8"></head>
<br>Chèr(e) '.$people[0]['firstname'].' '.$people[0]['lastname'].', 
<br>
<br>Nous avons bien reçu votre inscription au stage '.$stage[0]['description'].'
<br> 
<br>Voici quelques informations pratiques : 
<br> 
<br>&nbsp;&nbsp;&nbsp;&nbsp;- Le prix du stage est de '.$stage[0]['price'].'€
<br>&nbsp;&nbsp;&nbsp;&nbsp;- Un accompte de 15€ doit être versé dans les 15 jours au compte xyz'.$assurance.'
<br>
<br>Sportivement,
<br>
<br>L\'ASBL Besace Brabant Wallon Est';
			$p2['from']='asbl.besace.bw.est@gmail.com;axelnulluy@msn.com';
			$p2['subject']='Besace Brabant Est: inscription au stage '.$stage[0]['description'];
			$p2['mail_server']='smtp.gmail.com:587';
			$p2['mail_account']='asbl.besace.bw.est@gmail.com';
			$p2['mail_password']='qioctqpdnydkvwqk';
			$p2['attached_files']=array();
			sendmail($p2);
			break;
		default:
			break;
	}
	return "success";
}
?>