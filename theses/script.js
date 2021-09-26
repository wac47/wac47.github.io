function changeSize(print){
  var w=$(window).width();
  
  if(w<600 || print==1){
    $("html").css("font-size",w/600*10+"px");
    $("#cover, #toc, #main > section").css("padding",w/600*36+"px");
    $("#cover > div").css({
      "width":w/600*528+"px",
      "height":w/600*777+"px"
    });
    $("figure img").css("max-width",w/600*500+"px");
  }else{
    $("html").css("font-size","10px");
    $("#cover, #toc, #main > section").css("padding","3.6rem");
    $("figure img").css("max-width","500px");
    $("#cover > div").css({
      "width":"528px",
      "height":"777px"
    });
  }
}

window.onbeforeprint=function(){
  changeSize(1);
}

$(function(){
  changeSize();
  $(window).resize(changeSize);
  
  //目次作成
  if($('#toc').length==0) return;
  // 目次の出力に使用する変数
  var toc = '<h2>目次</h2><ul>';
  // 目次の階層の判断に使用する変数
  var hierarchy=2;
  // h2・h3の判断に使用する変数
  var element;
  // ループの回数をカウントする変数
  var count2 = 0;
  var count3 = 0;
  var count4 = 0;
  
  $('#main h2, #main h3, #main h4').each(function(){
    // 現在のループで扱う要素を判断する条件分岐
    if(this.nodeName == 'H2'){
      element = 2;
      count2++;
      count3=0;
      count4=0;
      this.id = 'chapter' + count2;
      if(!$(this).hasClass("nonum")) this.innerHTML = "第" + count2 + "章 " + this.innerHTML;
    }else if(this.nodeName == 'H3'){
      element = 3;
      count3++;
      count4=0;
      this.id = 'chapter' + count2 + "." + count3;
      if(!$(this).hasClass("nonum")) this.innerHTML = count2 + "." + count3 + " " + this.innerHTML;
    }else if(this.nodeName == 'H4'){
      element = 4;
      count4++;
      this.id = 'chapter' + count2 + "." + count3 + "." + count4;
      if(!$(this).hasClass("nonum")) this.innerHTML = count2 + "." + count3 + "." + count4 + " " + this.innerHTML;
    }
        
    // 現在の状態を判断する条件分岐
    if(hierarchy === element){ // 同一レベルの要素が連続する場合
      toc += '</li>';
    }else if(hierarchy < element){ // レベルが下るとき
      toc += '<ul>';
    }else if(hierarchy > element){ // レベルが上がるとき
      toc += '</li></ul></li>';
    }
    hierarchy=element;
        
    // 目次の項目を作成
    toc += '<li><a href="#' + this.id + '">' + $(this).html() + '</a>';
  });
  // タグを閉じる
  while(hierarchy==1){
    toc += '</li></ul>';
    hierarchy--;
  }
  //目次内容書き込み
  $('#toc').html(toc);
  
  //図表番号追加
  var figcount=0;
  $('figure figcaption').each(function(){
    figcount++;
    $(this).html("図" + figcount + " " + $(this).html());
  });
  
  //注釈追加
  var comcount=0;
  $('#comments li').each(function(){
    comcount++;
    var comid=this.id;
    var commented = $("a[href='#" + comid + "']");
    if(commented.length==0){
      //comcount--;
      //$(this).css("display","none");
    }else if(commented.length==1){
      commented.attr("id",this.id+"_com");
      $(this).html("<a href='#"+comid+"_com"+"'>^</a> "+$(this).html());
    }else{
      var commentedcount=0;
      commented.each(function(){
        commentedcount++;
        $(this).attr("id",refid+"_com"+commentedcount);
      });
      while(commentedcount>0){
        commentedcount--;
        $(this).html("<sup><a href='#"+this.id+"_com"+(commentedcount+1)+"'>"+alphabet[commentedcount]+"</a> </sup>"+$(this).html());
      }
      $(this).html("^ "+$(this).html());
    }
    commented.html("<sup>*"+comcount+"</sup>").addClass("note");
  });
  
  //参考資料追加
  var refcount=0;
  $('#references li').each(function(){
    refcount++;
    var refid=this.id;
    referrers = $("a[href='#" + refid + "']");
    if(referrers.length==0){
      //refcount--;
      //$(this).css("display","none");
    }else if(referrers.length==1){
      referrers.attr("id",this.id+"_ref");
      $(this).html("<a href='#"+refid+"_ref"+"'>^</a> "+$(this).html());
    }else{
      var referrerscount=0;
      referrers.each(function(){
        referrerscount++;
        $(this).attr("id",refid+"_ref"+referrerscount);
      });
      while(referrerscount>0){
        referrerscount--;
        $(this).html("<sup><a href='#"+this.id+"_ref"+(referrerscount+1)+"'>"+alphabet[referrerscount]+"</a> </sup>"+$(this).html());
      }
      $(this).html("^ "+$(this).html());
    }
    referrers.html("["+refcount+"]").addClass("note");
  });
  
  
  
  //ページ内リンクハイライト
  $("a").click(function(){
    var anchor = $(this).attr('href');
    $(".active").removeClass("active");
    $(anchor).addClass("active");
  });
  $($(location).attr('hash')).addClass("active");
});

var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//var maruSuji = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
