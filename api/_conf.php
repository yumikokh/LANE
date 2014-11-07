<?php

define('SITE_URL','http://91af39b.ngrok.com/');

// データベース
define('DSN', 'mysql:dbname=LAA0142474-history;host=mysql016.phy.lolipop.lan');
define('DB_HOST','mysql016.phy.lolipop.lan');
define('DB_USER','LAA0142474');
define('DB_PASSWORD','cyber');
define('DB_NAME','LAA0142474-history');
function connectDb() {
	try {
		return new PDO(DSN, DB_USER, DB_PASSWORD);
	} catch (PDOException $e) {
		echo $e->getMessage();
		exit;
	}
}


//セッション	
session_set_cookie_params(0, '/');

function isCollect($name, $password, $dbh) {
	$sql = "select * from admin where name = :name and password = :password limit 1";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array(":name"=>$name, ":password"=>$password));
	$admin = $stmt->fetch();
	return $admin ? $admin : false;
}

function h($s) {
    return htmlspecialchars($s, ENT_QUOTES, "UTF-8");
}