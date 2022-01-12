import { getAttack } from "./arena";
const retainers = [
  {
    worth: 123,
    aptitude: 123,
  }
];

const aAttackingRetainer = {
  hp: 196420,
  worth: 196420,
  aptitude: 73,
  critChance: 0.0805,
  critMultiplier: 0.69,
  atkBonus: 0.5,
  skillBonus: 0,
}

const aDefendingRetainer = {
  worth: 1025476,
  aptitude: 87,
  critChance: .02,
  critMultiplier: .03,
}

export function simBattle(attackingRetainer = aAttackingRetainer, defendingRetainer = aDefendingRetainer) {
  let aHP = attackingRetainer.hp;
  let dHP = defendingRetainer.worth;
  let turn = Math.round(Math.random()); // 0 for attacking, 1 for defending

  while (aHP > 0 && dHP > 0) {
    if (turn === 0) {
      dHP -= getAttack('', attackingRetainer, attackingRetainer.atkBonus, attackingRetainer.skillBonus);
    } else {
      aHP -= getAttack('', defendingRetainer)
    }
    turn = 1 - turn;
  }

  return {
    death: (aHP <= 0) ? 1 : 0,
    aHP: Math.max(aHP, 0),
    dHP: Math.max(dHP, 0),
    hpLost: attackingRetainer.hp - aHP,
    hpLostPercentage: (attackingRetainer.hp - aHP) / attackingRetainer.worth
  }
}

console.log(simBattle(aAttackingRetainer, aDefendingRetainer))

