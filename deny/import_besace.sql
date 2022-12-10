UPDATE tmp_stage SET nom = REPLACE(nom,'‚','é');
UPDATE tmp_stage SET nom = REPLACE(nom,'Š','è');
UPDATE tmp_stage SET nom = REPLACE(nom,'‹','ï');
UPDATE tmp_stage SET nom = REPLACE(nom,'×','ï');
UPDATE tmp_stage SET prenom = REPLACE(prenom,'‚','é');
UPDATE tmp_stage SET prenom = REPLACE(prenom,'Š','è');
UPDATE tmp_stage SET prenom = REPLACE(prenom,'‹','ï');
UPDATE tmp_stage SET prenom = REPLACE(prenom,'×','ï');
UPDATE tmp_stage SET adresse = REPLACE(adresse,'‚','é');
UPDATE tmp_stage SET adresse = REPLACE(adresse,'Š','è');
UPDATE tmp_stage SET adresse = REPLACE(adresse,'‹','ï');
UPDATE tmp_stage SET adresse = REPLACE(adresse,'×','ï');
UPDATE tmp_stage SET ville = REPLACE(ville,'‚','é');
UPDATE tmp_stage SET ville = REPLACE(ville,'Š','è');
UPDATE tmp_stage SET ville = REPLACE(ville,'‹','ï');  
UPDATE tmp_stage SET ville = REPLACE(ville,'×','ï');
   
UPDATE tmp_stage SET date_naissance='01-Jan-01' WHERE LENGTH(date_naissance)<5;
UPDATE tmp_stage SET date_naissance=EXTRACT(epoch FROM TO_DATE(date_naissance,'DD-Mon-YY'));
UPDATE tmp_stage SET date_naissance=1609459200 WHERE date_naissance::int8>1609459200;
UPDATE tmp_stage SET date_naissance=1609459200 WHERE date_naissance::int8<0;
UPDATE tmp_stage SET assurance='f' WHERE assurance='n';
UPDATE tmp_stage SET assurance='t' WHERE assurance!='f';


DELETE FROM people WHERE id NOT IN (SELECT id_2 FROM r_account_people);
INSERT INTO people (lastname,firstname,phone,phone2,email,birth_date,address,city,zipcode,insurance)
SELECT nom,prenom,telephone,mobile,mail,date_naissance::int,adresse,ville,code_post,assurance::bool FROM tmp_stage GROUP BY nom,prenom,telephone,mobile,mail,date_naissance,adresse,ville,code_post,assurance;

DELETE FROM stage;
INSERT INTO stage (description,level) SELECT DISTINCT stage||' '||n,n FROM tmp_stage WHERE stage LIKE '%21%';
DELETE FROM r_week_stage;
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Pâques 1') AS id_1,id FROM stage WHERE description LIKE '%PA121%';
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Pâques 2') AS id_1,id FROM stage WHERE description LIKE '%PA221%';
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Juillet 1') AS id_1,id FROM stage WHERE (description LIKE '%VA121%' OR description LIKE '%JU21%');
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Juillet 2') AS id_1,id FROM stage WHERE (description LIKE '%VA221%' OR description LIKE '%AV21%');
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Août 3') AS id_1,id FROM stage WHERE (description LIKE '%VA321%' OR description LIKE '%HUP21%');
INSERT INTO r_week_stage (id_1,id_2)
SELECT (SELECT id FROM week WHERE description='Août 4') AS id_1,id FROM stage WHERE (description LIKE '%VA421%' OR description LIKE '%AO21%');
DELETE FROM r_stage_sport;
INSERT INTO r_stage_sport (id_1,id_2)
SELECT id,(SELECT id FROM sport WHERE description='piscine') AS id_2 FROM stage WHERE description LIKE '%NA%';
INSERT INTO r_stage_sport (id_1,id_2)
SELECT id,(SELECT id FROM sport WHERE description='multisports') AS id_2 FROM stage WHERE description NOT LIKE '%NA%';
DELETE FROM r_people_stage;
INSERT INTO r_people_stage (id_1,id_2)
SELECT * FROM (SELECT (SELECT id FROM people WHERE lastname=t.nom AND firstname=prenom LIMIT 1) AS id_1,(SELECT id FROM stage WHERE description=t.stage||' '||t.n) AS id_2 FROM tmp_stage t)a WHERE id_2 IS NOT NULL;



DELETE FROM payment;
INSERT INTO payment (old_id,amount)  
SELECT technical_id,regexp_replace(paye, '[^0-9]+', '', 'g') FROM tmp_stage WHERE regexp_replace(paye, '[^0-9]+', '', 'g')!='';
DELETE FROM r_people_payment;
INSERT INTO r_people_payment (id_1,id_2)
SELECT * FROM (SELECT (SELECT id FROM people WHERE lastname=t.nom AND firstname=prenom LIMIT 1) AS id_1,(SELECT id FROM payment WHERE old_id::int=t.technical_id) AS id_2 FROM tmp_stage t)a WHERE id_2 IS NOT NULL;
DELETE FROM r_payment_stage;
INSERT INTO r_payment_stage (id_1,id_2)
SELECT * FROM (SELECT (SELECT id FROM payment WHERE old_id::int=t.technical_id) AS id_1, (SELECT id FROM stage WHERE description=t.stage||' '||t.n) AS id_2 FROM tmp_stage t)a WHERE id_2 IS NOT NULL;


UPDATE stage SET description=REPLACE(description,' 1',' 9h30 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,' 2',' 10h15 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,' 3',' 11h00 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,' 4',' 13h30 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,' 5',' 14h15 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,' 6',' 15h00 moniteur 1') WHERE description LIKE '%NA%';
UPDATE stage SET description=REPLACE(description,'moniteur 1*','moniteur 2') WHERE description LIKE '%NA%';

UPDATE stage SET level='1 - 9h30 moniteur 1' WHERE level='1' AND description LIKE '%NA%';
UPDATE stage SET level='2 - 10h15 moniteur 1' WHERE level='2' AND description LIKE '%NA%';
UPDATE stage SET level='3 - 11h00 moniteur 1' WHERE level='3' AND description LIKE '%NA%';
UPDATE stage SET level='4 - 13h30 moniteur 1' WHERE level='4' AND description LIKE '%NA%';
UPDATE stage SET level='5 - 14h15 moniteur 1' WHERE level='5' AND description LIKE '%NA%';
UPDATE stage SET level='6 - 15h00 moniteur 1' WHERE level='6' AND description LIKE '%NA%';

UPDATE stage SET level='1 - 9h30 moniteur 2' WHERE level='1*' AND description LIKE '%NA%';
UPDATE stage SET level='2 - 10h15 moniteur 2' WHERE level='2*' AND description LIKE '%NA%';
UPDATE stage SET level='3 - 11h00 moniteur 2' WHERE level='3*' AND description LIKE '%NA%';
UPDATE stage SET level='4 - 13h30 moniteur 2' WHERE level='4*' AND description LIKE '%NA%';
UPDATE stage SET level='5 - 14h15 moniteur 2' WHERE level='5*' AND description LIKE '%NA%';
UPDATE stage SET level='6 - 15h00 moniteur 2' WHERE level='6*' AND description LIKE '%NA%';
UPDATE stage SET price=80;
UPDATE stage SET price=40 WHERE description LIKE '%NA%';


UPDATE people p SET proficiency=(SELECT sport FROM tmp_stage WHERE nom=p.lastname AND prenom=p.firstname LIMIT 1);



/*
Refaire un import S2
Sortir les documents semaine 2
Liste des participants du stage
Pouvoir ajouter / enlever des participants
Pouvoir ajouter un payement directement dans cette liste-là
Temporairement désactiver les e-mails
>> Pour pouvoir travailler la semaine 3 sans devoir refaire un import
*/