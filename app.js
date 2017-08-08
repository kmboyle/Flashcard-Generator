var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var questions = require("./flashCards.json");
var inquirer = require('inquirer');
var jsonfile = require('jsonfile');
var file = 'flashCards.json';
//variable inc is used to keep count of number of cards
//if running default demo's, inc will be used as the array index, otherwise, count will be used as the array index
var inc = 0;
//prototype to accept a full text property
ClozeCard.prototype.fullText = this.fullText;

//prototype to accept a partial text property
ClozeCard.prototype.partialText = this.partialText;

//asks user the type of card to make and the quantity
function prompt() {
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
        count--;
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
            var cards = new BasicCard(answers.front, answers.back);
            questions.basic.push(cards);
            console.log(questions);
            console.log(cards);
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
                console.log(questions);
                console.log(count);
                basicAnswer(inc, count);
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}
//this function provides a testing scenario for each "flashcard" the user created
function basicAnswer(inc, count) {
    if (inc > 0) {
        inc--;
        inquirer.prompt([{
            type: "input",
            message: questions.basic[count].front,
            name: "guess"
        }]).then(function(answers) {

            console.log(count);
            if (answers.guess === questions.basic[count].back) {
                console.log("Correct!");
            } else {
                console.log("Sorry, Incorrect.  Correct answer is: " + questions.basic[count].back);
            }
            count++;
            basicAnswer(inc, count);
        });
    } else {
        repeat();
    }

}

//This option allows user to build the cloze card flashcards and gives an option to run through the clozeAnswer function
function clozeCard(count) {
    if (count > 0) {
        count--;
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
            var cards = new ClozeCard(answers.text, answers.cloze);
            cards.fullText = answers.text;
            questions.cloze.push(cards);
            clozeDeleted(cards.fullText, cards.cloze, cards);
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
                clozeAnswer(inc, count);
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}
//function to remove the cloze in the full text and save new string to partial text property
function clozeDeleted(guesser, removal, cards) {
    var stringArray = guesser.toLowerCase().split(" ");
    if (stringArray.includes(removal.toLowerCase())) {
        cards.partialText = guesser.toLowerCase().replace(removal.toLowerCase(), "...");
    } else {
        return console.log("Oops, that is not in the sentence.");
    }
}
//allows the user a way to run cloze flashcards
function clozeAnswer(inc, count) {
    if (inc > 0) {
        inc--;
        inquirer.prompt([{
            type: "input",
            message: questions.cloze[count].partialText,
            name: "guess"
        }]).then(function(answers) {

            if (answers.guess.toLowerCase() === questions.cloze[count].cloze.toLowerCase()) {
                console.log("Correct!");
            } else {
                console.log("Sorry, Incorrect.  Correct answer is: " + questions.cloze[count].cloze);
            }
            count++;
            clozeAnswer(inc, count);
        });
    } else {
        repeat();
    }
}
//function that runs through cloze card examples from the flashCards.json file
function clozeDefault(count) {


    if (count > 0) {

        count--;
        jsonfile.readFile(file, "utf8", function(err, obj) {
            if (err) {
                console.log(err);
            } else {
                inc = Math.floor(Math.random() * obj.clozeDefault.length);
                clozeDeleted(obj.clozeDefault[inc].text, obj.clozeDefault[inc].cloze, obj.clozeDefault[inc]);

                inquirer.prompt([{
                    type: "input",
                    message: obj.clozeDefault[inc].partialText,
                    name: "guess"
                }]).then(function(answers) {

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
                inc = Math.floor(Math.random() * obj.basicDefault.length);
                console.log(inc);
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
            prompt();
        } else {
            console.log("OK, thank you, and have a nice day!");
        }
    });
}


//ask user to select type of card they want to make
prompt();