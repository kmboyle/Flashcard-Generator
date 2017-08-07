var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var questions = require("./flashCards.json");
var inquirer = require('inquirer');
//variable inc is used to keep count of number of cards
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
            choices: ["Basic Card", "Cloze Card"]
        },
        {
            type: "input",
            name: "number",
            message: "How many cards would you like to make?"

        }
    ]).then(function(answers) {
        console.log(answers.typeCard);
        if (answers.typeCard === "Basic Card") {
            basicCard(answers.number);
        } else {
            console.log("CLOZE!!");
            clozeCard(answers.number);
        };
    });
}

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
                console.log("Ok");
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}

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
                count = inc;
                console.log(questions);
                console.log(count);
                if (count > 0) {
                    count--;
                    inquirer.prompt([{
                        type: "input",
                        message: questions.cloze[count].partialText,
                        name: "guess"
                    }]).then(function(answers) {

                        if (answers.guess === questions.cloze[count].cloze) {
                            console.log("Correct!");
                        }
                    });
                }
            } else {
                console.log("No? Well, Alrighty then.");
            }
        });
    }
}
//function to remove the cloze in the full text and save new string to partial text property
function clozeDeleted(guesser, removal, cards) {

    var stringArray = guesser.split(" ");
    if (stringArray.includes(removal)) {
        console.log("Here it goes");
        console.log(stringArray);
        cards.partialText = guesser.replace(removal, "...");
        console.log(cards.partialText);
        questions.cloze.push(cards.partialText);

    } else {
        return console.log("Oops, that is not in the sentence.");
    }


}
//ask user to select type of card they want to make
prompt();