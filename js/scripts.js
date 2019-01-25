var currentNoteID = 0;
var currentNotehslaH = 35; 

$( window ).resize(function() {
  printNotes()
  if ($('#overlay').css('display')=="block"){
    showOverlay()
  }
});

//
if(!localStorage["listDataArray"]) { 
  //if localstorage variable is not set then set empty array and save it to local storage
  ArrayData = [];
  localStorage["listDataArray"] = JSON.stringify(ArrayData); //saves array to local storage
  localStorage["notesCounter"] = 0;
} else {
  //if localstorage variable were already set then display sticky notes
    printNotes()
}



// function to add sticky note
function AddStickyNotes (noteContent){
    var noteID = parseInt(localStorage["notesCounter"]) + 1 //set note ID value
    localStorage["notesCounter"] = noteID;  //increase global counters
    ArrayData = JSON.parse(localStorage["listDataArray"]) // get array from local storage
    ArrayData.push(noteID); //add note ID to array of active notes
    localStorage["listDataArray"] = JSON.stringify(ArrayData); //saves array to local storage
    localStorage["contentOfNoteNo"+noteID] = noteContent; // save note text as local storage
    localStorage["colorOfNoteNo"+noteID] = currentNotehslaH; // save note color as local storage   ------------CODE TO BE ADDED----------

}

//determine shortest column
function determineShortesColumn(){
  var shortestColumn = null
  var shortestColumnHeight = null
  $( "div.column" ).each(function(index) {
    var childsHeight = 0;
      $( this ).children().each(function() {
        childsHeight = childsHeight + $( this ).height();
    });
    if (shortestColumn==null){
      shortestColumn = index;
      shortestColumnHeight = childsHeight
        } else if (shortestColumnHeight>childsHeight){
      shortestColumn = index;
      shortestColumnHeight = childsHeight			
        }	
  });
  return shortestColumn;
}
//---------------------

// fill columns with sticky notes
function printNotes(){
  // add columns until column width above 250px
      $("#mainArea").empty()
      $("#mainArea").append( "<div class='column'></div>")
      while ($(".column").width() > 250) {
        $("#mainArea").append( "<div class='column'></div>")
        $(".column").each(function() {
          //console.log ($(this).width())
          $( this ).css("max-width",$(this).width())
        });        
        }
  //amount of columns set  
  //read the array of notes IDs and display them
      ArrayData = JSON.parse(localStorage["listDataArray"]) // get array from local storage
      var i;
      for (i = ArrayData.length-1; i >=0 ; i--) { 
        printSingleNote (determineShortesColumn(),ArrayData[i])        
          //$( ".column:eq(" + determineShortesColumn() + ")" ).append("<div class = 'stickyNotes'>"+ localStorage["contentOfNoteNo"+ArrayData[i]] +"</div> ")
      }
  //notes displayed

  //normalize notes size
  $(".stickyNotes").each(function() {
    //console.log ($(this).width())
    $( this ).css("min-height",$(this).width())
  });

  //add click listener for delete buttons
    $(".stickyNoteNavBarDelete").each(function() {
      //console.log ($(this).width())
      $( this ).click(function(){
          //---------maybe add monit button here--------------------
          deleteNote ($(this).attr("noteID"));
      });
    });  

   //add click listener for edit buttons
   $(".stickyNoteNavBarEdit").each(function() {
    //console.log ($(this).width())
    $( this ).click(function(){
        //---------maybe add monit button here--------------------
        showOverlayToEdit ($(this).attr("noteID"));
    });
  });    

}

//function responsible for printing single sticky note in given column
function printSingleNote (columnNo,noteID) {
  //print the note
      var htmlNoteCode =  "<div class = 'stickyNotes' id = 'stickyNote"+noteID+"' style = 'background-color:hsla("+ localStorage["colorOfNoteNo"+noteID] +", 94%, 81%, 1);'></div>";
      //htmlNoteCode +=       localStorage["contentOfNoteNo"+noteID];
      //htmlNoteCode +=     "</div>";
      $( ".column:eq(" + columnNo + ")" ).append(htmlNoteCode)

  //add the note toolbar
      htmlNoteCode  = "<div class = 'stickyNoteNavBar' id = 'stickyNoteNavBar"+noteID+ "' ></div>"
      $("#stickyNote"+noteID).append(htmlNoteCode)
      htmlNoteCode  = "<div class = 'stickyNoteNavBarEdit' id = 'stickyNoteNavBarEdit"+noteID+ "' noteID = '"+noteID+"'></div>"
      $("#stickyNoteNavBar"+noteID).prepend(htmlNoteCode)
      htmlNoteCode  = "<div class = 'stickyNoteNavBarDelete' id = 'stickyNoteNavBarDelete"+noteID+ "' noteID = '"+noteID+"'></div>"
      $("#stickyNoteNavBar"+noteID).prepend(htmlNoteCode)

  //print the note text
      htmlNoteCode = "<div class = 'noteText'>"+localStorage["contentOfNoteNo"+noteID]+"</div>";
      $("#stickyNote"+noteID).append(htmlNoteCode)
}


function deleteNote (noteID){
    if (confirm("Shall I delete the note?")){
        //read from localstorage
        ArrayData = JSON.parse(localStorage["listDataArray"]) // get array from local storage   
        //remove value from the array
            ArrayData = jQuery.grep(ArrayData, function(value) {
              return value != noteID;
            });
        //save array to localstorage 
            localStorage["listDataArray"] = JSON.stringify(ArrayData); 
        //remove localstorage items
            localStorage.removeItem("contentOfNoteNo"+noteID);     
            localStorage.removeItem("colorOfNoteNo"+noteID);     
        // print notes without deleted one
            printNotes()      
    }


}

function showOverlayToAdd(){
    currentNoteID = 0;
    showOverlay();
}

function showOverlayToEdit(noteID){
  currentNoteID=noteID;
  showOverlay();
}

function showOverlay(){
  var screenWidth =  $(window).width();
      if (screenWidth*0.4 > 400){ //option for wide screens
        $("#overlayMessageBox").css ("width","40%"); //set box screen to 40% - 6px (for border width)
        $("#overlayMessageBox").css ("left",$(window).width()*0.3-3); //position box to the middle
      } else if ( screenWidth*0.9 > 400) {
        $("#overlayMessageBox").css ("width","400px"); //set box screen to 40% - 6px (for border width)
        $("#overlayMessageBox").css ("left",($(window).width()-400)/2-3); //position box to the middle
      } else {
        $("#overlayMessageBox").css ("width","90%"); //set box screen to 40% - 6px (for border width)
        $("#overlayMessageBox").css ("left",$(window).width()*0.05-3); //position box to the middle       
      }

  if ($('#overlay').css('display')=="none"){ //check if it is not just window resize event
      if (currentNoteID != 0){ //read values if it is edit event
         $("#overlayMessageBoxText").val(localStorage["contentOfNoteNo"+currentNoteID]) 

      } 
      $('#overlay').css('display','block'); 
  }

  displayColorPickerBar()



}

function displayColorPickerBar (){
      //show color bar
      $("#overlayMessageBoxColor").empty()
      var availableSpace = $("#overlayMessageBox").width() * 0.9;
      var usedSpace = 2; //for additional border width for selected element
      var withOfElelemntAndSpace = 59;
      var witdhOfMargin = 25;
      var i
      for (i = 1; i <=10 ; i++) { 
        if (usedSpace + withOfElelemntAndSpace <=availableSpace){
            var hslaH = i*35
            var htmlToAdd = "<div class='overlayMessageBoxColorPicker' id='overlayMessageBoxColorPicker" + i + "' hslaH = '" + hslaH + "' style = 'background-color:hsla("+ hslaH +", 94%, 81%, 1);'></div>"
            $("#overlayMessageBoxColor").append(htmlToAdd);
            usedSpace += withOfElelemntAndSpace;
        }  
      }
      if ($("#overlayMessageBoxColor").css("visibility") == "hidden"){ //check if it is not just refresh of the box
          if (currentNoteID != 0){ //read values if it is edit event
            currentNotehslaH =localStorage["colorOfNoteNo"+currentNoteID]
          } else{
              currentNotehslaH = 35;
          }      
      }
      $("#overlayMessageBoxColor").css("visibility","visible")
      $("#overlayMessageBox").css ("background-color","hsla("+ currentNotehslaH +", 94%, 81%, 1)");
      $("#overlayMessageBoxColorPicker" + currentNotehslaH/35).removeClass("overlayMessageBoxColorPicker")        
      $("#overlayMessageBoxColorPicker" + currentNotehslaH/35).addClass("overlayMessageBoxColorPickerSelected")
      $("#overlayMessageBoxColor").css("padding-left",(availableSpace-(usedSpace - witdhOfMargin))/2 + "px")    

      //add click listener for color pickers
      $(".overlayMessageBoxColorPicker").each(function() {
        //console.log ($(this).width())
        $( this ).click(function(){
            //---------maybe add monit button here--------------------
            currentNotehslaH = $(this).attr("hslaH");
            displayColorPickerBar();
        });
      }); 
}

function cancelOverlay(){
  $("#overlayMessageBoxText").val("")
  $("#overlayMessageBoxColor").css("visibility","hidden")
  $('#overlay').css('display','none')
}

function saveOverlay(){
  if (currentNoteID == 0 ) { //if this is new sticky note
    AddStickyNotes($("#overlayMessageBoxText").val());
  } else { //if this is edition of existing sticky note
    localStorage["contentOfNoteNo"+currentNoteID] = $("#overlayMessageBoxText").val(); // save note text as local storage
    localStorage["colorOfNoteNo"+currentNoteID] = currentNotehslaH; // save note color as local storage    
  }
  $("#overlayMessageBoxText").val("")
  $("#overlayMessageBoxColor").css("visibility","hidden")
  $('#overlay').css('display','none')
  printNotes()
}