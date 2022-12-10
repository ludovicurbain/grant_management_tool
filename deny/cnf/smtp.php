<?php
$outgoingmail_server="no.server.at.all";
$outgoingmail_port=25;
ini_set("SMTP", $outgoingmail_server); //should be set in php.ini unless there are other SMTP services used
ini_set("smtp_port ", $outgoingmail_port);  //should be set in php.ini unless there are other SMTP services used
?>