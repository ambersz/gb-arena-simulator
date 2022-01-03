# One Retainer Sim

Inputs:

* attacking retainer:
  * current HP
  * aptitude
  * crit chance
  * crit multiplier
  * atk bonus
  * skill bonus
* defending retainer:
  * worth
  * aptitude
  * crit chance
  * crit multiplier

Output:

* attacking retainer:
  * percentage of sims dead
  * distribution of health in remaining sims

Q: can I get this exact distribution without running multiple sim iterations?

# Displaying the data

* display histogram of hp after battle


# Extracting opponent's average dmg

Inputs:

* attacking retainer
  * aptitude
  * crit chance
  * crit multiplier
  * atk bonus
  * skill bonus
  * HP delta (from before to after battle completed)
* defending retainer
  * HP
  * aptitude

Use simulate attacker only first to get a distribution over number of turns (x) it takes to defeat the retainer.
Number of times attacker was hit it then 1-x.
Average damage of defending retainer is HP delta / (1-x).
Divide by base damage (aptitude * 90 + 200)
Choose a crit chance & crit multiplier configuration where the skill levels (s) are equal.

expected damage multiplier: (1 + (0.0035*s) * (0.03 * s) )

Final x-axis: sqrt(((hp delta) / (1-x) / (aptitude * 90 + 200) - 1) / .0035 / .03)

Weighted average over the likelihood of each turn count to get the final expected skill level (S)

Then use the crit chance S * .0035 and crit multiplier S * .03

Done! Save this model of the defending retainer for future use.

