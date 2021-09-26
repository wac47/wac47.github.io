"use strict";

function changeSize(){
  var w=$(window).width();

  if(w<600){
    //$("html").css("font-size",w/600*10+"px");
    $(".paper").css("padding",w/600*36+"px");
  }else{
    //$("html").css("font-size","10px");
    $(".paper").css("padding","3.6rem");
  }

  document.querySelectorAll(".paper").forEach((elm, i) => {
    elm.style["min-height"] = $(elm).width()*1.41+"px";
  });
}

let testScore=0;
const logURL="http://script.google.com/macros/s/AKfycbwCZB5DrtXZEx6C_1quBZnAp0Ue4tvOhSpxJ6ynq6rkWkcuAoZjRPR_ag/exec";
let uid;
let trial;

$(function(){
  changeSize();
  $(window).resize(changeSize);

  const remainingProblem = [];

  document.querySelectorAll("[id*=problem]").forEach((problem,i) => {
    const problemID = problem.id;
    const problemNum = Number(problemID.replace("problem",""));

    if(problemNum){
      remainingProblem.push(problemNum);
    }
    problem.querySelectorAll("p").forEach((p,i)=>{
      p.innerHTML = p.innerHTML.replace(/①/g,`<span class="choice">①</span>`).replace(/②/g,`<span class="choice">②</span>`).replace(/③/g,`<span class="choice">③</span>`).replace(/④/g,`<span class="choice">④</span>`).replace(/⑥/g,`<span class="choice">⑥</span>`);
    })

    const choices = problem.querySelector(".choices");

    const correctAns = choices.dataset.correct;

    let lastSelected = -1;
    const selectAns = (choiceID) => {
      choices.querySelectorAll("li").forEach((li,i)=>{
        if((i+1) == choiceID){
          //liA.innerHTML = `<span class="choice">●</span>`+liA.innerText.slice(1);
          li.querySelector(".choice").innerHTML = `●`;
        }else{
          //liA.innerHTML = `<span class="choice">${toMaru(i+1)}</span>`+liA.innerText.slice(1);
          li.querySelector(".choice").innerHTML = toMaru(i+1);
        }
      });
      if(choiceID==lastSelected){
        answer(choiceID);
      }
      lastSelected = choiceID;
    }

    const answer = (choiceID) => {
      console.log(problemID+"-"+choiceID);

      //統計処理
      let problemPos = remainingProblem.indexOf(problemNum);
      if(problemPos>=0){
        if(correctAns==choiceID){
          testScore += Number(choices.dataset.score);
        }
        console.log(testScore);


        remainingProblem.splice(problemPos,1);
        if(remainingProblem.length==0){
          const tweetURL = "https://twitter.com/intent/tweet"
            + "?text=" + encodeURIComponent("100点満点中"+testScore+"点です！")
            + "%0A" + encodeURIComponent("#SWスピンオフ共通テスト2021")
            + "%0A" + encodeURIComponent("wac47.github.io/kyotsu_test/2021");
          document.querySelector("#tokuten p").innerHTML = ("<p>100点満点中"+testScore+"点です！</p><a href='"+tweetURL+"' target='_blank' class='tweetBtn'>結果をつぶやく</a>");
        }else{
          document.querySelector("#tokuten p").innerHTML = (remainingProblem.map(num=>`<a href="#problem${num}"><mark>${num}</mark></a>`).join("")+"が未回答です。");
        }
      }else{
        //console.error("");
      }

      //画面
      choices.querySelectorAll("li").forEach((li,i)=>{
        if((i+1) == correctAns){
          $(li).css("color","green");
        }else{
          $(li).css("color","red");
        }
        li.innerHTML = li.querySelector("a").innerHTML;
      });
      try{
        problem.querySelector(".commentary").style.display = "block";
      }catch(e){}

      //記録
      if(problemNum){
        const logScript = document.createElement("script");
        logScript.src = logURL+`?u=${uid}&t=${trial}&p=${problemNum}&a=${choiceID}&ts=${Date.now()}`;
        document.body.appendChild(logScript);
      }
    }

    choices.querySelectorAll("li").forEach((li,i) => {
      const choiceID = i+1;
      li.innerHTML = `<a href="#"><span class="choice">${toMaru(choiceID)}</span>${li.innerHTML}</a>`;
      li.querySelector("a").addEventListener("click",(e)=>{
        e.preventDefault();
        selectAns(choiceID);
      });
    });
  });

  document.querySelectorAll("[id*='block']").forEach(block=>{
    const blockID = block.id;
    block.querySelectorAll("em").forEach(em => {
      em.innerHTML = `<sub>${toMaru(em.dataset.id)}</sub><span class="uln">${em.innerHTML}</span>`;
      em.id = `${blockID}-${em.dataset.id}`;
    });
    block.querySelectorAll("[id*='problem']>p").forEach(question => {
      const html = question.innerHTML;
      const pos = html.indexOf("下線部");
      if(pos>=0){
        let underlineID = html.slice(pos+3,pos+4);
        let aHTML = html.slice(0,pos);
        aHTML += `<a href="#${blockID}-${underlineID}" class="underlineLink">`;
        aHTML += html.slice(pos,pos+3) + toMaru(underlineID);
        aHTML += `</a>`;
        aHTML += html.slice(pos+4);

        question.innerHTML = aHTML;
      }
    });
  });

  //location.href=location.href;


  if(localStorage.uid){
    uid=localStorage.uid;
  }else{
    uid=getUniqueStr()
    localStorage.uid=uid;
  }
  if(localStorage.trial2021){
    trial=Number(localStorage.trial2021)+1;
  }else{
    trial=1;
  }
  localStorage.trial2021=trial;

  console.log("uid:"+uid);
  console.log("trial:"+trial);

  try{
    const logScript = document.createElement("script");
    logScript.src = logURL+`?u=${uid}&t=${trial}&ts=${Date.now()}`;
    document.body.appendChild(logScript);
  }catch(e){
    console.log("logging failed");
  }
})


function toMaru(str){
  function intToMaru(int){
    let maru = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨"][int-1];
    return maru?maru:int;
  }
  function alpToMaru(alp){
    let maru = {"a":"ⓐ","b":"ⓑ","c":"ⓒ","d":"ⓓ","e":"ⓔ","f":"ⓕ"}[alp];
    return maru?maru:alp;
  }
  return intToMaru(alpToMaru(str));
}

function getUniqueStr(){
 return new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16)
}
