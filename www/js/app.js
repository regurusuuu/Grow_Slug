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

$(document).on('mobileinit', function() {
  $.mobile.loader.prototype.options.text = 'loading';
  $.mobile.loader.prototype.options.textonly = false;
  $.mobile.loader.prototype.options.textVisible = true;
  $.mobile.loader.prototype.options.theme = 'a';
});

document.addEventListener("deviceready", function()
{
    // プッシュ通知受信時のコールバックを登録します
    NCMB.monaca.setHandler
    (
        function(jsonData){
            // 送信時に指定したJSONが引数として渡されます 
            //alert("callback :::" + JSON.stringify(jsonData));
        }
    );
        // デバイストークンを取得してinstallation登録が行われます
    // ※ aplication_key,client_keyはニフティクラウドmobile backendから発行されたkeyに置き換えてください
    // ※ sender_idは【GCMとの連携に必要な準備】で作成したProjectのProject Numberを入力してください
    window.NCMB.monaca.setDeviceToken(
         "21988d6bfa56fdc2dfe44648c5bd014e6df535744ad6f4d6b3c409753ca20955",
         "b79c7eb2f1e15f08817052a36f68fc7bf960f25cdda7a4a1f386e03738e8f027",
         "968712498865" 
    );
        // 開封通知登録の設定
    // trueを設定すると、開封通知を行う
    window.NCMB.monaca.setReceiptStatus(true);
        //alert("DeviceToken is registed");
    },false); 
    function getInstallationId() {
    // 登録されたinstallationのobjectIdを取得します。
    NCMB.monaca.getInstallationId(
        function(id) {
            //alert("installationID is: " + id);
        }
    );
}

/*
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
        success : function(user) {
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
    }
}
*/

var hungryRate;　/*空腹度*/
var exp;/*経験値*/
var gome;/*ゴミがあるかどうか*/
var evolve;/*進化しているかどうか、どの形態に進化しているか*/
function accessDataBase(){
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);

    SlugStatusQuery.find({
        success: function(results){
         hungryRate = results[results.length-1].get("hungryRate");
         exp = results[results.length-1].get("exp");
         gome = results[results.length-1].get("gome");
         evolve = results[results.length-1].get("evolve");
        }
    });
}

function eatConc() 
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    var mySalt = NCMB.User.current().get("salt");
    
    if (mySalt >= 20) {
        SlugStatusQuery.find({
            success: function(results){
                hungryRate = results[results.length-1].get("hungryRate");
                var new_hungryRate = hungryRate + 20;
                var new_exp = exp + 5;
                mySalt -= 20;
                //alert("経験値が5増えた!");
                alert("コンクリートを食べさせました\n経験値が3増えた!");
                var slugStatus = new SlugStatus();
                slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
                slugStatus.set("hungryRate",new_hungryRate);
                slugStatus.set("exp" , new_exp);
                slugStatus.save();
                NCMB.User.current().set("salt", mySalt);
            }
        });
    } else {
        alert("塩が足りないんですが");
    }
}

function getHungryRate()
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    
    SlugStatusQuery.find({
        success: function(results) {
            var hungryRate = results[results.length-1].get("hungryRate");
            $("#onaka_rate").css("width", hungryRate);
        }
        
    });
    
}

function starved(hara)
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var slugStatus = new SlugStatus();
    slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
    slugStatus.set("hungryRate",hara);
    slugStatus.save();
    
}



function evolute(){
    if(exp >= 100){//進化の処理
        if(evolve == 1){
            alert("なめくじが進化した!!");
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            console.log("evolvegome:" + gome);
            if(gome == 0){//ゴミがなかったらかたつむりに進化
                $("#slug-div").html("<img id='slug' src='./elements/sozai_008.png' width='200' height='140'>");
                slugStatus.set("evolve", 2);
                slugStatus.save();
            }
            else{//ゴミがあったらりんごに進化
                $("#slug-div").html("<img id='slug' src='./elements/sozai_009.png' width='200' height='140'>");
                slugStatus.set("evolve", 3);
                slugStatus.save();
            }
        }
        else if(evolve == 2){
            $("#slug-div").html("<img id='slug' src='./elements/sozai_008.png' width='200' height='140'>");
        }
        else if(evolve == 3){
            $("#slug-div").html("<img id='slug' src='./elements/sozai_009.png' width='200' height='140'>");
        }
    }
}



function die(){
    if(hungryRate < 0){
        myNavigator.pushPage('grave.html');  
    }
}



function putGome(){//なんか不可解な動作する。動くことは動く。
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    SlugStatusQuery.find({
		success: function(results){
			var gome = results[results.length - 1].get("gome");
            //console.log("gome:"+ gome);
			if(gome == 0){
				var nameStatus = new SlugStatus();
                console.log("putgome");
				nameStatus.set("objectId", "rm8M1SgcQgqp1ym2");
				nameStatus.set("gome", ++gome);
                //console.log(gome);
				nameStatus.save();
                $("#gome-div").html("<a href='#'><img type='image' name='Go_Me' id='Go_Me' src='./elements/Go_Me.png' width='40' height='40' onclick='throwGome()'></a>");


            }
		}
	});

}

setInterval(putGome,10000);

function throwGome() {
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    $("#gome-div").empty();
    SlugStatusQuery.find({
        success:function(results){
            var exp = results[results.length-1].get("exp");
            var gome = results[results.length-1].get("gome");
            //console.log("掃除前"+gome);
            var new_exp = exp + 1;
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("exp" , new_exp);
            slugStatus.set("gome", 0);
            slugStatus.save();
        }
    });
}

var hungryFlag = 0;
function reduceHara() {
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    SlugStatusQuery.find({
        success: function(results){
            var hungryRate = results[results.length-1].get("hungryRate");
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("hungryRate",hungryRate-1);
            
            //var hungryFlag = results[results.length-1].get("hungryFlag");
            if (hungryFlag==0 && (hungryRate-1)<21) {
                
                NCMB.Push.send({
                    target: ["android"],
                    immediateDeliveryFlag: true,
                    searchCondition: {},
                    message: "おなかすいたよー＞＜",
                });
                
                //slugStatus.set("hungryFlag",1);
                hungryFlag = 1;
            } else if (hungryFlag==1 && (hungryRate-1)>20) {
                //slugStatus.set("hungryFlag",0);
                hungryFlag = 0;
            }
            
            slugStatus.save();
        }
    });
    
}

setInterval(reduceHara,10000);

function getSlugName() {
    if(NCMB.User.current()){
        NCMB.User.current().fetch();
        console.log(NCMB.User.current());
        console.log(NCMB.User.current().getUsername());
        var slugName = NCMB.User.current().get("userName");
        console.log(slugName);
        $("#namespace").text(slugName);
    } else {
        console.log("not login");
    }
}

var Size_width = 230;
var Size_height = 160;
var salt_count = 0;
function Battle() {
    Size_width *= 0.9;
    Size_height *= 0.9;
    salt_count++;
    $("#enemy_slug").html("<input type='image' src='./elements/sozai_003.png' name='enemy' width='" + Size_width +"' height='" + Size_height + "' onclick='Battle()'>");
    if(salt_count == 30){
        alert("相手のなめくじは逃げ出した！\n経験値が1増えた");
        
        var SlugStatus = NCMB.Object.extend("SlugStatus");
        var SlugStatusQuery = new NCMB.Query(SlugStatus);
        SlugStatusQuery.find({
        success:function(results){
            var Exp = results[results.length-1].get("exp");
            var new_exp = Exp + 1;
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("exp" , new_exp);
            slugStatus.save();
        }
    });
        $("#enemy_slug").html("");
    }
}

function Battle_End() {
    Size_width = 230;
    Size_height = 160;
    salt_count = 0;
}

function twi() {
    var twilinkhref= "http://twitter.com/share?text=ﾂｲｰﾖ&"; 
    window.open(twilinkhref);
}

var command_check = 0;
function Game_Start() {
    // alert("なめくじだよ！");
    while(true){
        var command = Math.random();
        if(command > 0.75){
            if(check_red == 1){
                continue;
            }
            $("#command").html("<p>赤あげて！</p>");
            command_check = 0;
            break;
        }else if(command > 0.5){
            if(check_red == 0){
                continue;
            }
            $("#command").html("<p>赤さげて！</p>");
            command_check = 1;
            break;
        }else if(command > 0.25){
            if(check_white == 1){
                continue;
            }
            $("#command").html("<p>白あげて！</p>");
            command_check = 2;
            break;
        }else{
            if(check_white == 0){
                continue;
            }
            $("#command").html("<p>白さげて！</p>");
            command_check = 3;
            break;
        }
    }
}

var check_white = 0;
var check_red = 0;
var count = 0;

function Game_White() {
    if (check_white == 0 && check_red == 0) {
        console.log("check=0");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_024.png");
        check_white = 1;
        if(command_check == 2){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else if (check_white == 0 && check_red == 1) {
        console.log("check=1");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_023.png");
        check_white = 1;
        if(command_check == 2){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else if (check_white == 1 && check_red == 0) {
        console.log("2");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_026.png");
        check_white = 0;
        if(command_check == 3){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else {
        console.log("3");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_025.png");
        check_white = 0;
        if(command_check == 3){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }
    if(count == 10){
        alert("10連続正解おめでとう！\n経験値が1増えた");
        
        var SlugStatus = NCMB.Object.extend("SlugStatus");
        var SlugStatusQuery = new NCMB.Query(SlugStatus);
        SlugStatusQuery.find({
        success:function(results){
            var Exp = results[results.length-1].get("exp");
            var new_exp = exp + 1;
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("exp" , new_exp);
            slugStatus.save();
        }
    });
        count = 0;
    }
}

function Game_Red() {
    if(check_white == 0 && check_red == 0){
        console.log("0");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_025.png");
        check_red = 1;
        if(command_check == 0){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else if(check_white == 0 && check_red == 1){
        console.log("1");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_026.png");
        check_red = 0;
        if(command_check == 1){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else if(check_white == 1 && check_red == 0){
        console.log("2");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_023.png");
        check_red = 1;
        if(command_check == 0){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }else{
        console.log("3");
        console.log($("#slug_game").attr("src"));
        $("#slug_game").attr("src", "./elements/sozai_024.png");
        check_red = 0;
        if(command_check == 1){
            $("#check").html("<img src='./elements/maru.gif' width ='70' height ='70'>");
            count++;
        }else{
            $("#check").html("<img src='./elements/batsu.png' width ='70' height ='70'>");
            count = 0;
        }
        Game_Start();
    }
    if(count == 10){
        alert("10連続正解おめでとう！\n経験値が1増えた");
        var SlugStatus = NCMB.Object.extend("SlugStatus");
        var SlugStatusQuery = new NCMB.Query(SlugStatus);
        SlugStatusQuery.find({
        success:function(results){
            var exp = results[results.length-1].get("exp");
            var new_exp = exp + 1;
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("exp" , new_exp);
            slugStatus.save();
        }
    });
        count = 0;
    }
}

function Game_End() {
    check_white = 0;
    check_red = 0;
    command_check = 0;
    $("#check").html("");
}
function getSalt() {
    if(NCMB.User.current()){
        var mySalt = NCMB.User.current().get("salt");
        $("#saltspace").html("<p>"+ mySalt +"塩</p>");
    }
}

function buySalt(saltCost) {
    if(NCMB.User.current()){
        var mySalt = NCMB.User.current().get("salt");
        alert(saltCost +"塩購入しました");
        mySalt += saltCost;
        NCMB.User.current().set("salt", mySalt);
        NCMB.User.current().save();
    }
}

function setORremoveIn(inter,sORr) {
    if (NCMB.User.current()) {
        var user = NCMB.User.current();
        var interArr = user.get("interior");
        var copy_interArr = interArr.slice(0);
        copy_interArr[inter] = sORr;
        user.set("interior",copy_interArr);
        user.save();
    }
}

function displayInterior() {
    if (NCMB.User.current()) {
        var user = NCMB.User.current();
        var interArr = user.get("interior");
        if (interArr[0]==1) {
            $("#haniwa_display_i").html("<img src='./elements/sozai_022.png' id='haniwa_display' width='38' height='75'>");
        }
        if (interArr[1]==1) {
            $("#moai_display_i").html("<img src='./elements/sozai_020.png' id='moai_display' width='54' height='80'>");
        }
        if (interArr[2]==1) {
            $("#ajisai_display_i").html("<img src='./elements/sozai_021.png' id='ajisai_display' width='48' height='52'>");
        }
    }
}

document.addEventListener("pageinit", function(e){
    if (e.target.id == "page1") {
        accessDataBase();
        getHungryRate();
        console.log("aa");
        getSalt();
        console.log("bb");
        getSlugName();
        console.log("cc");
        evolute();
        die();
        displayInterior();
    }
});