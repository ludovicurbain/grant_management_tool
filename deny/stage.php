<?php
function generate_stage_summary($p){
	$r=array();
	for($i=0;$i<count($p['post']['iid']);$i++){
		$data=get_all_related(array('iclass'=>'stage','iid'=>$p['post']['iid'][$i]));
		$data['stage']=get_item(array('iclass'=>'stage','iid'=>$p['post']['iid'][$i]));	

		if(count($data['stage'])){
			$svg=stage_svg($data);
			$p2=array('post'=>array());
			$p2['post']['name']=$data['stage'][0]['description'];
			$p2['post']['svg']=array($svg);
			$r[]=svg_to_pdf_with_file($p2)['id'];
		}
	}
	return $r;
}

function stage_svg($data){
return '
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http:www//.w3.org/1999/xlink" viewBox="0 0 210 297" height="297mm" width="210mm">
 	<g style="dominant-baseline:central; font-weight:normal;font-family:Arial; font-size:5" >
 		<rect y="0" x="0" height="297" width="210" style="fill:#fff;"/>
 		<g transform="translate(105 15)" style="text-anchor:middle; font-size:8">
			<text x="0" y="0">'.$data['stage'][0]['description'].'</text>
			<text x="0" y="8">'.$data['season'][0]['description'].' '.$data['week'][0]['description'].'</text>
 		</g>
 		<g transform="translate(0 40)" style="">
			<text x="10" y="0">Moniteur: '.$data['teacher'][0]['description'].'</text>
 		</g>		
		<g transform="translate(0 55)" style="">
			<g transform="translate(0 0)"  style="font-size:5.3">
				<text style="text-anchor:start; " x="20" y="0">Nom</text>
				<text style="text-anchor:middle;" x="132" y="0">Date de naissance</text>
				<text style="text-anchor:middle;" x="185" y="0">Téléphone</text>
				<line x1="10" y1="3.5" x2="200" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="165" y1="-3.5" x2="165" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="100" y1="-3.5" x2="100" y2="3.5" stroke="#666" stroke-width="0.2" />
			</g>			
			<g transform="translate(0 7)" style="font-size:4">
				'.paint_participants($data).'
			</g>
		</g>
 	</g>
 </svg>';
}

function paint_participants($data){
	$people=qp("SELECT p.* FROM people p INNER JOIN r_people_stage r1 ON r1.id_1=p.id INNER JOIN stage t2 ON t2.id=r1.id_2
WHERE r1.id_2=$1 GROUP BY p.id
ORDER BY p.lastname,p.firstname;",array($data['stage'][0]['id']));
	$y=0;
	$svg='';

	for($i=0;$i<count($people);$i++){
		$oosucks=new DateTime("@".$people[$i]['birth_date']);
		$svg.='
			<g transform="translate(0 '.$y.')">
				<text style="text-anchor:start;" x="12" y="0">'.$people[$i]['lastname'].' '.$people[$i]['firstname'].'</text>
				<text style="text-anchor:middle;" x="132" y="0">'.$oosucks->format('d/m/Y').'</text>
				<text style="text-anchor:middle;" x="185" y="0">'.$people[$i]['phone'].'</text>
				<line x1="10" y1="3.5" x2="200" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="165" y1="-3.5" x2="165" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="100" y1="-3.5" x2="100" y2="3.5" stroke="#666" stroke-width="0.2" />
			</g>';
		$y+=7;
	}
	return $svg;
}

/*
apiCall(
	{'m':'generate_week_summary'},
		function(data){
			for(var i=0;i<data.length;i++){
				download_file(data[i]);
			}
		}
	,{'iid':32});
*/

function generate_week_summary($p){
	$data=qp("
SELECT
	t5.description AS sport,t4.description AS season,t3.description AS week,p.*,t2.level,(t2.price-COALESCE(SUM(t1.amount::int),0)+ CASE WHEN p.insurance='f' THEN 10 ELSE 0 END) AS to_pay
FROM
	people p
INNER JOIN r_people_stage r1 ON r1.id_1=p.id
INNER JOIN r_week_stage r4 ON r4.id_2=r1.id_2
INNER JOIN week t3 ON t3.id=r4.id_1
INNER JOIN r_season_week r5 ON r5.id_2=r4.id_1
INNER JOIN season t4 ON t4.id=r5.id_1
INNER JOIN r_stage_sport r6 ON r6.id_1=r4.id_2
INNER JOIN sport t5 ON t5.id=r6.id_2
INNER JOIN stage t2 ON t2.id=r1.id_2
LEFT JOIN
	(
		SELECT t1.*,r2.id_2 AS s_id,r3.id_1 AS p_id FROM
		payment t1
		INNER JOIN 
		r_payment_stage r2 ON t1.id=r2.id_1
		INNER JOIN r_people_payment r3
		ON r3.id_2=t1.id
	) t1
ON t1.s_id=t2.id AND t1.p_id=p.id
WHERE r4.id_1=$1 AND r6.id_2=$2
GROUP BY p.id, t2.level, t2.price,t5.description,t4.description,t3.description
ORDER BY ".$p['post']['order'].";",array($p['post']['week_id'],$p['post']['sport_id']));
	$svg=week_svg($data);
	$p2=array('post'=>array());
	$p2['post']['name']=$data[0]['season'].' '.$data[0]['week'].' '.$data[0]['sport'];
	$p2['post']['svg']=array($svg);
	svg_to_pdf_with_file($p2)['id'];
	return svg_to_pdf_with_file($p2)['id'];
}

function week_svg($data){
return '
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http:www//.w3.org/1999/xlink" viewBox="0 0 210 297" height="297mm" width="210mm">
 	<g style="dominant-baseline:central; font-weight:normal;font-family:Arial; font-size:5" >
 		<rect y="0" x="0" height="297" width="210" style="fill:#fff;"/>
 		<g transform="translate(105 15)" style="text-anchor:middle; font-size:8">
			<text x="0" y="8">'.$data[0]['season'].' '.$data[0]['week'].' '.$data[0]['sport'].'</text>
 		</g>
		<g transform="translate(0 55)" style="">
			<g transform="translate(0 0)"  style="font-size:5.3">
				<text style="text-anchor:start; " x="20" y="0">Groupe</text>
				<text style="text-anchor:start; " x="60" y="0">Nom</text>
				<text style="text-anchor:middle;" x="125" y="-7">Date de</text>
				<text style="text-anchor:middle;" x="125" y="0">naissance</text>
				<text style="text-anchor:middle;" x="160" y="0">Téléphone</text>
				<text style="text-anchor:middle;" x="195" y="0">A payer</text>
				<line x1="10" y1="3.5" x2="200" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="175" y1="-3.5" x2="175" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="142.5" y1="-3.5" x2="142.5" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="110" y1="-3.5" x2="110" y2="3.5" stroke="#666" stroke-width="0.2" />
				<line x1="50" y1="-3.5" x2="50" y2="3.5" stroke="#666" stroke-width="0.2" />
			</g>			
			<g transform="translate(0 6)" style="font-size:3">
				'.week_participants($data).'
			</g>
		</g>
 	</g>
 </svg>';
}

function week_participants($data){
	$y=0;
	$svg='';
	for($i=0;$i<count($data);$i++){
		$name=$data[$i]['lastname'].' '.$data[$i]['firstname'];
		if($data[0]['sport']=='piscine'){
			$name.=' ('.$data[$i]['proficiency'].')';
		}
		$oosucks=new DateTime("@".$data[$i]['birth_date']);
		$svg.='
			<g transform="translate(0 '.$y.')">
				<text style="text-anchor:start;" x="12" y="0">'.$data[$i]['level'].'</text>
				<text style="text-anchor:start;" x="52" y="0">'.$name.'</text>
				<text style="text-anchor:middle;" x="125" y="0">'.$oosucks->format('d/m/Y').'</text>
				<text style="text-anchor:middle;" x="160" y="0">'.$data[$i]['phone'].'</text>
				<text style="text-anchor:middle;" x="195" y="0">'.format_number($data[$i]['to_pay'],true).'</text>
				<line x1="10" y1="1.5" x2="200" y2="1.5" stroke="#666" stroke-width="0.1" />
				<line x1="175" y1="-2" x2="175" y2="2" stroke="#666" stroke-width="0.1" />
				<line x1="142.5" y1="-2" x2="142.5" y2="2" stroke="#666" stroke-width="0.1" />
				<line x1="110" y1="-2" x2="110" y2="2" stroke="#666" stroke-width="0.1" />
				<line x1="50" y1="-2" x2="50" y2="2" stroke="#666" stroke-width="0.1" />
			</g>';
		$y+=4;
	}
	return $svg;
}


function format_number($value,$show_currency=true){
	$currency='';
	if($show_currency){
		$currency=' €';
	}
	$delimiers=array('d'=>2,'t'=>',','c'=>'.');
	return number_format(floatval($value),$delimiers['d'],$delimiers['t'],$delimiers['c']).$currency;
}



?>