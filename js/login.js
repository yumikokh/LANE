// ログアウト
(function() {
	$.ajax({
		url: "api/index.php?state=logout",
		cache: false,
		async:false,
		success: function(isLogin){
			console.log("isLogin:" + isLogin);
		}
	});
})();

var ctrl=function($scope){
	//新規登録
	$scope.signup = function(){
	    var guest = angular.copy($scope.guest);
	    delete guest.attributes;
		$.ajax({
			type: "POST",
			url: "api/index.php?state=signup",
			cache: false,
			async:false,
			data: {
				"name":$scope.guest.name,
				"birthday":$scope.guest.birthday
			},
			success: function(data){
				console.log(data);
				if(data!=null){
					location.href = "index.html";
				}else{
					console.log("登録失敗");
				}
			}
		});
	};
	//ログイン処理 ユーザー名さえあっていれば認証
	$scope.login = function(){
	    var user = angular.copy($scope.user);
	    delete user.attributes;
		console.log($scope.user.name);
		$.ajax({
			type: "POST",
			url: "api/index.php?state=login",
			cache: false,
			async:false,
			data: {
				"name":$scope.user.name
			},
			success: function(data){
				console.log(data);
				if(data!=null){
					location.href = "index.html";
				}else{
					console.log("ログイン失敗");
				}
			}
		});
	};
}