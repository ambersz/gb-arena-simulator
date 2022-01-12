const LOCAL = !!process.env.REACT_APP_FEATURE_FLAGS;

const localFeatures = {
  stalking: true
}
const globalFeatures = {
  stalking: false
}
const features = LOCAL ? localFeatures : globalFeatures;

export default features;