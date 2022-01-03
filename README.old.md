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
    
