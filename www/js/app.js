// This is a JavaScript file

$(function(){
    //起動時にmobile backend APIキーを設定
    //console.log("init!");
    $.getJSON("setting.json", function(data) {
        NCMB.initialize(
            data.application_key,
            data.client_key
        );
    });
});

//ログイン済みかを確認する
function checkCurrentUser(){
    //画面遷移時のアニメーションを設定
    var options = {
        animation: 'lift', // アニメーションの種類
        onTransitionEnd: function() {} // アニメーションが完了した際によばれるコールバック
    };
    
    if (NCMB.User.current()){
        //ログイン済みであればメニューの表示
        myNavigator.pushPage("page1.html", options);
    } else {
        //未ログインの場合はログイン画面を表示
        myNavigator.pushPage("login.html", options);
    }
}

function userLogin(signUpFlag) {
    // 名前を取得
    var userName = $("#user_name").val();
    var password = $("#password").val();
    var sex = $("input[name='segment-a']:checked").val();
    
    console.log(userName, password, signUpFlag);
    var callBack = {
        success : function(user) {
            // メイン画面に遷移
            myNavigator.pushPage("page1.html");
        },
        error : function(user, error) {
            // エラー
            console.log("errorCode:" + error.code + ", errorMessage:" + error.message, user);
        }
    };   
    
    if (signUpFlag === false) {
        // ログイン処理を実行し，コールバックを実行
        NCMB.User.logIn(userName, password, callBack);
    } else {
        // インスタンスを作成
        var user = new NCMB.User();
        
        // 名前とパスワード，性別をインスタンスに設定
        user.set("userName", userName);
        user.set("password", password);
        user.set("sex", sex);
        // ACLをセットするコート
        user.setACL(new NCMB.ACL({"*":{"read":true, "write":true}}));
        
        // 会員登録をし，コールバックを実行
        user.signUp(null, callBack);
    }
}


function eatConc() 
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    
    SlugStatusQuery.find({
       success: function(results) {
           var hungryRate = results[results.length-1].get("hungryRate");
    
    var new_hungryRate = hungryRate + 20;
    var slugStatus = new SlugStatus();
    slugStatus.set("hungryRate",new_hungryRate);
    slugStatus.save();
       }
    });
    
}

function getHungryRate()
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    
    SlugStatusQuery.find({
        success: function(results) {
            var hungryRate = results[results.length-1].get("hungryRate");
            $("#onaka_rate").css("width", hungryRate);
            //alert("hungryRate is " + hungryRate);
        }
        
    });
    
}

function starved()
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var slugStatus = new SlugStatus();
    slugStatus.set("hungryRate",0);
    slugStatus.save();
    
}

document.addEventListener("pageinit", function(e){
    if (e.target.id == "page1") {
        getHungryRate();
    }
});