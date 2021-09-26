"use strict";

let result;
let searching=false;
let queryTS;
let idx;
let tweets;
let intervalID;
const $_GET={};
$(()=>{
  result = $("#result");

  let getParameterStr = location.href.split("?")[1];
  if(getParameterStr){
    getParameterStr = getParameterStr.replace(/\+/g," ")
    getParameterStr = getParameterStr.replace(/%3A/g,":")
    getParameterStr.split("&").forEach((str) => {
      let tmp = str.indexOf("=");
      if(tmp>=0){
        $_GET[str.slice(0,tmp)]=decodeURI(str.slice(tmp+1));
      }else{
        $_GET[str]=true;
      }
    });
  }
  $("form").submit(()=>{
    if(searching){
      console.log("Working on it!");
      return false;
    }
    //return false;
  });

  $("input").focusin(()=>{
    $("form").addClass("selected");
  }).focusout(()=>{
    $("form").removeClass("selected");
  });

  if($_GET["q"]){
    $("#q").val($_GET["q"]);

    searching=true;
    const query = $("#q").val();
    const queryURL = "https://script.google.com/macros/s/AKfycbxpdSL9Y6480IghAoP8T_3nB4KvC9dr_ZyEJcAFZPMYe9cL3o3oBkcBMBYWhwTpZ10G/exec?q="+encodeURI($_GET["q"])+"&callback=displayTweets";
    $(`<script src="${queryURL}"></script>`).appendTo("body");
    result.html(`<span class="cp_loading01"> </span>`);
    console.log('Requesting query: %o', queryURL);
    queryTS = Date.now();
    $("input").blur();
    //$(".tw_des").hide(4000);

    $("#result").css("min-height",$(window).height() - $("#tw_header").height() - 10 +"px");

    setTimeout(()=>{
      $("#tw_header").css({
        "position":"fixed",
        "top":"0",
        "max-width":"calc(40rem - 4px)",
        "width":"calc(100% - 4px)",
      });
      $("#result").css("padding-top",$("#tw_header").height()+"px");
    },4000);
  }else{
    $("#result").css("min-height",$(window).height() - $("#tw_header").height() - 30 +"px");
  }
});

const displayTweets = (APIresult)=>{
  console.log(`Result returned in ${Date.now() - queryTS} ms`);
  if(!APIresult.ok){
    console.log("Search API failed");
    result.html("Something went wrong!");
    searching=false;
    return false;
  }
  console.log("Search API successfully worked!");
  result.empty();
  tweets = APIresult.tweets;
  idx=0;
  clearInterval(intervalID);
  intervalID = setInterval(displayTweet,2);
  searching=false;
}

function displayTweet(){
  const tweet=tweets[idx];
  if(!tweet){
    clearInterval(intervalID);
    console.log(`Result displayed in ${Date.now() - queryTS} ms`);
    return false;
  }
  idx++;

  let full_text = tweet[2].replace(/\n/g, '<br>');
  let nameBox;
  if(tweet[1]=="@wac_47"){
    nameBox = `<h2><a href="https://twitter.com/wac_47" target="_blank">𐀷كو</a></h2><span>@wac_47</span>`;
  }else{
    nameBox = `<h2><a href="https://twitter.com/${tweet[1].slice(1)}" target="_blank">${tweet[1]}</a></h2>`;
  }

  let date=new Date(tweet[0]);
  date.setDate(date.getDate()+1);

  const tw = $(`
    <section>
      <div class="infos">
        ${nameBox}
        <time> ・ <a href="?q=until:${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}" target="_blank">${getTwitterStyleDate(tweet[0])}</a></time>
        <div><svg><use xlink:href="#setting"></use></div></svg>
      </div>
      <p>${full_text}</p>
      <div class="icons">
        <svg><use xlink:href="#reply"></use></svg>
        <svg><use xlink:href="#retweet"></use></svg>
        <svg><use xlink:href="#fave"></use></svg>
        <svg><use xlink:href="#share"></use></svg>
      </div>
    </section>
  `).appendTo(result).click(()=>{
    window.open(tweet[3]);
  })
  tw.find("a").click(function(event){
    event.stopPropagation();
    return true;
  });
  /*
  tw.find(".infos div").click((e)=>{
    e.stopPropagation();
    let date=new Date(tweet[0]);
    date.setDate(date.getDate()+1);
    window.open(`?q=until:${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}`);
  });*/
}

function getTwitterStyleDate(str){
  const date = new Date(str);
  const nowDate = new Date();
  //s,m表示は無し(新しいツイートに使うことは想定されていない)
  if((nowDate.getTime() - date.getTime())<(1000*60*60*24)){
    return Math.ceil((nowDate.getTime() - date.getTime())/(1000*60*60)) + "h";
  }
  let MonDate = months[date.getMonth()]+" "+date.getDate();
  if(date.getFullYear()==nowDate.getFullYear()){
    return MonDate;
  }else{
    return MonDate + ", " + date.getFullYear();
  }
}
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
