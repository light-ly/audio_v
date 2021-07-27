// load screen
var screenHeight = document.documentElement.clientHeight,
  screenWidth = document.documentElement.clientWidth;
// init canvas
var width = canvas.width,
  height = canvas.height;

var audio = new Audio();
audio.src = 'dream.mp3';
audio.preload = 'auto';

audio.oncanplaythrough = function () {
  if (screenWidth != width || screenHeight != height) {
    zoomPage();
  }
  loader.innerHTML =
    '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1105" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M900.571429 529.700571L141.714286 951.405714c-17.700571 9.728-32 1.133714-32-18.870857v-841.142857c0-20.004571 14.299429-28.562286 32-18.870857l758.857143 421.705143c17.700571 9.728 17.700571 25.709714 0 35.437714z" fill="#2c2c2c" p-id="1106"></path></svg>';
  document.addEventListener("click", function () {
    init();
    loader.style.display = "none";
    audio.play();
    draw();
    document.removeEventListener("click", arguments.callee);
  });
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
  // loadmedia
  AudioContext = AudioContext || webkitAudioContext;
  context = new AudioContext();

  // creat AnalyserNode
  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  // connect：source → analyser → destination
  source.connect(analyser);
  analyser.connect(context.destination);

  p = canvas.getContext("2d");
  // penBg = bg.getContext("2d");

  analyser.fftSize = 4096;
  var length = analyser.fftSize;
  // creat data
  dataArray = new Uint8Array(length);

  // linear gradientcolor
  gradient = p.createLinearGradient(0, 100, 1360, 100);
  gradient.addColorStop("0", "#f500d8");
  gradient.addColorStop("0.25", "#ceaf11");
  gradient.addColorStop("0.5", "#0ee7f7");
  gradient.addColorStop("1", "#2ce672");
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  p.clearRect(0, 0, width, height);
  //左

  //左填充
  p.beginPath();
  p.moveTo(0, height - 200);
  var x = 0;
  for (var i = 1; i < Math.trunc(width/12); i++) {
    var lineHeight = ((dataArray[i] / 256) * height) / 3;
    if (i < 5) {
      p.lineTo(x, height - ((dataArray[i] / 256) * height) / 2 - 200);
    } else if (i > 110) {
      p.lineTo(x - 13, height - 200);
    } else {
      p.lineTo(x, height - lineHeight - 200);
    }
    x += 12;
  }
  p.lineTo(x, height - 299);
  p.fillStyle = gradient;
  p.fill();
  p.closePath();

  //左线条
  p.beginPath();
  p.moveTo(0, height - 200);
  var x = 0;
  for (var i = 1; i < Math.trunc(width/12); i++) {
    var lineHeight = ((dataArray[i] / 256) * height) / 3;
    if (i < 5) {
      p.lineTo(
        x,
        height -
          ((dataArray[i] / 256) * height) / 2 -
          210 -
          Math.floor(Math.random() * 30)
      );
    } else if (i > 110) {
      p.lineTo(x - 13, height - 220);
    } else {
      p.lineTo(x, height - lineHeight - 210 - Math.floor(Math.random() * 30));
    }
    x += 12;
  }
  p.lineTo(x, height - 299);
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
  for (var i = 1; i < Math.trunc(width/12); i++) {
    var lineHeight = ((dataArray[i] / 256) * height) / 50;
    if (i < 5) {
      p.lineTo(x, ((dataArray[i] / 256) * height) / 24 + 380);
    } else p.lineTo(x, lineHeight + 380);
    x += 12;
  }
  p.lineTo(x, height - 299);
  p.fillStyle = "#21dd13";

  p.shadowBlur = 20;
  p.shadowColor = "#21dd13";
  p.fill();
  p.closePath();
  p.shadowBlur = 0;
}
