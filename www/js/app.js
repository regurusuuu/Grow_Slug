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


function eatConc() 
{
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    
    SlugStatusQuery.find({
       success: function(results) {
            var hungryRate = results[results.length-1].get("hungryRate");
            var exp = results[results.length-1].get("exp");

            var new_hungryRate = hungryRate + 20;
            var new_exp = exp + 5;
            //alert("経験値が5増えた!");
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("hungryRate",new_hungryRate);
            slugStatus.set("exp" , new_exp);
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

document.addEventListener("pageinit", function(e){
    if (e.target.id == "page1") {
        getHungryRate();
        getSlugName();
        evolute();
        die();
    }
});


function evolute(){
    var SlugStatus = NCMB.Object.extend("SlugStatus");
	var SlugStatusQuery = new NCMB.Query(SlugStatus);

	SlugStatusQuery.find({
		success: function(results){
			var exp = results[results.length - 1].get("exp");
            var evolve = results[results.length - 1].get("evolve");
			if(exp >= 100){//進化の処理
                if(evolve == 1){
                    alert("なめくじが進化した!!");
				    var slugStatus = new SlugStatus();
                    slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
                    slugStatus.set("evolve", 2);
                    slugStatus.save();
                }
 				$("#slug-div").html("<img id='slug' src='./elements/sozai_008.png' width='200' height='140'>");
			}
		}
	});
}



function die(){
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    
    SlugStatusQuery.find({
        success:function(results){
            var hungryRate = results[results.length - 1].get("hungryRate");
            if(hungryRate < 0){
                myNavigator.pushPage('grave.html');  
            }
        }
    });
}

function throwGome() {
    alert("じゃの");
    //$("#gome_div").html("<input type='image' name='Go_Me' id='Go_Me' src='./elements/slug.png' width='100' height='100'>");
    $("#gome_div").html("<h1>じゃの</h1>");
    alert("じゃの");
}

function reduceHara() {
    var SlugStatus = NCMB.Object.extend("SlugStatus");
    var SlugStatusQuery = new NCMB.Query(SlugStatus);
    SlugStatusQuery.find({
        success: function(results){
            var hungryRate = results[results.length-1].get("hungryRate");
            var slugStatus = new SlugStatus();
            slugStatus.set("objectId","rm8M1SgcQgqp1ym2");
            slugStatus.set("hungryRate",hungryRate-1);
            slugStatus.save();
        }
    });
    
}

setInterval(reduceHara,100000);

function getSlugName() {
    if(NCMB.User.current()){
        var slugName = NCMB.User.current().get("userName");
        console.log(slugName);
        $("#namespace").text(slugName);
    }
}

var Size_width = 230;
var Size_height = 160;
var count = 0;
function Battle() {
    Size_width *= 0.9;
    Size_height *= 0.9;
    count++;
    $("#enemy_slug").html("<input type='image' src='./elements/sozai_003.png' name='enemy' width='" + Size_width +"' height='" + Size_height + "' onclick='Battle()'>");
}

function Battle_End() {
    Size_width = 230;
    Size_height = 160;
}