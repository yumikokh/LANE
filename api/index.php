<?php
require_once('conf.php');
require_once('Zebra_Image.php');
define('IMAGE_AREA_LENGTH',300); 
session_start();
$state=$_GET["state"];

$jsondata = null;
if(empty($_GET["state"])){

}else if($_GET["state"]=="isLogin"){
	$jsondata = ($_SESSION['isLogin']==true)?true:false;
}else if($_GET["state"]=="getUserInfo"){
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from users where id = "'.$_SESSION['id'].'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        'birthday'=>$row['birthday']
	        );
    }
}else if($_GET["state"]=="getUserInfoById"){
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from users where id = "'.$_GET['id'].'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        'birthday'=>$row['birthday']
	        );
    }
}else if($_GET["state"]=="logout"){
	$_SESSION['isLogin']=false;
	$_SESSION['id']=null;
	$jsondata = $_SESSION['isLogin'];
}else if($_GET["state"]=="login"){
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
	$name = $_POST['name'];
    $sql = 'select * from users where name = "'.$name.'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        'birthday'=>$row['birthday']
	        );
		$_SESSION['id']=$row['id'];
    }
	$_SESSION['isLogin']=true;
}else if($_GET["state"]=="signup"){
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
	$name = $_POST['name'];
	$birthday = $_POST['birthday'];
	$picture = "";
    $sql = 'select * from users where name = "'.$name.'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        'birthday'=>$row['birthday']
	        );
    }
    if($jsondata==null){
    	$picture="default.png";
    	$stmt = $pdo -> query("SET NAMES utf8;");
		$stmt = $pdo->prepare("insert into users(name,picture,birthday) values(:name,:picture,:birthday)");
		$stmt->bindParam(':name',$name, PDO::PARAM_STR);
		$stmt->bindParam(':picture',$picture, PDO::PARAM_STR);
		$stmt->bindParam(':birthday',$birthday, PDO::PARAM_STR);
		$stmt->execute();
		$sql = 'select * from users where name = "'.$name.'"';
	    foreach ($pdo->query($sql) as $row) {
	    	$jsondata=array(
		        'id'=>$row['id'],
		        'name'=>$row['name']
		        );
			$_SESSION['id']=$row['id'];
	    }
		$_SESSION['isLogin']=true;
		$jsondata=true;
    }else{
    	$jsondata=null;
    }

	$id = $pdo->lastInsertId();;
	$title = "誕生";
	$category = 1;
	$picture = "";

    $pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
    $stmt = $pdo -> query("SET NAMES utf8;");
	$stmt = $pdo->prepare("insert into stories(userId,date,title,category,picture) values(:userId,:date,:title,:category,:picture)");
	$stmt->bindParam(':userId',$id, PDO::PARAM_STR);
	$stmt->bindParam(':date',$birthday, PDO::PARAM_STR);
	$stmt->bindParam(':title',$title, PDO::PARAM_STR);
	$stmt->bindParam(':category',$category, PDO::PARAM_STR);
	$stmt->bindParam(':picture',$picture, PDO::PARAM_STR);
	$stmt->execute();

}else if($_GET["state"]=="updatePicture"){
	$data = $_FILES['file'];
    $jsondata=$data;

	$image_name = $_SESSION['id'];
	$image_name = $image_name.'.jpg';
      //画像ファイルの保存場所
	$image_path = "../img/".$image_name;
      //ファイルアップロードとエラーチェック
	if( move_uploaded_file( $data["tmp_name"], $image_path ) === TRUE){
		$image = new Zebra_Image();
		$image->source_path = $image_path ;
		$image->target_path = $image_path ;
		//リサイズ・トリミング
		$image->resize(IMAGE_AREA_LENGTH, IMAGE_AREA_LENGTH, ZEBRA_IMAGE_CROP_CENTER);
	}
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from users where id = "'.$_SESSION['id'].'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        'birthday'=>$row['birthday']
	        );
    }
    $stmt = $pdo -> query("SET NAMES utf8;");
    $stmt = $pdo->prepare("UPDATE users SET name = :name,picture = :picture,birthday = :birthday WHERE id = :id");
	$stmt->bindParam(':id',$_SESSION['id'], PDO::PARAM_STR);
	$stmt->bindParam(':name',$jsondata['name'], PDO::PARAM_STR);
	$stmt->bindParam(':picture',$image_name, PDO::PARAM_STR);
	$stmt->bindParam(':birthday',$jsondata['birthday'], PDO::PARAM_STR);
	$stmt->execute();
}else if($_GET["state"]=="addPicture"){
	$data = $_FILES['file'];
	$image_name = $_SESSION['id'];
	$date = getdate();
	$image_name .= $date[0].'.jpg';
      //画像ファイルの保存場所
	$image_path = "../img/".$image_name;
      //ファイルアップロードとエラーチェック
	if( move_uploaded_file( $data["tmp_name"], $image_path ) === TRUE){
		$image = new Zebra_Image();
		$image->source_path = $image_path ;
		$image->target_path = $image_path ;
		//リサイズ・トリミング
		$image->resize(IMAGE_AREA_LENGTH, IMAGE_AREA_LENGTH, ZEBRA_IMAGE_CROP_CENTER);
	}
	$jsondata="img/".$image_name;
}else if($_GET["state"]=="addStory"){
	$id = $_SESSION['id'];
	$title = $_POST['title'];
	$date = ($_POST['date']==null)?$_POST['month']:$_POST['date'];
	$content = $_POST['content'];
	$category = $_POST['category'];
	$picture = ($_POST['picture']==null)?"":$_POST['picture'];

	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
    $stmt = $pdo -> query("SET NAMES utf8;");
	$stmt = $pdo->prepare("insert into stories(userId,date,title,content,category,picture) values(:userId,:date,:title,:content,:category,:picture)");
	$stmt->bindParam(':userId',$id, PDO::PARAM_STR);
	$stmt->bindParam(':date',$date, PDO::PARAM_STR);
	$stmt->bindParam(':title',$title, PDO::PARAM_STR);
	$stmt->bindParam(':content',$content, PDO::PARAM_STR);
	$stmt->bindParam(':category',$category, PDO::PARAM_STR);
	$stmt->bindParam(':picture',$picture, PDO::PARAM_STR);
	$stmt->execute();
	$jsondata = $pdo->lastInsertId();
}else if($_GET["state"]=="addStoryById"){
	$id = $_GET['id'];
	$title = $_POST['title'];
	$date = ($_POST['date']==null)?$_POST['month']:$_POST['date'];
	$content = $_POST['content'];
	$category = $_POST['category'];
	$picture = ($_POST['picture']==null)?"":$_POST['picture'];

	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
    $stmt = $pdo -> query("SET NAMES utf8;");
	$stmt = $pdo->prepare("insert into stories(userId,date,title,content,category,picture) values(:userId,:date,:title,:content,:category,:picture)");
	$stmt->bindParam(':userId',$id, PDO::PARAM_STR);
	$stmt->bindParam(':date',$date, PDO::PARAM_STR);
	$stmt->bindParam(':title',$title, PDO::PARAM_STR);
	$stmt->bindParam(':content',$content, PDO::PARAM_STR);
	$stmt->bindParam(':category',$category, PDO::PARAM_STR);
	$stmt->bindParam(':picture',$picture, PDO::PARAM_STR);
	$stmt->execute();
	$jsondata = $pdo->lastInsertId();
}else if($_GET["state"]=="getStoriesByUserId"){
	$id = $_SESSION['id'];
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from stories where userId = "'.$_SESSION['id'].'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata[]=array(
	        'id'=>$row['id'],
	        'date'=>$row['date'],
	        'title'=>$row['title'],
	        'content'=>$row['content'],
	        'category'=>$row['category'],
	        'picture'=>$row['picture']
	        );
    }
}else if($_GET["state"]=="getStoriesByFriendId"){
	$id = $_GET['id'];
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from stories where userId = "'.$_GET['id'].'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata[]=array(
	        'id'=>$row['id'],
	        'date'=>$row['date'],
	        'title'=>$row['title'],
	        'content'=>$row['content'],
	        'category'=>$row['category'],
	        'picture'=>$row['picture']
	        );
    }
}else if($_GET["state"]=="getStoryById"){
	$id = $_GET['id'];
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from stories where id = "'.$id.'"';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata=array(
	        'id'=>$row['id'],
	        'date'=>$row['date'],
	        'title'=>$row['title'],
	        'content'=>$row['content'],
	        'category'=>$row['category'],
	        'picture'=>$row['picture']
	        );
    }
}else if($_GET["state"]=="getFriends"){
	$pdo = new PDO(DSN, DB_USER, DB_PASSWORD);
	$stmt = $pdo -> query("SET NAMES utf8;");
    $sql = 'select * from users';
    foreach ($pdo->query($sql) as $row) {
    	$jsondata[]=array(
	        'id'=>$row['id'],
	        'name'=>$row['name'],
	        'picture'=>$row['picture'],
	        );
    }
};


header('Content-type: application/json');
echo json_encode($jsondata);




