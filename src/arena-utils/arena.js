export function randomDmgModifier(seed) {
  return (Math.random() - 0.5) * 2 * 0.1 + 1
}
export function crit(seed, chance) {
  return Math.random() < chance;
}
export function getDmg(seed, aptitude) {
  return (aptitude * 90 + 200) * randomDmgModifier(seed);
}

/**
 * 
 * @param {*} seed 
 * @param {*} param1 
 * @param {*} atkBonus 
 * @param {*} skillBonus 
 * @returns {number} attack damage
 */
export function getAttack(seed, { aptitude, critChance, critMultiplier }, atkBonus = 0, skillBonus = 0) {
  return getDmg(seed, aptitude) * (1 + crit(seed, critChance) * (critMultiplier + skillBonus)) * (1 + atkBonus);
}
