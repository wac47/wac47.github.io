$(function(){
  $('#imgSlctr').on('change', function (e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        $("#mainImg").attr('src', e.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  });
});

function beforeScreenshot(){
  $("p input").each(function(){
    if(this.value==""){
      $(this).parent().parent().css("display","none").addClass("nowHidden");
    }
  });
  $("li input").each(function(){
    if(this.value==""){
      $(this).parent().css("display","none").addClass("nowHidden");
    }
  });
  $(".canonicity input").each(function(){
    if(!this.checked){
      $(this).parent().css("display","none").addClass("nowHidden");
    }
  });
  $("h1 input, p input, li input").each(function(){
    $("+span",this).html(encodeWiki(this.value));
  });
  $("input + span").css("display","inline");
  $("textarea + span").html(encodeWiki($("textarea").val())).css("display","inline");
  $("input,textarea").css("display","none");
}
function afterScreenshot(){
  $("input").css("display","inline");
  $("textarea").css("display","block");
  $(".nowHidden").css("display","block").removeClass("nowHidden");
  $("textarea + span, input + span").css("display","none");
}
function encodeWiki(str){
  str=str.replace("'''","<b>").replace("'''","</b>");
  str=str.replace(/\[{2}/g, "<span class='link'>")
  .replace(/\]{2}/g, "</span>");
  str= str.replace(/\[/g, "<sup class='link'>[")
  .replace(/\]/g, "]</sup>");
  return str;
}
