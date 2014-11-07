var isAddFormVisible=false;
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

function showDetail(obj){
	$("#storyDetail").fadeIn(100);
	// $("#storyDetail").removeClass("hideDetail");
	// $("#storyDetail").addClass("showDetail");
	var usedDtail = obj.split("$@#");
	$('body').attr({ontouchmove:"event.preventDefault()"});
	$("#detailTitle").text(usedDtail[1]);
	$("#storyDetailTxt").text(usedDtail[2]);
	$("#detailDate").text(usedDtail[3]);
	$("#cate").addClass("cate");
	if(usedDtail[4]=='1'){
		$("#cate").text("経歴");
	}else if(usedDtail[4]=='2'){
		$("#cate").text("思い出");
	}else if(usedDtail[4]=='3'){
		$("#cate").text("スポーツ");
	}else if(usedDtail[4]=='4'){
		$("#cate").text("黒歴史");
	}else{
		$("#cate").text("");
		$("#cate").removeClass("cate");
	}
	//要検証
	if(usedDtail[1]=="誕生"){
		console.log("誕生");
		$(".storyDetailCover").css("background","url('img/detail.jpg') no-repeat center");
	}else if(usedDtail[5]=="" || usedDtail[5]==null || usedDtail[5]==undefined || usedDtail[5]==0){
		console.log("空");
		$(".storyDetailCover").css("background","url('img/detail.jpg') no-repeat center");
	}else{
		console.log("入ってる");
		$(".storyDetailCover").css("background","url('img/"+usedDtail[5]+"') no-repeat center");
	}

	// $('.'+storyId).animate(
	// 	{ width: 100 ,height: 100,"border-radius":50},
	// 	{ queue: false, duration: 500}
	// );
	// $('.'+storyId).animate(
	// 	{opacity: 0},
	// 	{ queue: false, duration: 250}
	// );
}

var app = angular.module('app', ['filters','filterss']);
app.controller("ctrl", function ($scope,$timeout) {
	// ユーザー情報取得
	$.ajax({
		url: "api/index.php?state=getUserInfoById&id="+window.location.href.split("=")[1],
		cache: false,
		async:false,
		success: function(allData){
			$scope.userInfo=allData;
			$("#userName").fadeIn();
				//年表表示
			var date = new Date();
			var thisYear = parseInt(String(date.getFullYear()).substring(0,4));
			var birthYear = parseInt($scope.userInfo.birthday.substring(0,4));
			$scope.years = new Array();
			for(var i=0;thisYear-birthYear-i>=0;i++){
				$scope.years.push(thisYear-i);
			};

		}
	});


	// ストーリー取得
	$.ajax({
		url: "api/index.php?state=getStoriesByFriendId&id="+window.location.href.split("=")[1],
		cache: false,
		async:false,
		success: function(allData){
			$scope.stories=allData;
			if($scope.stories!=null){
				$scope.sortedStories = Array.prototype.slice.call($scope.stories);
				//日付順にソート
				$scope.sortedStories.sort(
					function(a,b){
				    	if(Date.parse(a.date) > Date.parse(b.date)) return -1;
				        if(Date.parse(a.date) < Date.parse(b.date)) return 1;
				        return 0;
				    }
				);
			}
		}
	});

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".yearBlock")
    		.css('opacity', 0)
			.slideDown('slow')
			.animate(
				{ opacity: 1 },
				{ queue: false, duration: 1000}
			);
    	var array = $scope.sortedStories;
    	if(array!=null){
			for(var i=0;i<array.length;i++) {
				console.log(array[i]);
				if(array[i].category==1){
					if(array[i].title=="誕生"){
						$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='bioBlock born' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span></div></li>");
					}else{
						$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='bioBlock' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span></div></li>");
					}
				}else{
					$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='storyBlock' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyPic "+array[i].id+"' id='storyPic' style='background-image: url(\"img/"+array[i].picture+"\");'></div><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span><span class='tag'><span>with</span>YUMIKO</span></div></li>");
				}
			}
		}
		$("#wrapper").fadeIn(300);
		$(".yearBlock").children().children()
			.css('opacity', 0)
			.slideDown('slow')
			.animate(
				{ opacity: 1 },
				{ queue: false, duration: 1000}
			);
		});
// ログアウト
	$scope.logout = function(){
		$.ajax({
			url: "api/index.php?state=logout",
			cache: false,
			async:false,
			success: function(isLogin){
				console.log("isLogin:" + isLogin);
				if(!isLogin){location.href = "login.html";};

			}
		});
	};

// 写真の更新
	$scope.submitPicture = function(){
		$("#submitPicture").click();
	};
    $scope.updatePicture = function() {
		$('#ajaxLoading').fadeOut(500);
		var date = new Date();
    	$('#profileImage').attr('src', "img/" + $scope.userInfo.picture + "?" + date.getTime());
    };

	$scope.addPicture = function(){
		$("#addPicture").click();
	};

	$scope.removePicture = function(){
		$("#storyPicture").fadeOut(300,function(){$("#storyPicture").remove();});
		$('#removePictureBtn').fadeOut(300,function(){$('#addPictureBtn').fadeIn(300);});	
	};

    $scope.showAddForm = function(){
		$('body').attr({ontouchmove:"event.preventDefault()"});
		$scope.isAddVisible=true;
		$('#addForm').animate({
		    'top': '0px'
		},{
			complete:function(){
	            window.scroll(0,0);
           	}
       	});
	};

	$scope.hideAddForm = function(){
		$('body').removeAttr("ontouchmove");
		$('#addForm').animate({
		    'top': '568px'
		});

		$scope.add=[];
		$scope.add.isMonth = false;
		$scope.add.isPublic = true;
		$scope.isAddVisible=false;
		$scope.selectedCategoly = null;
		$scope.removePicture();
		isAddFormVisible=false;
	};

	$scope.closeDetail = function(){
	$('#storyDetail').fadeOut(300,function(){$("#storyDetail").children("button").nextAll().remove();});
	
	// $("#storyDetail").removeClass("showDetail");
	// $("#storyDetail").addClass("hideDetail");
	
	// $("#storyDetail").children("button").nextAll().remove();

		$('body').removeAttr("ontouchmove");
	$("#storyDetail").addClass("showDetail");
		$scope.isDetailMenue = false;
	};


	$scope.showCategory = function(){
		$('#categoryList').fadeIn(300);
		$(window).on('touchmove.noScroll', function(e) {
			e.preventDefault();
		});
	};

	$scope.selectCategory = function(categoryId){
		$(window).off('.noScroll');
		$('#categoryList').fadeOut(300);
		$scope.showMenu();
		if(categoryId==0){
			$(".yearBlock").children().children()
				.css('opacity', 0)
				.slideDown('slow')
				.animate(
					{ opacity: 1 },
					{ queue: false, duration: 1000}
				);
		}else{
			$(".yearBlock").children().children().fadeOut(300);
			$(".yearBlock").children().children("#category"+categoryId)
				.css('opacity', 0)
				.slideDown('slow')
				.animate(
					{ opacity: 1 },
					{ queue: false, duration: 1000}
				);
		}
	};

	$scope.isVisibleMenue = false;
	$scope.showMenu = function(){
		$scope.isVisibleMenue=!$scope.isVisibleMenue;
	};
	$scope.goHome = function(){
		location.href="index.html";
	};
	
	$scope.add = [];
	$scope.add.isMonth = false;
	$scope.add.isPublic = true;
	
	$scope.changeIsMonth = function(){
		$scope.add.isMonth=!$scope.add.isMonth;
	};

	$scope.changeDate = function(){
		($scope.add.isMonth)?$("#addMonth").focus():$("#addDate").focus();
	};

	$scope.changeIsPublic = function(){
		$("#addIsPublic").focus();
	};

	$scope.changeContent = function(){
		$('#addContentForm').animate({
		    'top': '0px'
		},{
			complete:function(){
	            $("#addContent").focus();
           	}
       	});
	};

	$scope.changeTitle = function(){
		$('#addTitleForm').animate({
		    'top': '0px'
		},{
			complete:function(){
	            $("#addContent").focus();
           	}
       	});
	};

	$scope.closeContentForm = function(){
		$('#addContentForm').animate({
		    'top': '568px'
		});
		window.scroll(0,0);
	};

	$scope.closeTitleForm = function(){
		$('#addTitleForm').animate({
		    'top': '568px'
		});
		window.scroll(0,0);
	};

	$scope.changeCategory = function(){
		$("#addCategory").focus();
	};

	$scope.addStory = function(){
		$('#ajaxLoading').fadeIn(300);
		var add = angular.copy($scope.add);
		if($scope.add==undefined || $scope.add==null){
			$("#dateAnswer").text("必須項目です");
			$("#contentAnswer").text("必須項目です");
			$("#titleAnswer").text("必須項目です");
			$('#ajaxLoading').fadeOut(300);
		    return;
		}
		var returnFlag = false;
		if($scope.add.title == undefined || $scope.add.title == null){
			$("#titleAnswer").text("必須項目です");
			returnFlag=true;
		}else{
			$("#titleAnswer").text("");
		}

		if($scope.add.content == undefined || $scope.add.content == null){
			$("#contentAnswer").text("必須項目です");	
			returnFlag=true;
		}else{
			$("#contentAnswer").text("");
		}

	    delete add.attributes;
		var date = ($scope.add.isMonth)?$scope.add.month:$scope.add.date;

		if(date == undefined || date == null){
			$("#dateAnswer").text("必須項目です");	
			returnFlag=true;
		}else{
			$("#dateAnswer").text("");
		}

		console.log($scope.add.title);
		if(returnFlag){
			$('#ajaxLoading').fadeOut(300);
			return;
		}

		var category = ($scope.selectedCategory==null)?0:$scope.selectedCategory;
		var picture = ($("#storyPicture").attr('src')==null)?"":$("#storyPicture").attr('src').substring(5);
		if(date==null){
			// 差分
		}
	    $.ajax({
			type: "POST",
			url: "api/index.php?state=addStoryById&id="+window.location.href.split("=")[1],
			cache: false,
			async:false,
			data: {
				"title":$scope.add.title,
				"date":$scope.add.date,
				"month":$scope.add.month,
				"content":$scope.add.content,
				"category":category,
				"picture":picture
			},
			success: function(data){
				$.ajax({
					url: "api/index.php?state=getStoriesByUserId",
					cache: false,
					async:false,
					success: function(allData){
						$scope.stories=allData;
						if($scope.stories!=null){
							$scope.sortedStories = Array.prototype.slice.call($scope.stories);
							//日付順にソート
							$scope.sortedStories.sort(
								function(a,b){
							    	if(Date.parse(a.date) > Date.parse(b.date)) return -1;
							        if(Date.parse(a.date) < Date.parse(b.date)) return 1;
							        return 0;
							    }
							);
						}
					}
				});
				$(".yearBlock").children("ul").children().remove();
				var array = $scope.sortedStories;
		    	if(array!=null){
					for(var i=0;i<array.length;i++) {
						console.log(array[i]);
						if(array[i].category==1){
							if(array[i].title=="誕生"){
								$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='bioBlock born' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span></div></li>");
							}else{
								$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='bioBlock' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span></div></li>");
							}
						}else{
							$("#"+array[i].date.substring(0,4)).parent("div").prev().children("ul").append("<li class='storyBlock' style='display:none;' onClick='showDetail(\"$@#"+array[i].title+"$@#"+array[i].content+"$@#"+array[i].date+"$@#"+array[i].category+"$@#"+array[i].picture+"\")' id='category"+array[i].category+"'><div class='storyPic' style='background-image: url(\"img/"+array[i].picture+"\");'></div><div class='storyChar'><span class='date'>"+array[i].date.substring(5)+"</span><span class='title'>"+array[i].title+"</span><span class='tag'><span>with</span>YUMIKO</span></div></li>");
						}
					}
				}
				$(".yearBlock").children().children().fadeIn(1000);
				$('#addForm').animate({
				    'top': '568px'
				});
				$scope.add=[];
				$scope.add.isMonth = false;
				$scope.add.isPublic = true;
				$scope.isAddVisible=false;
				$scope.selectedCategoly = null;
				$scope.selectedPublic = 0;
				$scope.removePicture();
				isAddFormVisible=false;
				$('#ajaxLoading').fadeOut(300);
				$('body').removeAttr("ontouchmove");
			}
		});
	};

	$scope.categories = [{num:1,label:"経歴"}, {num:2,label:"思い出"}, {num:3,label:"スポーツ"},{num:4,label:"黒歴史"}
	];
	$scope.selectedCategoly = null;

	$scope.notification = function(){
		alert("通知が入る予定です、未実装");
	};
	$scope.detailAlert = function(){
		alert("編集•削除は未実装です");
	};

	$scope.isDetailMenue = false;
	$scope.togglelMenue = function(){
		$scope.isDetailMenue=!$scope.isDetailMenue;
	};

	var isPreview = false;
	$scope.showPreview = function(){
		console.log("pre");
		if(!isPreview){
			$('#searchBox').fadeOut(300);
			$('#edit').fadeOut(300);
			$("#prevLink").text("通常モード");
			$scope.isVisibleMenue=false;
			isPreview = true;
		}else{
			$('#searchBox').fadeIn(300);
			$('#edit').fadeIn(300);
			$("#prevLink").text("プレビュー");
			$scope.isVisibleMenue=false;
			isPreview = false;
		}
	};
	$scope.showFriendList = function(){
		location.href = "friendList.html";
	};
});

// 写真アップロード
app.directive('fileUpload', function() {
	return {
		link : function(scope, element, attrs) {
			element.on('change', function(event) {
				console.log(event.target.files[0]);
				$('#ajaxLoading').fadeIn(500);
				var fd = new FormData();
				fd.append( "file", event.target.files[0]);
				var postData = {
					type : "POST",
					dataType : "text",
					data : fd,
					processData : false,
					contentType : false
				};
				$.ajax( "api/index.php?state=updatePicture", postData).success(function(text){
					scope.$apply(attrs.enter);
					// location.reload(true);
				});
			});
		}
	};
});

app.directive('fileAdd', function() {
	return {
		link : function(scope, element, attrs) {
			element.on('change', function(event) {
				console.log(event.target.files[0]);
				$('#ajaxLoading').fadeIn(300);
				var fd = new FormData();
				fd.append( "file", event.target.files[0]);
				var postData = {
					type : "POST",
					dataType : "text",
					data : fd,
					processData : false,
					contentType : false
				};
				$.ajax( "api/index.php?state=addPicture", postData).success(function(text){
					console.log(text);
					$('#ajaxLoading').fadeOut(300);
					$('#pictureArea').append('<img id="storyPicture" style="display:none;" src='+text+' height="100" width="100" alt="">');
					// $('#storyPicture').fadeIn(300);
					$('#addPictureBtn').fadeOut(300,function(){$('#removePictureBtn').fadeIn(300);});
					// location.reload(true);
				});
			});
		}
	};
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

angular.module('filters', []).
filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text==undefined) {
            return "";
        }
        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
});
angular.module('filterss', []).
filter('truncates', function () {
    return function (text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text==undefined) {
            return "";
        }
        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length-end.length) + end;
        }

    };
});
