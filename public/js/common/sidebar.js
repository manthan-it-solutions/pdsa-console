$(document).ready(function () {
    var BODY = $("#page-body");
    var sidebar = $("#Sidebar");
  
    // Toggle class on #Header_menu click
    $("#Header_menu").click(function () {
      BODY.toggleClass("sidebar-collapsed");
      $("#Header_menu .Icon_dots").toggleClass("d-none");
      $("#Header_menu .Icon_menu").toggleClass("d-none");
    });
    $("#Menu_close").click(function () {
      BODY.toggleClass("sidebar-collapsed");
    });
  
    $("#User_close").click(function () {
      $(".User_drop").toggleClass("show");
    });
  
    $(document).click(function (event) {
      if (!$(event.target).closest(".User_drop, #User_close").length) {
        if ($(".User_drop").hasClass("show")) {
          $(".User_drop").removeClass("show");
        }
      }
    });
  
  
  });
  
  $(document).ready(function() {
    var currentPath = window.location.pathname;
    $('.accordion-body a').each(function() {
        if ($(this).attr('href') === currentPath) {
          $('.sidebar_dashboard_icon').removeClass('active');
            $(this).addClass('active');
            $(this).closest('.accordion-item').find('.accordion-button').addClass('active');
        }
    });
    
  });