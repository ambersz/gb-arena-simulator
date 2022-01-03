function getWorth({ aptitude = 60, level = 100, applyAllBoostEXP = 0, percentWorth = 0, flatWorth = 0 }) {
  const boost = getBoostBenefits(level);

  return (aptitude + applyAllBoostEXP ? boost.bookEXP / 200 : 0) * boost.baseWorth * (1 + percentWorth + boost.percentWorth) + flatWorth + boost.flatWorth
}

function getBoostBenefits(level) {
  // TODO
  return {
    flatWorth: 123,
    percentWorth: 123,
    baseWorth: 123,
    bookEXP: 200,
  }
}

const utils = {
  getWorth,
  getBoostBenefits
}
export default utils