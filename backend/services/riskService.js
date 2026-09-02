export const classifyRisk = (percentage) => {
  if (percentage >= 0.75) {
    return "On Track";
  }

  if (percentage >= 0.60) {
    return "Behind";
  }

  if (percentage >= 0.35) {
    return "At Risk";
  }

  return "Critical";
};