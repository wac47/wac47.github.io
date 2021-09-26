var que=0;//現在出題中の問題
var flashCards=[];//出題対象
var langName="Aurebesh";

$(function(){
  Object.keys(scripts).forEach(function(key){
    //$("<li><a href=\"javascript:setting('"+key+"');\">"+key+" Learning</a></li>").appendTo("ul");
  });
  setting("Aurebesh");
  $("form").submit(function(){
    if($("input").val()==getAnswer()){//正解
      $("#answer").attr("placeholder","");
      flashCards.splice(que,1);
      if(flashCards.length==0){
        finale();
      }else{
        next();
      }
    }else{//不正解
      if(getAnswer().length<=2) $("#answer").attr("placeholder",getAnswer());//単語テストでは正答を表示しない
    }
    $("#answer").val("").select();
    return false;
  });
  
  $("#complete").dialog({
    autoOpen:false,
    modal:true,
    buttons:{
      "もう一度やる":function(){
        location.reload();
      }
    }
  });
  
  $("#answer").val("").select();
});

function setting(lang){
  $(".lang").html(lang);
  langName=lang;
  $("#quebox").css("font-family",lang);
  flashCards=[].concat(scripts[lang]);
  console.log(flashCards);
  next();
}
function next(){//次の出題
  que=Math.floor(Math.random(Date.now())*(flashCards.length));
  $("#quebox").html(getSubstitute());
}

function finale(){
  $("#complete").dialog("open");
}

function getAnswer(){//正答を返す
  if(typeof flashCards[que]=='string'){
    return flashCards[que];
  }else{
    return flashCards[que][1];
  }
}
function getSubstitute(){//表示用文字列を返す
  if(typeof flashCards[que]=='string'){
    return flashCards[que];
  }else{
    return flashCards[que][0];
  }
}



var scripts={
  Aurebesh:['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    ['C','ch'],['A','ae'],['E','eo'],['K','kh'],['N','ng'],['O','oo'],['S','sh'],['T','th']
  ],
  Mandalorian:['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','0','1','2','3','4','5','6','7','8','9']
};
