   $(document).ready(function() {

       var pause;

       var basicObj = {

           "basicDefault": [{
                   "front": "What percentage of the land in the state of Nevada is owned by the government?",
                   "back": "80"
               },
               {
                   "front": "How many acres of pizza are served in the United States every day?",
                   "back": "100"
               },
               {
                   "front": "What organ in the human body lacks nerves despite the fact that it acts as the central command for the central nervous system?",
                   "back": "brain"
               },
               {
                   "front": "What kills 4 times as many people as sharks per year?",
                   "back": "Vending Machines"
               },
               {
                   "front": "What is part of a database that holds only one type of information?",
                   "back": "field"
               },
               {
                   "front": "'.MOV' extension refers usually to what kind of file?",
                   "back": "movie"
               },
               {
                   "front": "What is the term to ask the computer to put information in order numerically or alphabetically?",
                   "back": "sort"
               },
               {
                   "front": "What city was located just miles away from Mount Vesuvius volcano?",
                   "back": "Pompeii"
               },
               {
                   "front": "What was life expectancy in 1900?",
                   "back": "47"
               }
           ],
       }


       $(".basic").on("click", function() {
           bCount();
       })
       $(".cloze").on("click", function() {
           cCount();
       })

       function bCount() {
           $(".basic").off();
           $(".bFront").html("<form>How many cards do you want?<br><input class = 'form-control' id = 'count' type ='number'><input type='submit' id = 'submit'></form>");

           $("#submit").on("click", function() {
               console.log("helllo");
               var count = $("#count").val();
               console.log(count);
               displayCard(count);

           })

       }

       function cCount() {
           $(".cloze").off();
           $(".cFront").html($("<form>How many cards do you want?<br><input class = 'form-control' id = 'count' type ='number'><input type='submit' id = 'submit'></form>"));
       }

       function displayCard(count) {
           console.log(count);
           if (count > 0) {
               var question = basicObj.basicDefault;

               var inc = Math.floor(Math.random() * question.length);
               $(".bFront").html(question[inc].front);
               $('.bFront').append($("<br><input class = 'form-control' id = 'guess' type ='text'><input type='submit' id = 'submit'>"));
               $("#submit").on("click", function() {

                   var guess = $("#guess").val();
                   compare(guess, question, inc, count);

               });
           } else {
               $(".bFront").text("ALL FINISHED!");

           }
       }

       function nextQuestion(count) {
           count--;
           console.log(count);
           displayCard(count);
       }

       function compare(guess, question, inc, count) {
           if (guess.toLowerCase() === question[inc].back.toLowerCase()) {
               console.log(question[inc].back);
               $(".bFront").html("THAT IS CORRECT");

           } else {
               $(".bFront").html("Nope.  Correct answer: " + question[inc].back);

           }

       }

   });