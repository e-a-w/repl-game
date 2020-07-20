let  readlineSync  =  require('readline-sync');
const { decks, suits } = require('cards');
const chalk = require('chalk');
const log = console.log;
const card = require('cards/src/card');

// PLAYERS

let playersArray = [
    {
        name: "You",
        hand: {},
        trickWinCount: 0
    },
    {
        name: "Enemy One",
        hand: {},
        trickWinCount: 0
    },
     {
        name: "Enemy Two",
        hand: {},
        trickWinCount: 0
    },
     {
        name: "Enemy Three",
        hand: {},
        trickWinCount: 0
    }    
];


/// FUNCTION TO CHECK USERNAME IS VALID

let userName;
let alphabet = /[a-zA-Z]/

const checkUserName = () => {
    while (alphabet.test(userName) === false || userName.length < 3) {
        if (alphabet.test(userName) === false) {
            console.log(chalk.red("Your name must contain at least one letter!"));
            userName = readlineSync.question(chalk.inverse('\nWhat\'s your name?') + '\t');
        }
        if (userName.length < 3) {
            console.log(chalk.red('I need a name longer than 2 characters!'));
            userName = readlineSync.question(chalk.inverse('\nWhat\'s your name?') + '\t');
        }
    }
}

/// FUNCTION TO CHOOSE # CARDS IN HAND

const chooseNumCards = () => {
    cardsInHand = readlineSync.questionInt(chalk.inverse('\nHow many cards per player would you like dealt? Please choose a number between 5 and 12.'))
    + "\t\n",
    {limitMessage: chalk.red('Input valid number, please.')};

    do {
        if (cardsInHand > 12 || cardsInHand < 5) {
            console.log(chalk.red("You must choose a number between 5 and 12!"));
            cardsInHand = readlineSync.questionInt(chalk.inverse('\nHow many cards per player would you like dealt? Please choose a number between 5 and 13.')
            + "\n\n",
            {limitMessage: chalk.red('Input valid number, please.')});
        }
    } while (cardsInHand > 12 || cardsInHand < 5)
}

// FUNCTION TO PLAY # TRICKS IN A HAND

const playHand = () => {
    for (i = 0; i < cardsInHand; i++) {
        playTrick();
    }
}

// FUNCTIONS TO BEGIN NEW HAND & DEAL DECK

let cardsInHand = 12;

const newHand = () => deck.draw(cardsInHand);

const dealDeck = () => {
    for (let i = 0; i < playersArray.length; i++) {
        playersArray[i].hand = newHand();
    }
}

//FUNCTION TO DISPLAY LIST OF CARDS & CLEAR ARRAYS 

let spadesInHand = [];
let heartsInHand = [];
let clubsInHand = [];
let diamondsInHand = [];
let suitsInHand = [spadesInHand, heartsInHand, clubsInHand, diamondsInHand];

let trickArray = [];
let yourHandArray = [];
let chosenCard, playThisCard, toExchange, inputRank, inputSuit;

const sortHandIntoSuits = () => {
    for (let i = 0; i < playersArray[0].hand.length; i++) {
        if (playersArray[0].hand[i].suit.name.includes("spades")) {spadesInHand.push(playersArray[0].hand[i]);}
        if (playersArray[0].hand[i].suit.name.includes("hearts")) {heartsInHand.push(playersArray[0].hand[i]);}
        if (playersArray[0].hand[i].suit.name.includes("clubs")) {clubsInHand.push(playersArray[0].hand[i]);}
        if (playersArray[0].hand[i].suit.name.includes("diamonds")) {diamondsInHand.push(playersArray[0].hand[i]);}
    }
}

const sortRankInSuit = (suitArray) => {
    for (let i = 0; i < suitArray.length; i++) {
        suitArray[i] = `${suitArray[i].rank.shortName} ${suitArray[i].suit.name}`;
    }
    suitArray = suitArray.sort();
}

const sortYourHandArray = () => {
    for (let j = 0; j < suitsInHand.length; j++) {
        sortRankInSuit(suitsInHand[j]);
        for (let i = 0; i < suitsInHand[j].length; i++) {
            yourHandArray.push(`${suitsInHand[j][i]}`);
        }
    }
}

const resetArrays = () => {
    trickArray = [];
    yourHandArray = [];
    spadesInHand = [];
    heartsInHand = [];
    clubsInHand = [];
    diamondsInHand = [];
    suitsInHand = [spadesInHand, heartsInHand, clubsInHand, diamondsInHand];
   
    sortHandIntoSuits();
    sortYourHandArray();
}

// FUNCTION TO SELECT YOUR CARD FROM YOUR HAND

const findCardObject = () => {   
    if (playersArray[0].hand.length > 1) {
        playersArray[0].hand.forEach(aCard => {
            if (aCard.suit.name === inputSuit && aCard.rank.shortName === inputRank) {
                playThisCard = playersArray[0].hand.indexOf(aCard);
            }
        })
        toExchange = playersArray[0].hand.splice(playThisCard,1);
    } else {
        toExchange = playersArray[0].hand.splice(0);
    }
    trickArray.push(toExchange[0].rank.shortName);
    deck.discard(toExchange);
} 

// FUNCTION FOR AIS TO PLAY CARDS

let playThisCardEnemyThree;
let toExchangeEnemyThree;
let playThisCardEnemyOne;
let toExchangeEnemyOne;
let playThisCardEnemyTwo;
let toExchangeEnemyTwo;

const playAICard = (playerIndex, cardToPlay, cardToExchange) => {
    playersArray[playerIndex].hand.forEach(aCard => {
        if (aCard.suit.name === inputSuit) {
            switchConvert(inputRank);
            if (aCard.rank.shortName > inputRank) {
                cardToPlay = playersArray[playerIndex].hand.indexOf(aCard);
                return cardToPlay;
            }
            cardToPlay = playersArray[playerIndex].hand.indexOf(aCard);
            return cardToPlay;
        }
    }) 
    cardToExchange = playersArray[playerIndex].hand.splice(cardToPlay,1);
    deck.discard(cardToExchange);
    console.log(`\t${playersArray[playerIndex].name} has played ${cardToExchange[0].rank.longName} of ${cardToExchange[0].suit.name}`);

    if (cardToExchange[0].suit.name === inputSuit){
        trickArray.push(cardToExchange[0].rank.shortName);
    } else {
        trickArray.push(0);
    }
} 

// FUNCTION TO CONVERT RANK STRINGS OF PLAYED CARDS TO NUMBERS

let faceCards = /[AKQJ]/

const switchConvert = (toConvert) => {
    if (faceCards.test(toConvert)) {
        switch(toConvert) {
            case 'A':
                toConvert = parseInt('14');
                break;
            case 'K':
              toConvert = parseInt('13');
              break;
            case 'Q':
              toConvert = parseInt('12');
              break;
            case 'J':
                toConvert = parseInt('11');
                break;
        }
    } else {
        toConvert = parseInt(toConvert);
    }
}

const convertTrickArray = () => {
    for (let i = 0; i < trickArray.length; i++) {
         if (faceCards.test(trickArray[i])) {
        switch(trickArray[i]) {
            case 'A':
                trickArray[i] = parseInt('14');
                break;
            case 'K':
              trickArray[i] = parseInt('13');
              break;
            case 'Q':
              trickArray[i] = parseInt('12');
              break;
            case 'J':
                trickArray[i] = parseInt('11');
                break;
        }
    } else {
        trickArray[i] = parseInt(trickArray[i]);
    }
    }
}

// NOTE: the above works with cleaner code (trickArray[i] as a parameter of switchConvert) in the terminal, but not in REPL */


// FUNCTION TO SCORE A TRICK

const logEnemyTrick = (enemyIndex) => {
    playersArray[enemyIndex].trickWinCount++;
    console.log(chalk.red.bold(`\n\t${playersArray[enemyIndex].name} won this trick! They have taken ${playersArray[enemyIndex].trickWinCount} tricks so far.`))
}

const scoreTrick = () => {
  convertTrickArray();
    let highestCard = trickArray[0];
    for (let i = 1; i < trickArray.length; i++) {
        if (trickArray[i] > highestCard) {
            highestCard = trickArray[i];
        }
    }
    if (highestCard == trickArray[0]) {
        playersArray[0].trickWinCount++;
        console.log(chalk.green.bold(`\n\tYou won this trick! You have taken ${playersArray[0].trickWinCount} tricks so far.`))
    } else if (highestCard == trickArray[1]) {
        logEnemyTrick(1);
    } else if (highestCard == trickArray[2]) {
        logEnemyTrick(2);
    } else {
        logEnemyTrick(3);
    } 
}

// FUNCTION TO PLAY A FULL TRICK

const playTrick = () => {

    readlineSync.keyInPause(chalk.dim('\nReady to go on?'));

    resetArrays();

    console.log(chalk.inverse(`\n${userName}, here are the cards in your hand!`));
    index = readlineSync.keyInSelect(yourHandArray, chalk.inverse('Which card would you like to play?\t'), {cancel: false});

    console.log(chalk.bold.underline(`\n\tYou have played ${yourHandArray[index]}`));

    chosenCard = yourHandArray[index];
    (chosenCard[0] === '1') ? inputRank = chosenCard.slice(0,2) : inputRank = chosenCard.slice(0,1);
    inputSuit = chosenCard.slice(2);

    findCardObject();

    playAICard(1, playThisCardEnemyOne, toExchangeEnemyOne);
    playAICard(2, playThisCardEnemyTwo, toExchangeEnemyTwo);
    playAICard(3, playThisCardEnemyThree, toExchangeEnemyThree);

    convertTrickArray();
    scoreTrick();
}

// FUNCTION TO CALCULATE & DISPLAY GAME SCORE

const scoreThisHand = () => {
    readlineSync.keyInPause(chalk.dim('\nReady to go on?'));
    console.log(chalk.yellow('\nTime to calculate the SCORE!'));
    for(let i = 0; i < 12; i++) {console.log(chalk.dim("calculating.... calculating..."));}
    console.log('\n');

    for (let i = 0; i < playersArray.length; i++) {
        playersArray[i].gameScore = playersArray[i].trickWinCount * 10;
        console.log(`\t${playersArray[i].name} scored ${playersArray[i].gameScore} points!`);
    }

    let winningScore = playersArray[0].gameScore;
    let winner = playersArray[0].name;
    let winLoseTie = 'win';

    for (let i = 1; i < playersArray.length; i++) {
        if (winningScore < playersArray[i].gameScore) {
            winningScore = playersArray[i].gameScore;
            winner = playersArray[i].name;
            winLoseTie = 'lose';
        } else if (winningScore === playersArray[i].gameScore) {
            winner += ` and ${playersArray[i].name}`;
            winLoseTie = 'tie';
        }
    }

    if (winLoseTie === 'tie') {
    let findTied = winner.split(" ");
    (findTied.includes(`${playersArray[0].name}`)) ? winLoseTie = 'playerTie' : winLoseTie = 'enemyTie';
    }

    switch (winLoseTie) {
        case 'win':
            console.log(chalk.bold.green('\nCONGRATS! You won the game! :)') + '\n');
            break;
        case 'lose':
            console.log(chalk.bold.red(`\nSorry, you lost the game! :( ${winner} had the highest score!`) + '\n');
            break;
        case 'playerTie':
            console.log(chalk.bold.magenta(`\nWow, you tied! The winners are: ${winner}`) + '\n');
            break;
        case 'EnemyTie':
            console.log(chalk.bold.red(`\nSorry, you lost the game! :( ${winner} tied for the highest score!`) + '\n');
            break;
    }
}

/// RESET TRICK COUNTERS

const resetTrickWinCount = () => {
    for (let i = 0; i < playersArray.length; i++) {
        playersArray[i].trickWinCount = 0;
    }
}

/// FUNCTION TO PLAY A FULL GAME ///

let deck;

const playGame = () => {
    chooseNumCards();
    console.log(chalk.inverse(`\nYou have chosen to play with a hand of ${cardsInHand} cards per player.`));
    deck = new decks.StandardDeck({ jokers: 0 });
    deck.shuffleAll();
    const tens = deck.findCards((card) => card.rank.shortName === '10');
    deck.discard(tens);
    dealDeck();
    resetTrickWinCount();
    playHand();
    scoreThisHand();
    playAgain();
}

// FUNCTION FOR PLAYING AGAIN

const playAgain = () => {
    let yesOrNo = readlineSync.keyInYNStrict('\n' + chalk.inverse('Do you want to play again? y || n') + "\n\n");
    if (yesOrNo){
        console.log(chalk.inverse("\n\tLet's play again!"));
        playGame()
    } else {
        console.log(chalk.inverse("\n\tBye! Thanks for playing!"));
    }
}



/// ACTUAL GAME PLAY ///

// INTRODUCTION

console.log("Welcome to the Card Game!");
userName = readlineSync.question(chalk.inverse('\nWhat\'s your name?') + '\n\n');

checkUserName();

console.log(chalk.inverse(`\nOkay, ${userName}! Here are the instructions!`));
console.log(`\n\t1-- There are four players: you and three computer players. Each of you will be dealt a hand of cards.`);
console.log("\t2-- You will choose a card from your hand to discard. Each computer player will discard a card from their hands of that same suit.");
console.log("\t3-- Whoever played the highest-ranking card will win the trick! At the end of the game, the player with the most tricks wins the game!")
console.log("\n\t^ If the computer player does not have a card of the same suit, they will discard a card of a different suit, but it will not rank higher than yours.");
console.log("\n" + chalk.inverse("Let's go!") + "\n\n\n");

// GAMEPLAY

playGame();