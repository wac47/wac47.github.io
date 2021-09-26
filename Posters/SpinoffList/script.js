$(function(){
  //setInterval(subTrans,30);
  $("td img").click(function(){
    $("#dialog h2").html("");
    $("#dialog p").html("");
    $("#dialog h2").html($(this).next().html());
    $("#dialog p").html($(this).next().next().html());
    $("#dialog").css("display","block");
    return false;
  });
  $("#dialog").click(function(){
    return false;
  });
  $("html").click(function(){
    $("#dialog").css("display","none");
  });
  $("tbody").css("height",$(window).height()-50+"px");
});

function subTrans(){
  $(".sub").css("left",Math.sin((Date.now()%1000)*2*Math.PI/1000)*1+"px");
}
