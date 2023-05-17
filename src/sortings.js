export const alphabeticalSort = (a,b) => {
  const aLower = a.company.toLowerCase()
  const bLower = b.company.toLowerCase()
  if (aLower < bLower) {
    return -1;
  }
  if (aLower > bLower) {
    return 1;
  } 
  return 0;
}

export const reverseAlphabeticalSort = (a,b) => {
  const aLower = a.company.toLowerCase()
  const bLower = b.company.toLowerCase()
  if (aLower > bLower) {
    return -1;
  }
  if (aLower < bLower) {
    return 1;
  } 
  return 0;
}

export const sortNumWears = (a, b) => {
  if (a.num_wears > b.num_wears) {
    return -1;
  }
  if (a.num_wears < b.num_wears) {
    return 1;
  }
  return 0;
}

export const reverseSortNumWears = (a, b) => {
  if (a.num_wears < b.num_wears) {
    return -1;
  }
  if (a.num_wears > b.num_wears) {
    return 1;
  }
  return 0;
}

export const sortCostPerWear = (a, b) => {
  const aCostPerWear = a.price_bought / a.num_wears;
  const bCostPerWear = b.price_bought / b.num_wears;
  if (aCostPerWear > bCostPerWear) {
    return -1;
  }
  if (aCostPerWear < bCostPerWear) {
    return 1;
  }

  return 0;
}

export const reverseSortCostPerWear = (a, b) => {
  const aCostPerWear = a.price_bought / a.num_wears;
  const bCostPerWear = b.price_bought / b.num_wears;
  if (aCostPerWear < bCostPerWear) {
    return -1;
  }
  if (aCostPerWear > bCostPerWear) {
    return 1;
  }

  return 0;
}