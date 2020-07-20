let  readlineSync  =  require('readline-sync');
const { decks, suits } = require('cards');
var colors = require('colors');
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


// FUNCTIONS TO BEGIN NEW HAND & DEAL DECK

let cardsInHand = 12;

const newHand = () => deck.draw(cardsInHand);

const dealDeck = () => {
    for (let i = 0; i < playersArray.length; i++) {
        playersArray[i].hand = newHand();
    }
}

/// FUNCTION TO CHECK USERNAME IS VALID

const checkUserName = () => {
    do {
        if (userName.length < 3) {
            console.log('I need a name longer than 2 characters!');
            userName = readlineSync.question('\nWhat\'s your name?'.bgBlack.brightYellow + '\t');
        }
    } while (userName.length < 3);
}

/// FUNCTION TO CHOOSE # CARDS IN HAND

const chooseNumCards = () => {
    cardsInHand = readlineSync.questionInt('\nHow many cards per player would you like dealt? Please choose a number between 5 and 12.'.bgBlack.brightYellow
    + "\n\n",
    {limitMessage: 'Input valid number, please.'.bold.red});

    do {
        console.log(`\nYou have chosen to play with a hand of ${cardsInHand} cards per player.`.bgBlack.brightYellow);
        if (cardsInHand > 12 || cardsInHand < 5) {
            console.log("You must choose a number between 5 and 12!".bold.red);
            cardsInHand = readlineSync.questionInt('\nHow many cards per player would you like dealt? Please choose a number between 5 and 13.'.bgBlack.brightYellow
            + "\n\n",
            {limitMessage: 'Input valid number, please.'.bold.red});
        }
    } while (cardsInHand > 12 || cardsInHand < 5)
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
                toConvert = 14;
                break;
            case 'K':
              toConvert = 13;
              break;
            case 'Q':
              toConvert = 12;
              break;
            case 'J':
                toConvert = 11;
                break;
        }
    } else {
        toConvert = parseInt(toConvert);
    }
}

const convertTrickArray = () => {
    for (let i = 0; i < trickArray.length; i++) {
        switchConvert(trickArray[i]);
    }
}

// FUNCTION TO SCORE A TRICK

const logEnemyTrick = (enemyIndex) => {
    playersArray[enemyIndex].trickWinCount++;
    console.log(`\n\t${playersArray[enemyIndex].name} won this trick! They have taken ${playersArray[enemyIndex].trickWinCount} tricks so far.`.red)
}

const scoreTrick = () => {
    let highestCard = trickArray[0];
    for (let i = 1; i < trickArray.length; i++) {
        if (trickArray[i] > highestCard) {
            highestCard = trickArray[i];
        }
    }
    if (highestCard == trickArray[0]) {
        playersArray[0].trickWinCount++;
        console.log(`\n\tYou won this trick! You have taken ${playersArray[0].trickWinCount} tricks so far.`.green)
    } else if (highestCard == trickArray[1]) {
        logEnemyTrick(1);
    } else if (highestCard == trickArray[2]) {
        logEnemyTrick(2);
    } else {
        logEnemyTrick(3);
    } 
}


// FUNCTION TO PLAY A TRICK

const playTrick = () => {

    readlineSync.keyInPause('\nReady to go on?'.dim);

    resetArrays();

    console.log(`\n${userName}, here are the cards in your hand!`.bgBlack.brightYellow);
    index = readlineSync.keyInSelect(yourHandArray, 'Which card would you like to play?\t'.bgBlack.brightYellow, {cancel: false});

    console.log(`\n\tYou have played ${yourHandArray[index]}`.bold);

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

// FUNCTION TO PLAY 12 TRICKS IN A HAND

const playHand = () => {
    for (i = 0; i < cardsInHand; i++) {
        playTrick();
    }
}

// FUNCTION TO CALCULATE & DISPLAY SCORE

const scoreThisHand = () => {
    readlineSync.keyInPause('\nReady to go on?'.dim);
    console.log('\nTime to calculate the SCORE!'.bgBlack.brightYellow);
    for(let i = 0; i < 12; i++) {console.log("calculating.... calculating...".dim);}
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
            console.log('\nCONGRATS! You won the game! :)'.rainbow + '\n');
            break;
        case 'lose':
            console.log(`\nSorry, you lost the game! :( ${winner} had the highest score!`.bold.brightRed + '\n');
            break;
        case 'playerTie':
            console.log(`\nWow, you tied! The winners are: ${winner}`.bold.magenta + '\n');
            break;
        case 'EnemyTie':
            console.log(`\nSorry, you lost the game! :( ${winner} tied for the highest score!`.bold.brightRed + '\n');
            break;
    }
}

/// RESET TRICK COUNTERS

const resetTrickWinCount = () => {
    for (let i = 0; i < playersArray.length; i++) {
        playersArray[i].trickWinCount = 0;
    }
}

/// PLAY A FULL GAME

// let deck = new decks.StandardDeck({ jokers: 0 });
let deck;

const playGame = () => {
    chooseNumCards();
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
    let yesOrNo = readlineSync.keyInYNStrict('\n' + 'Do you want to play again? y || n'.bold.blue + "\n\n");
    if (yesOrNo){
        console.log("\n\tLet's play again!".bgBlack.brightYellow);
        playGame()
    } else {
        console.log("\n\tBye! Thanks for playing!".bgBlack.brightYellow);
    }
}



/// ACTUAL GAME PLAY ///

// INTRODUCTION

console.log("Welcome to the Card Game!".bgBlack.brightYellow);
let userName = readlineSync.question('\nWhat\'s your name?'.bgBlack.brightYellow + '\n\n');

checkUserName();

console.log(`\nOkay, ${userName}! Here are the instructions!`);
console.log(`\n\t1-- There are four players: you and three computer players. Each of you will be dealt a hand of cards.`);
console.log("\t2-- You will choose a card from your hand to discard. Each computer player will discard a card from their hands of that same suit.");
console.log("\t3-- Whoever played the highest-ranking card will win the trick! At the end of the game, the player with the most tricks wins the game!")
console.log("\n\t^ If the computer player does not have a card of the same suit, they will discard a card of a different suit, but it will not rank higher than yours.");
console.log("\n" + "Let's go!".bgBlack.brightYellow + "\n\n\n");

// GAMEPLAY

playGame();