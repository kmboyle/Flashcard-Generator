var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var questions = require("./flashCards.json");
var inquirer = require('inquirer');
var jsonfile = require('jsonfile');
var file = 'flashCards.json';
var fs = require("fs");
//variable inc is used to keep count of number of cards
//if running default demo's, inc will be used as the array index, otherwise, count will be used as the array index
var inc = 0;
var dec = 0;
//prototype to accept a full text property
ClozeCard.prototype.fullText = this.fullText;

//prototype to accept a partial text property
ClozeCard.prototype.partialText = this.partialText;

//asks user the type of card to make and the quantity
function prompt() {
    //initialize counts to zero and arrays to empty
    inc = 0;
    count = 0;
    dec = 0;
    questions.basic = [];
    questions.cloze = [];
    inquirer.prompt([{
            type: "list",
            name: "typeCard",
            message: "What type of card would you like to make:",
            choices: ["Basic Card", "Cloze Card", "Basic Card Demo", "Cloze Card Demo"]
        },
        {
            type: "input",
            name: "number",
            message: "How many cards would you like?"

        }
    ]).then(function(answers) {
        if (answers.typeCard === "Basic Card") {
            basicCard(answers.number);
        } else if (answers.typeCard === "Cloze Card") {
            clozeCard(answers.number);
        } else if (answers.typeCard === "Basic Card Demo") {
            basicDefault(answers.number);
        } else {
            clozeDefault(answers.number);
        }
    });
}
//will build the basic card front and back and give user option to run cards through basicAnswer function
function basicCard(count) {

    if (count > 0) {
        //decrease the users number of cards 
        count--;
        //keep track of the number of users cards
        inc++;
        console.log("Card #" + inc);
        inquirer.prompt([{
                type: "input",
                name: "front",
                message: "Enter question:"
            },
            {
                type: "input",
                name: "back",
                message: "Enter answer:"
            }
        ]).then(function(answers) {
            //create a card object for each card and push the front and back to the questions array
            var cards = new BasicCard(answers.front, answers.back);
            questions.basic.push(cards);
            //call itself again for each card the user wants to make
            basicCard(count);
        });
    } else {
        inquirer.prompt([{
            type: "confirm",
            message: "Would you like to run your cards?",
            name: "run"

        }]).then(function(answers) {
            if (answers.run) {
                //here is where the user will get their questions displayed back to them
                console.log("Ok.  Here are your " + inc + " card(s):");
                count = 0;
                dec = inc;
                /*now the inc variable holds the users amount of cards and gets saved to the 
                dec variable and count is set to zero and these
                two variables are passed to the answer function. */
                basicAnswer(dec, count);
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}
//this function provides a testing scenario for each "flashcard" the user created
function basicAnswer(dec, count) {
    if (dec > 0) {
        dec--;
        inquirer.prompt([{
            type: "input",
            message: questions.basic[count].front,
            name: "guess"
        }]).then(function(answers) {
            //after assking the question, test to see if guess matches answer
            if (answers.guess === questions.basic[count].back) {
                console.log("Correct!");
            } else {
                console.log("Sorry, Incorrect.  Correct answer is: " + questions.basic[count].back);
            }
            count++;
            //call itself depending on how many cards the user created
            basicAnswer(dec, count);
        });
    } else {
        //if this is finished, run the function to ask the user if they'd like to go back to the main menu
        repeat();
    }

}

//This option allows user to build the cloze card flashcards and gives an option to run through the clozeAnswer function
function clozeCard(count) {
    if (count > 0) {
        count--;
        //inc is being used to keep up with card count while count is being decreased.  
        //There should be a better way to do this.
        inc++;
        console.log("Card #" + inc);
        inquirer.prompt([{
                type: "input",
                name: "text",
                message: "Enter full statement:"
            },
            {
                type: "input",
                name: "cloze",
                message: "Enter portion of statement to be removed:"
            }
        ]).then(function(answers) {
            //create a new card with the users front and cloze piece
            var cards = new ClozeCard(answers.text, answers.cloze);
            //save text to a 'fullText' property, push the card to the cloze array.
            cards.fullText = answers.text;
            questions.cloze.push(cards);
            //call to the function that will perform the removal of the "cloze" in the sentence
            //passing the fullText, the cloze, and the card object
            clozeDeleted(cards.fullText, cards.cloze, cards);
            //call itself based on how many cards the user wants to make
            clozeCard(count);
        });
    } else {
        inquirer.prompt([{
            type: "confirm",
            message: "Would you like to run your cards?",
            name: "run"

        }]).then(function(answers) {
            if (answers.run) {
                //here is where the user will get their questions displayed back to them
                console.log("Ok.  Here are your " + inc + " card(s):");
                count = 0;
                dec = inc;
                //call the answer function and pass the card count and increment along
                clozeAnswer(dec, count);
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}
//function to remove the cloze in the full text and save new string to partial text property
function clozeDeleted(guesser, removal, cards) {
    //first split the string at its spaces and save to an array
    var stringArray = guesser.toLowerCase().split(" ");
    /*check to see if the array includes the removal variable (this is the cloze word(s)).  If it does
    replace that portion of the string with "..." and save this new string to the partialText property.  I
    could also *potentially*  write code to replace the string with a more specific string, relating to 
    the replaced strings length or number of characters.*/

    var removeArray = removal.toLowerCase().split(" ");
    var partialArray = [];

    console.log(guesser);
    console.log(removal);
    if (guesser.toLowerCase().includes(removal.toLowerCase())) {
        cards.partialText = guesser.replace(removal, "...");
    } else {
        //if the word is not in the sentence, alert user.
        return console.log("Oops, that is not in the sentence.");
    }

}
//allows the user a way to run cloze flashcards
function clozeAnswer(dec, count) {
    if (dec > 0) {
        dec--;
        inquirer.prompt([{
            type: "input",
            message: questions.cloze[count].partialText,
            name: "guess"
        }]).then(function(answers) {
            //run the cards and test to see if the user answer matches the 'cloze'
            if (answers.guess.toLowerCase() === questions.cloze[count].cloze.toLowerCase()) {
                console.log("Correct!");
            } else {
                console.log("Sorry, Incorrect.  Correct answer is: " + questions.cloze[count].cloze);
            }
            count++;
            //pass back to the function the number of cards the user has.
            clozeAnswer(dec, count);
        });
    } else {
        //run repeat after done to return to main menu
        repeat();
    }
}
//function that runs through cloze card examples from the flashCards.json file
function clozeDefault(count) {


    if (count > 0) {

        count--;
        //reading the json file for flashcard questions
        jsonfile.readFile(file, "utf8", function(err, obj) {
            if (err) {
                console.log(err);
            } else {
                //create a random index to 'shuffle' cards.  
                inc = Math.floor(Math.random() * obj.clozeDefault.length);
                //pass the cards properties to the 'delete' function to create the partial text
                clozeDeleted(obj.clozeDefault[inc].text, obj.clozeDefault[inc].cloze, obj.clozeDefault[inc]);

                inquirer.prompt([{
                    type: "input",
                    message: obj.clozeDefault[inc].partialText,
                    name: "guess"
                }]).then(function(answers) {
                    //check users answer to question
                    if (answers.guess.toLowerCase() === obj.clozeDefault[inc].cloze.toLowerCase()) {
                        console.log("Correct!");
                    } else {
                        console.log("Sorry, Incorrect.  Correct answer is: " + obj.clozeDefault[inc].cloze);
                    }

                    clozeDefault(count);
                });
            }
        });
    } else {
        repeat();
    }
}
//function that runs through basic card examples from the flashCards.json file
function basicDefault(count) {

    if (count > 0) {
        count--;
        jsonfile.readFile(file, "utf8", function(err, obj) {
            if (err) {
                console.log(err);
            } else {
                //same as before, random index to 'shuffle' cards.
                inc = Math.floor(Math.random() * obj.basicDefault.length);
                inquirer.prompt([{
                    type: "input",
                    message: obj.basicDefault[inc].front,
                    name: "guess"
                }]).then(function(answers) {
                    if (answers.guess.toLowerCase() === obj.basicDefault[inc].back.toLowerCase()) {
                        console.log("Correct!");
                    } else {
                        console.log("Sorry, Incorrect.  Correct answer is: " + obj.basicDefault[inc].back);
                    }
                    basicDefault(count);
                });
            }
        });
    } else {
        repeat();
    }
}
//function to continue running the application
function repeat() {
    inquirer.prompt([{
        type: "confirm",
        message: "Would you like to go back to the main menu?",
        name: "run"
    }]).then(function(answers) {
        if (answers.run) {
            //this is the function that I named at the beginning for the start menu
            prompt();
        } else {
            console.log("OK, thank you, and have a nice day!");
        }
    });
}


//ask user to select type of card they want to make
prompt();