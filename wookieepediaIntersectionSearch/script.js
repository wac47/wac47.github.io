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
        $_GET[str.slice(0,tmp)]=decodeURIComponent(str.slice(tmp+1));
      }else{
        $_GET[str]=true;
      }
    });
  }

  const category1 = ($_GET.category1 || "Canon_articles").replace(/ /g,"_");
  const category2 = ($_GET.category2 || "").replace(/ /g,"_");
  const excategories = ($_GET.excategories || "").replace(/ /g,"_").split(",");

  $("form").submit((e)=>{
    if(searching){
      console.log("Working on it!");
      e.preventDefault();
    }else{
      //search();
    }
  });

  $("#category1").val(category1);
  $("#category2").val(category2);
  $("#excategories").val(excategories);

  if(category1 && category2) search();
});

function search(){
  searching=true;
  $(".cp_loading01").css("display","block");
  $("#result p").html("");
  $("#result small").html("");
  $("#result ul").empty();

  const queryURL = "https://script.google.com/macros/s/AKfycbwiAbSFzhMBPNyw32XkwyLr_TW2uV1W880SLVYlAqUYhmJ76bB9PSqJsHuouR3sd-q3/exec"
    +"?category1="+encodeURIComponent($("#category1").val())
    +"&category2="+encodeURIComponent($("#category2").val())
    +"&excategories="+encodeURIComponent($("#excategories").val())
    +"&callback=displayResults";
  $(`<script src="${queryURL}"></script>`).appendTo("body");
}

function displayResults(results){
  searching=false;
  $(".cp_loading01").css("display","none");

  const category1 = $("#category1").val();
  const category2 = $("#category2").val();
  const excategories = $("#excategories").val().split(",");
  let searchHTML = `Intersection of <a href="https://starwars.fandom.com/wiki/Category:${category1}">Category:${category1}</a>`
    + ` and <a href="https://starwars.fandom.com/wiki/Category:${category2}">Category:${category2}</a>`;
  if(excategories.length>0 && excategories[0]){
    searchHTML += ` except ` + excategories.map(excategory=>`<a href="https://starwars.fandom.com/wiki/Category:${excategory}">Category:${excategory}</a> `).join(`and `)
  }
  $("#result p").html(searchHTML);
  $("#result small").html(`(${results.length} articles)`);

  const ul = $("#result ul");
  results.forEach(result=>{
    $(`<li><a href="https://starwars.fandom.com/wiki/${result}">${result}</a></li>`).appendTo(ul);
  })
}