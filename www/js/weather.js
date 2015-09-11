// This is a JavaScript file

// 位置情報を取得し，それに応じた現在地の天気を取得する
$(function() {
   
});

document.addEventListener("pageinit", function(e){
    if (e.target.id == "page1") {
        find();
    }
});

//位置情報取得に成功した場合のコールバック
var onSuccess = function(position){
    var current = new CurrentPoint();
    current.distance = CurrentPoint.distance;   //検索範囲の半径を保持する
    current.geopoint = position.coords;         //位置情報を保存する
    getWeather(current);
};

//位置情報取得に失敗した場合のコールバック
var onError = function(error){
    console.log("現在位置を取得できませんでした");
    current = {"geopoint.longitude":140, "geopoint.latitude":40};
    getWeater(current);
};

//位置情報取得時に設定するオプション
var option = {
    timeout: 60000   //タイムアウト値(ミリ秒)
};

//現在地を取得する
function find(){
    CurrentPoint.distance = 5; //検索距離を5kmに設定
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
}

//現在地を保持するクラスを作成
function CurrentPoint(){
    geopoint=null;  //端末の位置情報を保持する
    distance=0;     //位置情報検索に利用するための検索距離を指定する
}

// 緯度と経度から天気情報を取得する
function getWeather (current) {

    //var x = 35;
    //var y = 140;
    var long = current.geopoint.longitude;
    var lat = current.geopoint.latitude;

    console.log(lat, long);

    var url = "http://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + long;

   $.getJSON(url, function(data) {
        weather = data.weather[0].main;
        //console.log(weather);
        displayWeather(weather);
   });
}

// お天気マークを表示する
function displayWeather(weather) {
    console.log(weather);
    switch(weather) {
        case "Clear": 
            img = 'elements/sozai_004.png';
            break;
        case "Rain":
            img = 'elements/sozai_002.png';
            break;
        case "Cloud":
            img = 'elements/sozai_005.png';
            break;
        case "Snow":
            img = 'elements/sozai_001.png';
            break;
        default:
            img = "";
    }
        $("#now_weather").html("<img id='weather' src="+img+" width='140' height='80'>");
    
}

