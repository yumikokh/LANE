// ログインチェック
(function() {
	$.ajax({
		url: "api/index.php?state=isLogin",
		cache: false,
		async:false,
		success: function(isLogin){
			if(!isLogin){location.href = "login.html";};
		}
	});
})();


var app = angular.module('app', []);
app.controller("ctrl", function ($scope,$timeout) {
	// ユーザー一覧取得
	$.ajax({
		url: "api/index.php?state=getFriends",
		cache: false,
		async:false,
		success: function(allData){
			$scope.users=allData;
			$("#wrapper").fadeIn(300);
		}
	});
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {

	};


	$scope.goHome = function(){
		history.back();
	};

	$scope.showCategory = function(){
		$('#categoryList').fadeIn(300);
		$(window).on('touchmove.noScroll', function(e) {
			e.preventDefault();
		});
	};


	$scope.showUserDetail = function(idx){
		location.href="friend.html?="+$scope.users[idx].id;
	}

});
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

		