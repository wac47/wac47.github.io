var starttime;
var typedChar=0;//打ち込み文字数
var timerID;
var countDown=4;//開始前の3,2,1
var tweetURL;

$(function(){
  $("#complete").dialog({
    autoOpen:false,
    modal:true,
    buttons:{
      "結果をつぶやく":function(){
        open(tweetURL);
        $("#complete").dialog("close");
      },
      "もう一度やる":function(){
        location.reload();
      }
    }
  });
});

function setting(lang){
  $(".lang").html(lang);
  langName=lang;
  $("#quebox").css("font-family",lang);
  flashCards=[].concat(words);
  console.log(flashCards);
  next();
}
function typingStart(){
  if(countDown==4){
    $("#initial").css("display","none");
    $("#prepare").css("display","block");
  }else if(countDown==1){
    $("#prepare").css("display","none");
    $("#testField").css("display","block");
    $("#answer").focus();
    starttime=Date.now();
    timerID = setInterval(tiktok,33);
  }
  countDown--;
  $("#prepare p").html(countDown);
  if(countDown>0) setTimeout(typingStart,1000);
}
function next(){//次の出題
  if(typedChar>100){
    finale();
  }else{
    que=Math.floor(Math.random(Date.now())*(flashCards.length));
    $("#quebox").html(getSubstitute());
    typedChar = typedChar + getAnswer().length;
  }
}

function finale(){
  clearInterval(timerID);
  var typingSpeed=(typedChar/(timeelapse/1000)).toFixed(2)+"字/秒"
  
  $("#typingSpeed").html(typingSpeed);
  
  tweetURL = "https://twitter.com/intent/tweet";
  tweetURL += "?text=" + encodeURIComponent("私の"+langName+"読解速度は、"+typingSpeed+"です。");
  tweetURL += "%0A" + encodeURIComponent("#"+langName+"定着度テスト");
  tweetURL += "%0A" + encodeURIComponent("wac47.github.io/Writing/Typing/");
  $("#complete").dialog("open");
}

function tiktok(){
  timeelapse=Date.now() - starttime;
  var myHour =("0"+Math.floor(timeelapse/(1000*60*60))).slice(-2);
  var myMin  =("0"+Math.floor((timeelapse/(1000*60))%60)).slice(-2);
  var mySec  =("0"+Math.floor((timeelapse/(1000))%60)).slice(-2);
  var myMilli=("0"+Math.floor((timeelapse/10)%100)).slice(-2);
  $("#timeElapse").html(myHour+":"+myMin+":"+mySec+":"+myMilli);
}
words=[
  "abyssin",
  "advozse",
  "aqualish",
  "arcona",
  "bimm",
  "bith",
  "chadra-fan",
  "devaronian",
  "dianoga",
  "duros",
  "givin",
  "gotal",
  "h'nemthe",
  "human",
  //"hutt",
  "ithorian",
  "jawa",
  //"kintan strider",
  "kubaz",
  "lamproid",
  "lutrillian",
  "morseerian",
  "nimbanel",
  "pacithhip",
  "rodian",
  "sakiyan",
  "sarkan",
  "saurin",
  "siniteen",
  "snivvian",
  "talz",
  "tusken raider",
  "vuvrian",
  "wookiee",
  "yam'rii"
];
