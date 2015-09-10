// This is a JavaScript file

var deviceId = null;

$(function() {

    // 端末情報を取得する
    monaca.getDeviceId(function(id) {
        deviceId = id;
        console.log('DeviceId :' + deviceId);
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
        myNavigator.pushPage("main_page.html", options);
    } else {
        //未ログインの場合はログイン画面を表示
        myNavigator.pushPage("login.html", options);
    }
}



function userLogin(signUpFlag) {
    // 名前と性別を取得
    var userName = $("#user_name").val();
    var sex = $("input[name='segment-a']:checked").val();
    
    // 端末情報をパスワードとして設定
    var password = deviceId;
    
    var callBack = {
        success : function(user) {
            // メイン画面に遷移
            myNavigator.pushPage("main_page.html");
        },
        error : function(user, error) {
            // エラー
            console.log("errorCode:" + error.code + ", errorMessage:" + error.message, user);
        }
    };
    
    // 始めての方は新規登録
    if (signUpFlag === true) {
        // インスタンスを作成
        var user = new NCMB.User();
        // 名前とパスワード，性別をインスタンスに設定
        user.set("userName", userName);
        user.set("password", password);
        user.set("sex", sex);
        // ACLをセット
        user.setACL(new NCMB.ACL({"*":{"read":true, "write":true}}));
        
        // 会員登録をし，コールバックを実行
        user.signUp(null, callBack);
    } else {
        alert("error");
    }        
    
}

function logout() {
    if (NCMB.User.current()) {
        NCMB.User.logOut();
        alert("ログアウトしました");
    } else {
        alert("ログインしてないよ");
    }
}