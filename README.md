# Overview

Simulator to let people test possible arena opponents against their own team. Or test their own retainers against some reference teams(?)

# Frontend Functionality

* Set up the target team
  * Add a retainer
  * Remove a retainer
  * Edit a retainer
    * Edit the name
    * Edit the worth (level?)
    * Edit the aptitude
    * Edit the Crit Rate
    * Edit the Crit Damage Multiplier
* Set up the attacking retainer
  * Edit the worth
  * Edit the aptitude
  * Edit the Crit Rate
  * Edit the Crit Damage Multiplier
* Run the simulator!
  * Manual
    * Display 3 random bonuses
    * Choose a bonus
    * Display the names and details of 3 retainers
      * option to hide the worth, crit rate, and crit dmg stats
    * Choose a retainer to fight
      * Phase I: auto-skip to Win/Defeat
  * Auto
    * Buy bonus 0,1,2,3

* Sim
  * fix defending team stats
  * fix attacking retainer stats
  * breakdown by equipped curio (may cost 10 gems for equipping magic lamp)
    * effect on worth
    * effect on aptitude
  * breakdown by boost strategies
    * buy the first 50% atk boost: Y/N
    * auto: buy bonus 0/1/2
    

* Stretch
  * Daily Challenge:
    * Challenge Metrics
      * Defeat the most retainers
      * Get the most streak bonuses
      * Ties broken by gems/Fire used
      * Or ranked by Fire delta first, and retainers break ties
    * Setup/Restrictions
      * Given a limited amount of starting Fire/Gems
      * Run one retainer / 3 retainer run / 9 retainer "day"
      * Cannot end with less Fire than started with

# Internal Library Methods

* Get 


# Other

* pick 1/3 retainer randomization per seed 
  * want to decrease randomness as much as possible for public challenges so use the following algorithm
    * construct array of retainers
    * pick 3 indicies for retainers to display
    * when the player chooses one retainer to fight, swap it with the last member of the array
    * on subsequent steps, choose 3 indices  between 0 and n-1 inclusive where n is the number of remaining retainers
  * consequences of using this algorithm:
    * if shown retainers A,B,C in first round, and D,E,F in second round, the choice of retainer to fight in round 1 will have no effect on the available choice of retainers shown in round 2.

* Active helper to choose what bonuses to get once I have an idea of the retainers I am fighting against
  * Given the current 3 retainers, branch for each retainer/boost combination
    * for the remaining, choose the best of 3 choosing strategies
      * random, lowest aptitude, lowest worth
    * and the best of boost strategies (best being retainers then fire)
      * none, all 1, all 2, best value / fire at every step, best value/buy, only buy if the highest value option is offered
    * return the branch with the best retainer count and the least fire spent
  * Input the result of the retainer battle:
    * which retainer was beat
    * how much hp left
    * what are the next retainer options
    * what are the next bonus options
  * loop until dead or won

# Database of Retainer Data

Data: 

* server
* defending player
* number of retainers
* player worth
* timestamp of Arena attempt (I think stats are frozen once battle started)
* For each attack round:
  * derived expected skill level
  * data as outlined in previous section
    * allows me to re-derive updated beliefs if my assumptions change.
      * (for example, above was decribed with every skill level being equally likely, but I may adjust the probabilities of each skill level to account for the higher skill levels being harder to reach. In essence it may be better to view every skill EXP as equally likely rather than every level as equally likely.)

Note:

I need a way to save the fact that they have a retainer at a particular level even though I have not fought it so I have no data on the crit stats. The level and retainer give me a reasonable base to guess aptitude with, and a marker of where worth growth is distributed if it changees the next time I run across the player.

# Using/Querying the DB on a new arena run

Input

* defending player
* current time
* number of retainers
* player worth

Output

return the most recent belief about each of the retainers we have fought. If there are new retainers, include them in the defending retainers list for sim purposes, but leave the details unknown

* stretch:
  * series of retainers modified with the following conditions:
    * If the number of retainers and total worth are the same as the last data point, make no changes
    * If the worth has increased, just distribute the worth evenly over all retainers
    * If the number of retainers has increased, dump all increased worth into the new retainers


    
