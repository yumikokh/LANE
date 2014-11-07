jQuery.event.add(window,"load",function(){
 
    //リサイズイベント
    $(window).resize(function(){
        //コンテンツの高さ設定
        hoge.contentHeight();
    });
     
    // 以下、パララックス機能の記述
    hoge.parallax();
 
});
 
var hoge = [];
 
// ウィンドウサイズによってコンテンツの高さを変える
hoge.contentHeight = function(){
    var winHeight = $(window).height();
}
 
// パララックス機能
hoge.parallax = function(){
 
    // アニメーション要素を包括している要素を指定
    var containerDiv = $('#container');
    // アニメーションの変数を宣言
    var container = ScrollTween.container(containerDiv);
 
        // 変数に .add でアニメーションを追加していく
        container.add("#cnt1", function(tween) {
            tween
                        // スクロール値「100」時点で、上にはけた状態で中央（水平）方向に存在している
                        .to(100, tween.styles().topOut().center())
                        // スクロール値「200」から「300」間で、中央（垂直）方向に 200 px の位置でストップする
                        // スクロール値「200」から「300」間の処理（変化）ではないことに注意！！
                        .range(200, 300, tween.styles().middle(200))
                        // スクロール値「400」時点で、右方向にはける
                        .to(400, tween.styles().rightOut());
        });
        container.add("#cnt2", function(tween) {
            tween
                        // スクロール値「200」時点で、下にはけた状態で中央（水平）方向に存在している
                        .to(200, tween.styles().bottomOut().center())
                        // スクロール値「300」から「400」間で、中央（垂直）の位置でストップする
                        .range(300, 400, tween.styles().middle())
                        // スクロール値「500」時点で、左方向にはける
                        .to(500, tween.styles().leftOut());
        });
        container.add("#cnt3", function(tween) {
            tween
                        .to(400, tween.styles().center().middle())
                        // {progress:～}で直接 css をあやつれる
                        .to(400, 0 , { progress: function (tween) { $("#cnt3").css("opacity", 0) } })
                        // opacity 部分は、0 から tween 分がプラスされるイメージ
                        .to(600, 0 , { progress: function (tween) { $("#cnt3").css("opacity", tween) } })
                        .to(800, 0 , { progress: function (tween) { $("#cnt3").css("opacity", 1) } })
                        // opacity 部分は、1 から tween 分がマイナスされるイメージ
                        .to(1000, 0 , { progress: function (tween) { $("#cnt3").css("opacity", 1 - tween) } });
        });
 
        // アンカーリンクをつける
        $('#nav .list:nth-child(2) a').stop().on('click', function(){
            // 引数にはスクロール値が入ります
            container.scrollTo(1000);
            return false;
        });
 
        // ちょっと処理ずらして、アニメーションを再生する
        setTimeout(function(){
            container.play();
        },300);
}