---
title: Shutting Down PlayTicTacToe.page
date: 2021-05-04
tag:
- archived-projects
---
A friend of mine created a bingo caller at [letsplaybingo.io](https://letsplaybingo.io/) which I found pretty interesting. She got lots of traffic and a lot of appreciative people.  This inspired me to make a simple game website to keep my skills up to date. Maybe people would love it, too! (spoiler alert: they didn't)

<!--more-->

I launched PlayTicTacToe.page using a VueJS project first. I had created a single player game where you could play against the computer (easy was launched, which was basically random picking values, "hard" was planned for later where I'd have the computer try to guess good places to place it's O markers).  Or, you could play 2 player on the same screen/browser.

After this, I decided I'd rather create a 2 player game where you could play over the internet against someone else. I decided to rewrite the website - still in Vue - using Firebase. Firestore and cloud functions would allow me to open up socket connections and create games.

The new version allowed a 1 player game (which was basically the same as 'easy) and a 2 player game system.  With 2 player now, you would get a link that was a 'series.'  This you could share with the player you wanted to play against.  They would join the game with that series link, and then you played multiple games. A long-running score was tracked.

A couple things I learned about this:

First, I created my scoring application in a cloud function.  These can be slow to start up - so I wish I didn't do this. The logic could have been kept in the front end of the app solely, and the data written could have been validated with the Firestore rules (they're simple enough for tic tac toe) - instead of running a slow-to-boot function.

Second, I don't like that there's no real capping mechanism on Firebase. You can get alerted - but it doesn't cap the expense. What if it went super viral (hahah) while I was sleeping. I could wake up to tons of charges.

Before this project, I had known how to use cloud functions and firestore before, but I feel like I learned even more here.  My vue programming also got a little bit of a brush up.  In the end, though, the site didn't get more than a couple hundred visitors, and about 20 games, over a little over a year.  

The [archived Github](https://github.com/aaronsaray/playtictactoe.page) repo is here. Here are some screenshots of the site:

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-01.jpg)](/uploads/2021/playtictactoe.page-01.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-02.jpg)](/uploads/2021/playtictactoe.page-02.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-03.jpg)](/uploads/2021/playtictactoe.page-03.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-04.jpg)](/uploads/2021/playtictactoe.page-04.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-05.jpg)](/uploads/2021/playtictactoe.page-05.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-06.jpg)](/uploads/2021/playtictactoe.page-06.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-07.jpg)](/uploads/2021/playtictactoe.page-07.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-08.jpg)](/uploads/2021/playtictactoe.page-08.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-09.jpg)](/uploads/2021/playtictactoe.page-09.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-10.jpg)](/uploads/2021/playtictactoe.page-10.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-11.jpg)](/uploads/2021/playtictactoe.page-11.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-12.jpg)](/uploads/2021/playtictactoe.page-12.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-13.jpg)](/uploads/2021/playtictactoe.page-13.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-14.jpg)](/uploads/2021/playtictactoe.page-14.jpg){: .thumbnail}

[![Play Tic Tact Toe Page](/uploads/2021/playtictactoe.page-15.jpg)](/uploads/2021/playtictactoe.page-15.jpg){: .thumbnail}

