# repl-game

This is a Javascript repl card game for class.

[repl link](https://repl.it/@ewatkins/cardgame)

**Rules**

- There are four players: you and three computer players.
- You will lead with a card of your choice. The computer players will play a card of that same suit.
- Whoever plays the card of highest value wins that trick! Whoever wins the most tricks will win the game!
- If the computer player does not have a card in your suit, they will play a card of a different suit, but it will not rank higher than yours.

*Cards of rank 10 are removed from the game since they cause errors*

**Packages Used:**

- [chalk](https://github.com/chalk/chalk)
- [readline-sync](https://www.npmjs.com/package/readline-sync)
- [node-cards](http://kbjr.github.io/node-cards/index.html)