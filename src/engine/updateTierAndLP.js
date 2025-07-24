/**
 * Update player tier and LP based on skill change
 * @param {number} skillChange - Change in conservative skill rating
 * @returns {Object} Information about tier changes
 */
updateTierAndLP(skillChange) {
  const oldTier = this.playerData.tier;
  const oldConfidenceBand = this.playerData.confidenceBand;
  const oldLp = this.playerData.lp;

  // Determine new tier based on conservative skill rating and confidence
  const newTierData = this.getTierFromSkill(this.playerData.conservativeRating, this.playerData.confidence);

  let lpChange = newTierData.lp - oldLp;
  let tierChanged = false;
  let bandChanged = false;
  const achievements = [];

  if (newTierData.tier !== oldTier) {
    // Tier changed
    tierChanged = true;

    // Check if it's a promotion or demotion
    const tierOrder = Object.keys(this.tiers);
    const oldTierIndex = tierOrder.indexOf(oldTier);
    const newTierIndex = tierOrder.indexOf(newTierData.tier);

    if (newTierIndex > oldTierIndex) {
      // Promotion to higher tier
      achievements.push({
        type: "promotion",
        message: `Promoted to ${newTierData.tierName}!`,
        tier: newTierData.tier,
        confidenceBand: newTierData.confidenceBand
      });

      // Award promotion rewards
      this.awardPromotionRewards(newTierData.tier, newTierData.confidenceBand);
    } else {
      // Demotion to lower tier
      achievements.push({
        type: "demotion",
        message: `Demoted to ${newTierData.tierName}`,
        tier: newTierData.tier,
        confidenceBand: newTierData.confidenceBand
      });
    }
  } else if (newTierData.confidenceBand !== oldConfidenceBand) {
    // Confidence band changed within same tier
    bandChanged = true;

    // Check if it's a band promotion or demotion
    const bandOrder = ["uncertain", "developing", "established", "proven"];
    const oldBandIndex = bandOrder.indexOf(oldConfidenceBand);
    const newBandIndex = bandOrder.indexOf(newTierData.confidenceBand);

    if (newBandIndex > oldBandIndex) {
      // Band promotion
      achievements.push({
        type: "band_promotion",
        message: `Advanced to ${newTierData.tierName} ${newTierData.bandName}! ${newTierData.bandIcon}`,
        tier: newTierData.tier,
        confidenceBand: newTierData.confidenceBand
      });
    } else {
      // Band demotion
      achievements.push({
        type: "band_demotion",
        message: `Moved to ${newTierData.tierName} ${newTierData.bandName} ${newTierData.bandIcon}`,
        tier: newTierData.tier,
        confidenceBand: newTierData.confidenceBand
      });
    }
  }

  // Update player data
  this.playerData.tier = newTierData.tier;
  this.playerData.confidenceBand = newTierData.confidenceBand;
  this.playerData.lp = newTierData.lp;

  return {
    lpChange,
    tierChanged,
    bandChanged,
    achievements
  };
}