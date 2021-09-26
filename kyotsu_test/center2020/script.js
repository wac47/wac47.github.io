function changeSize(){
  var w=$(window).width();
  if(w<600){
    $("html").css("font-size",w/600*10+"px");
    $(".paper").css("padding",w/600*36+"px");
  }else{
    $("html").css("font-size","10px");
    $(".paper").css("padding","3.6rem");
  }
}
var testScore=0;
var answeredProblem=0;
const logURL="https://script.google.com/macros/s/AKfycbwTaDN4ZIL9DMcsVRUyB_c0DUcbCVrolviP8K5JqfybW3vOXWE/exec";
var uid;

$(function(){
  changeSize();
  $(window).resize(changeSize);
  $("ul.problem").each(function(index, element){
    $(element).attr("data-pid",index+1);
  })
  $("ul li").click(function(){
    var theUL=$(this).parent();
    if(theUL.hasClass("answered")){
      return;
    }
    answeredProblem++;
    var currectAnswer=theUL.attr("data-currect");
    if($(this).children("span").text()==currectAnswer){
      testScore+=parseInt(theUL.attr("data-score"));
    }
    $(this).children("span").text("●")
    theUL.addClass("answered");
    theUL.next("section").css("display","block");
    theUL.children("li").css("color","red")
                        .eq(maruToInt(currectAnswer)-1).css("color","green");

    $.ajax({
      type: "get",
      url: logURL,
      data: {
        uid: uid,
        pid: theUL.attr("data-pid"),
        ans: theUL.children().index(this)+1
      },
      dataType: "json",
      success: function(data, dataType){}
    });

    if(answeredProblem==18){
      var tweetURL = "https://twitter.com/intent/tweet";
      tweetURL += "?text=" + encodeURIComponent("100点満点中"+testScore+"点です！");
      tweetURL += "%0A" + encodeURIComponent("#SWスピンオフ定着度テスト2020");
      tweetURL += "%0A" + encodeURIComponent("wac47.github.io/kyotsu_test/center2020");
      $("#tokuten").html("<p>100点満点中"+testScore+"点です！</p><a href='"+tweetURL+"' target='_blank'>結果をつぶやく</a>")
        .css("display","block");
    }
  });

  if(location.search=="?test"){
    uid="test";
    localStorage.removeItem("uid");
  }else{
    if(localStorage.uid){
      uid=localStorage.uid;
    }else{
      uid=getUniqueStr()
      localStorage.uid=uid;
    }
  }
  console.log("uid:"+uid);

  $.ajax({
    type: "get",
    url: logURL,
    data: {
      uid: uid,
      pid: '0'
    },
    dataType: "json",
    success: function(data, dataType){}
  });
})
function maruToInt(str){
  switch(str){
    case "①":
      return 1;
      break;
    case "②":
      return 2;
      break;
    case "③":
      return 3;
      break;
    case "④":
      return 4;
      break;
    case "⑤":
      return 5;
      break;
    case "⑥":
      return 6;
      break;
    default:
      return NaN;
      break;
  }
}

function getUniqueStr(){
 return new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16)
}
