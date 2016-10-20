
// setTimeout(function(){
//   $("#trelloModal").modal("show");
// }, 1000);
// Trell.rest("GET"|"POST"|"PUT"|"DELETE", path, params (default {}), succes, error)

  var selectCard = (function(){
    var Boards = [];
    var Lists = [];
    var Cards = [];

    var selectedBoard = {
      name: "Board"
    };
    var selectedList = {
      name: "List"
    };
    var selectedCard = {
      name: "Select Trello card..."
    };

    var currentScreen = "boards";

    var trelloColors = {
      "blue":   { "board": "#0067A2", "list": "rgba(0,103,162, 0.4)"  },
      "orange": { "board": "#B37A2C", "list": "rgba(197,122,44, 0.4)" },
      "green":  { "board": "#458130", "list": "rgba(69,129,48, 0.4)"  },
      "red":    { "board": "#963B2A", "list": "rgba(150,59,42, 0.4)"  },
      "purple": { "board": "#745286", "list": "rgba(116,82,134, 0.4)" },
      "pink":   { "board": "#AE4C7B", "list": "rgba(174,76,123, 0.4)" },
      "lime":   { "board": "#40A25B", "list": "rgba(64,162,91, 0.4)"  },
      "sky":    { "board": "#0094AD", "list": "rgba(0,148,173, 0.4)"  },
      "grey":   { "board": "#62696D", "list": "rgba(98,105,109, 0.4)" }
    };

    $content = $("#content");
    $back = $("#back");
    $trelloCard = $("#trelloCard");
    $modalTitle = $("#trelloModal .modal-title");
    $backButton = $(".modal-header .glyphicon-arrow-left");
    $trelloModal = $("#trelloModal");

    function init(){
      authorize();
      // All data will be loaded after authorization
      // If all data is available: display boards
      $(document).ajaxStop(function(){
        displayBoards();
      });

      // Handle events top bar
      events();

      // Fill trello card
      displayTrelloCard();
    }

    function events(){
      // Open modal
      $trelloCard.on("click", function(){
        $trelloModal.modal();
      });

      // Change modal title
      
    }

    // Authorize user - then loadBoards
    function authorize(){
      Trello.authorize({
        type: "redirect",
        name: "Trello API test",
        scope: {
          read: true,
          write: false },
        expiration: "never",
        interactive: true,
        success: loadBoards, 
        error: function() { console.log("Failed authentication"); }
      });
    }


    // Get the users boards and save in Boards - then loadCards
    function loadBoards() {
      Trello.get(
        '/members/me/boards/',
        function(boards){
          $.each(boards, function(index, value) {
            if(value.name === "Welcome Board"){
              return false;
            }

            Boards.push(value);
            Lists[value.id] = [];
            loadLists(value.id);
          });
        },
        function() { 
          console.log("Failed to load boards"); 
        }
      );
    };


    // Load lists from board and save in Lists - then loadCards
    function loadLists(id){
      Trello.get("/boards/" + id + "/lists",
        function(lists){
          var boardLists = [];
          $.each(lists, function(index, value){
            boardLists.push(value);
            Cards[value.id] = [];
            loadCards(value.id);
          });

          if(lists.length > 0){
            Lists[lists[0].idBoard] = boardLists;
          }  
        },
        function() { 
          console.log("Failed to load lists"); 
        }
      );
    }

    // Load cards from list and save in Cards 
    function loadCards(id){
      Trello.get("/lists/" + id + "/cards",
        function(cards){
          var listItems = [];
          $.each(cards, function(index, value){
            listItems.push(value);
          });

          if(cards.length > 0){
            Cards[cards[0].idList] = listItems;
          }
        },
        function() { console.log("Failed to load cards"); }
      );
    }

    function displayBoards(){
      $content.empty();
      currentScreen = "boards";

      updateHeader();
      
      $.each(Boards, function(i, board){
        var div = $("<div class='board col-xs-12' id='" + board.id + "'><h3>" + board.name + "</h3></div>");
        div.css("background-color", trelloColors[board.prefs.background].board);

        $content.append(div);
        
        // Add event listener 
        $("#" + board.id).unbind().on("click", function(){ 
          selectedBoard = board;
          displayLists(board.id); 
        });
      });
    }

    function displayLists(boardId){
      $content.empty();
      currentScreen = "lists";

      updateHeader();

      $.each(Lists[boardId], function(i, list){
        var div = $("<div class='list col-xs-12' id='" + list.id + "'>" + list.name + "</div>");

        $content.append(div);

        // Add event listener 
        $("#" + list.id).unbind().on("click", function(){ 
          selectedList = list;
          displayCards(list.id);
        });
      });

      $(".list").css("background-color", trelloColors[selectedBoard.prefs.background].list);

    }

    function displayCards(listId){
      $content.empty();
      currentScreen = "cards";

      updateHeader();

      $.each(Cards[listId], function(i, card){
        $content.append("<div class='card col-xs-12' id='" + card.id + "'>" + card.name + "</div>");

        // Add event listener
        $("#" + card.id).unbind().on("click", function(){ 
          selectedCard = card;
          displayTrelloCard(); 
        });
      });

      var height = Cards[listId].length * 50 + 10;
      
      $("#content")
        .height(height)
        .css("background", trelloColors[selectedBoard.prefs.background].list);

    }

    function displayTrelloCard(){
      console.log(selectedCard);

      $trelloCard.find("h3").html(selectedCard.name);
      $trelloCard.find("span").eq(0).html(selectedBoard.name);
      $trelloCard.find("span").eq(2).html(selectedList.name);

      // Close modal
      $trelloModal.modal("hide");
    }

    function updateHeader(){
      if(currentScreen === "boards"){
        $backButton.css("visibility", "hidden");
        $modalTitle.html("Boards");
      }else{
        $backButton.css("visibility", "visible");
        if(currentScreen === "lists"){
          $backButton.on("click", function(){
            displayBoards();
          });

          $modalTitle.html(selectedBoard.name);
        }else{
          $backButton.on("click", function(){
            displayLists(selectedBoard.id);
          });

          $modalTitle.html(selectedList.name);
        }
      }

      $("#content").css("background-color", "inherit");
    }

    
    return {
      init: init,
    };

  })();


  selectCard.init();
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