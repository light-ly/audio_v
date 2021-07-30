// load screen
var screenHeight = document.documentElement.clientHeight,
    screenWidth = document.documentElement.clientWidth;
// init canvas
var width = canvas.width,
    height = canvas.height;
// 0:本地文件   1:麦克风
var flag = 0
// 1:第一次加载 0:非第一次加载 2:退出重选
var isInit = 1;
var entropy = 0;
remoteURL = 'http://192.168.0.102:5000'

var isDraw = 1; 

const img_analyzer = new Image();
const img_oth = new Image();
var audio = new Audio();
audio.src = '';
audio.preload = 'auto';

//隐藏按钮
var f = document.getElementsByClassName("bf");
for (var i = 0; i < f.length; i++)
    f.item(i).setAttribute("style", "display: none");

function board() {
    img_oth.src = remoteURL + "?board";
}

function blink() {
    img_oth.src = remoteURL + "?blink";
}

function time() {
    img_oth.src = remoteURL + "?time";
}

function exit() {
    isDraw = 0;
    isInit = 2;
    if (flag == 0)
        audio.pause();
    var f = document.getElementsByClassName("bf");
    for (var i = 0; i < f.length; i++)
        f.item(i).setAttribute("style", "display: none");

    a_file.style.display = "";
    a_stream.style.display = "";
    div1.style.display = "";
    button5.style.display = "";
    button6.style.display = "";
    button7.style.display = "";

    // createXMLHttpRequest();
    img_analyzer.src = remoteURL + "?exit";
}

function reloadFile() {
    isInit = 0;
    audio.pause();
    onInputFileChange();
}

function reload() {
    audio.currentTime = 0;
}

function pause() {
    if (audio !== null) {
        //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
        alert(audio.paused);
        if (audio.paused) {
            audio.play();//audio.play();// 这个就是播放
        } else {
            audio.pause();// 这个就是暂停
        }
    }
}

function onMediaStream() {
    if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(function (stream) {
                audio = stream;
                flag = 1;
                console.log('getUserMedia Success.');

                init();
                isDraw = 1;
                draw();
            })
    }
}

function onInputFileChange() {
    audio = new Audio();
    audio.preload = 'auto';
    if (isInit == 0)
        files = document.getElementById('file2');
    else
        files = document.getElementById('file');

    url = URL.createObjectURL(files.files[0]);
    console.log(url);
    audio.src = url;
    flag = 0;

    if (isInit !== 0)
        init();
    audio.play();
    isDraw = 1;
    draw();
}

audio.oncanplaythrough = function () {
    if (screenWidth != width || screenHeight != height) {
        zoomPage();
    }
};

// fit screen
function zoomPage() {
    var scaleX = (screenWidth / width).toPrecision(5),
        scaleY = (screenHeight / height).toPrecision(5);

    var style = document.createElement("style");
    document.head.appendChild(style);
    sheet = style.sheet;
    sheet.insertRule(
        "body{transform-origin:0% 0%;transform:scale(" +
        scaleX +
        "," +
        scaleY +
        ");}",
        0
    );
    console.log("执行了zoom操作:", scaleX, scaleY);
}

function init() {
    loader.innerHTML =
        '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1105" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M900.571429 529.700571L141.714286 951.405714c-17.700571 9.728-32 1.133714-32-18.870857v-841.142857c0-20.004571 14.299429-28.562286 32-18.870857l758.857143 421.705143c17.700571 9.728 17.700571 25.709714 0 35.437714z" fill="#2c2c2c" p-id="1106"></path></svg>';
    loader.style.display = "none";
    a_file.style.display = "none";
    a_stream.style.display = "none";
    div1.style.display = "none";
    button5.style.display = "none";
    button5.style.display = "none";
    button5.style.display = "none";

    // loadmedia
    AudioContext = AudioContext || webkitAudioContext;
    context = new AudioContext();

    // creat AnalyserNode
    if (flag == 0) {
        source = context.createMediaElementSource(audio);
        for (var i = 0; i < f.length; i++)
            f.item(i).setAttribute("style", "display: ");
    } else if (flag == 1) {
        button4.style.display = "";
        source = context.createMediaStreamSource(audio);
    }
    analyser = context.createAnalyser();
    chipAnalyzer = context.createAnalyser();
    // connect：source → analyser → destination
    source.connect(chipAnalyzer);
    source.connect(analyser);
    if (flag == 0)
        analyser.connect(context.destination);

    p = canvas.getContext("2d");
    // penBg = bg.getContext("2d");

    chipAnalyzer.fftSize = 64;
    analyser.fftSize = 4096;
    var length = analyser.fftSize;
    // creat data
    dataArray = new Uint8Array(length);
    chipArray = new Uint8Array(64);

    // linear gradientcolor
    gradient = p.createLinearGradient(0, 100, 1360, 100);
    gradient.addColorStop("0", "#f500d8");
    gradient.addColorStop("0.25", "#ceaf11");
    gradient.addColorStop("0.5", "#0ee7f7");
    gradient.addColorStop("1", "#2ce672");
}

function draw() {
    entropy += 1;
    chipAnalyzer.getByteFrequencyData(chipArray);
    if (entropy > 18 && isDraw) {
        img_analyzer.src = remoteURL + "?analyzer=" + chipArray;
        entropy = 0;
    }
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    p.clearRect(0, 0, width, height);
    //左

    //左填充
    p.beginPath();
    p.moveTo(0, height - 200);
    var x = 0;
    for (var i = 1; i < Math.trunc(width / 6); i++) {
        var lineHeight = ((dataArray[i] / 256) * height) / 3;
        if (i < 5) {
            p.lineTo(x, height - ((dataArray[i] / 256) * height) / 2 - 200);
        } else if (i > Math.trunc(width / 6) - 4) {
            p.lineTo(x, height - 200);
        } else {
            p.lineTo(x, height - lineHeight - 200);
        }
        x += 6;
    }
    p.lineTo(width + 6, height - 299);
    p.fillStyle = gradient;
    p.fill();
    p.closePath();

    //左线条
    p.beginPath();
    p.moveTo(0, height - 200);
    var x = 0;
    for (var i = 1; i < Math.trunc(width / 6); i++) {
        var lineHeight = ((dataArray[i] / 256) * height) / 3;
        if (i < 5) {
            p.lineTo(
                x,
                height -
                ((dataArray[i] / 256) * height) / 2 -
                210 -
                Math.floor(Math.random() * 30)
            );
        } else if (i > Math.trunc(width / 6) - 4) {
            p.lineTo(x, height - 220);
        } else {
            p.lineTo(x, height - lineHeight - 210 - Math.floor(Math.random() * 30));
        }
        x += 6;
    }
    p.lineTo(width + 6, height - 299);
    p.strokeStyle = gradient;
    p.stroke();
    p.closePath();

    //清除底部部分频谱
    p.fillStyle = "#fff";
    p.fillRect(0, height - 300, 1366, 101);

    //左倒影
    p.beginPath();
    p.moveTo(0, height - 299);
    var x = 0;
    for (var i = 1; i < Math.trunc(width / 6); i++) {
        var lineHeight = ((dataArray[i] / 256) * height) / 50;
        if (i < 5) {
            p.lineTo(x, ((dataArray[i] / 256) * height) / 24 + 380);
        } else p.lineTo(x, lineHeight + 380);
        x += 6;
    }
    p.lineTo(width, height - 299);
    p.fillStyle = "#21dd13";

    p.shadowBlur = 20;
    p.shadowColor = "#21dd13";
    p.fill();
    p.closePath();
    p.shadowBlur = 0;
}
