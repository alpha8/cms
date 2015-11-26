/*
# =============================================================================
#   Navbar scroll animation
# =============================================================================
*/
$(".navbar.scroll-hide").mouseover(function() {
  //$(".navbar.scroll-hide").removeClass("closed");
  return setTimeout((function() {
    return $(".navbar.scroll-hide").css({
      overflow: "visible"
    });
  }), 150);
});

$(function() {
  var delta = 50, lastScrollTop = 0;
  return $(window).scroll(function(event) {
    var st = $(this).scrollTop();
    if (Math.abs(lastScrollTop - st) <= delta) {
      return;
    }
    if (st > lastScrollTop) {
      $('.navbar.scroll-hide').addClass("closed");
    } else {
      $('.navbar.scroll-hide').removeClass("closed");
    }
    lastScrollTop = st;
  });
});

function animationHover(o,e){
    o=$(o);
    o.hover(function(){
        o.addClass("animated "+e);
    },function(){
        window.setTimeout(function(){
            o.removeClass("animated "+e);
        },2e3);
    });
}