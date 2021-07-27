// load screen
var screenHeight = document.body.clientHeight,
  screenWidth = document.body.clientWidth;
// init canvas
var width = canvas.width,
  height = canvas.height;

var audio = new Audio("hello.mp4");

audio.crossOrigin = 'anonymous';

audio.oncanplaythrough = function () {
  if (screenWidth != width || screenHeight != height) {
    zoomPage();
    loader.innerHTML =
      '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1105" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M900.571429 529.700571L141.714286 951.405714c-17.700571 9.728-32 1.133714-32-18.870857v-841.142857c0-20.004571 14.299429-28.562286 32-18.870857l758.857143 421.705143c17.700571 9.728 17.700571 25.709714 0 35.437714z" fill="#2c2c2c" p-id="1106"></path></svg>';
  }

  document.addEventListener("click", function () {
    init();
    loader.style.display = "none";
    audio.play();
    // fontCSSAnimation();
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
  // console.log("执行了zoom操作:", scaleX, scaleY);
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

  gradient = p.createLinearGradient(0, 100, 1360, 100);
  gradient.addColorStop("0", "#f500d8");
  gradient.addColorStop("1.0", "#ceaf11");
}
