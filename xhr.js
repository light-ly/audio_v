var xmlHttp;
remoteURL = 'http://192.168.1.101:5000/req/'

function createXMLHttpRequest() {
    //Mozilla 浏览器（将XMLHttpRequest对象作为本地浏览器对象来创建）
    if (window.XMLHttpRequest) { //Mozilla 浏览器
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) { //IE浏览器
        //IE浏览器（将XMLHttpRequest对象作为ActiveX对象来创建）
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    if (xmlHttp == null) {
        alert("不能创建XMLHttpRequest对象");
        return false;
    }
}

//用于发出异步请求的方法
// function sendAsynchronRequest(url,parameter,callback){
function sendAsynchronRequest(url, parameter) {
    createXMLHttpRequest();
    // if (parameter == null) {
    //设置一个事件处理器，当XMLHttp状态发生变化，就会出发该事件处理器，由他调用
    //callback指定的javascript函数
    // xmlHttp.onreadystatechange = callback;
    //设置对拂去其调用的参数（提交的方式，请求的的url，请求的类型（异步请求））
    xmlHttp.open("GET", url + parameter, true);//true表示发出一个异步的请求。
    xmlHttp.send(null);
    // } else {
    // xmlHttp.onreadystatechange = callback;
    // xmlHttp.open("POST", url, true);
    // xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    // xmlHttp.send(parameter);
    // }
}

// 指定回调方法
// function loadCallBack() {
//     try {
//         if (xmlHttp.readyState == 4) {
//             if (xmlHttp.status == 200) {
//                 if (xmlHttp.responseText != null && xmlHttp.responseText != "") {
//                     var divProid = document.getElementById('videolist');
//                     divProid.innerHTML = xmlHttp.responseText;
//                     for (i = 0; i < len; i++) {
//                         var video_url = document.getElementById("videolist" + i + "").href;
//                         if (video_url != undefined && video_url != null && video_url != "") {
//                             window.location.href = video_url;
//                         }
//                     }
//                 }
//             }
//         }
//         if (xmlHttp.readyState == 1) {
//             alert("正在加载连接对象......");
// }
// if (xmlHttp.readyState == 2) {
//     alert("连接对象加载完毕。");
// }
// if (xmlHttp.readyState == 3) {
//     alert("数据获取中......");
// }
// } catch (e) {
//     alert(e);
// }
// }