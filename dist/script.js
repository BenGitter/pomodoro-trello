// setTimeout(function(){
//   $("#settings").slideDown();
// }, 2000);

$("#trelloModal").modal();
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
        $content.append("<div class='board col-xs-12' id='" + board.id + "'><h3>" + board.name + "</h3></div>");
      
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
        $content.append("<div class='list col-xs-12' id='" + list.id + "'>" + list.name + "</div>");

        // Add event listener 
        $("#" + list.id).unbind().on("click", function(){ 
          selectedList = list;
          displayCards(list.id);
        });
      });
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
    }

    
    return {
      init: init,
    };

  })();


  selectCard.init();