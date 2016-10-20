var settings = (function(){
  
  function init(){
    console.log("Settings started");

    events();
  }

  function events(){
    $("#settings").slideDown(1000);

    $("#header .glyphicon-cog").on("click", function(){
      $("#settings").slideToggle();
    });

    $("#settings .glyphicon-chevron-down").on("click", function(){
      $("#settings").slideUp();
    });
  }

  return {
    init: init
  }
})();

settings.init();