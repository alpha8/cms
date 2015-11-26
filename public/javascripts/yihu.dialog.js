(function($){  
  $('.dialogs').each(function() {
    var e = $(this);
    var trigger = e.attr("data-toggle");
    if (trigger == "hover") {
      e.mouseover(function () {
        showDialogs(e);
      });
    } else if (trigger == "click") {
      e.click(function () {
        showDialogs(e);
      });
    }
  });

  showDialogs = function (e) {
    var trigger = e.attr("data-toggle");
    var getid = e.attr("data-target");
    var data = e.attr("data-url");
    var mask = e.attr("data-mask");
    var width = e.attr("data-width");
    var detail = "";
    var masklayout = $('<div class="dialog-mask"></div>');
    if (!width) { width = "80%"; }

    if (mask === "1") {
      $("body").append(masklayout);
      masklayout.fadeIn("slow");//淡入
    }
    detail = '<div class="dialog-win" style="position:fixed;width:' + width + ';z-index:11;">';
    if (getid) { detail = detail + $(getid).html(); }
    if (data) { detail = detail + $.ajax({ url: data, async: false }).responseText; }
    detail = detail + '</div>';

    var win = $(detail);
    win.find(".dialog").addClass("open");
    $("body").append(win);
    win.fadeIn("slow");//淡入

    var x = parseInt($(window).width() - win.outerWidth()) / 2;
    var y = parseInt($(window).height() - win.outerHeight()) / 2;
    if (y <= 10) { y = "10"; }
    win.css({ "left": x, "top": y });
    win.find(".dialog-close,.close").each(function () {
      $(this).click(function () {
        //win.remove();
        //$('.dialog-mask').remove();
        win.fadeOut("slow",function(){win.remove();});//关闭dialog时淡出并删除dom
        masklayout.fadeOut("slow",function(){masklayout.remove();});//关闭半透遮罩时淡出并删除dom
      });
    });
    masklayout.click(function () {
      //win.remove();
      //$(this).remove();       
      win.fadeOut("slow",function(){win.remove();});//关闭dialog时淡出并删除dom
      $(this).fadeOut("slow",function(){masklayout.remove();});//关闭半透遮罩时淡出并删除dom
    });
  };
})(jQuery);