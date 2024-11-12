class MinMaxScaler {
  constructor() {
    this.min = null;
    this.max = null;
  }

  // Fit the scaler to the data
  fit(data) {
    this.min = Math.min(...data);
    this.max = Math.max(...data);
  }

  // Transform the data based on the fitted scaler
  transform(data) {
    if (this.min === null || this.max === null) {
      throw new Error("Scaler has not been fitted with data.");
    }
    if (this.min === this.max) {
      // If min and max are the same, return 0.5 (or another appropriate constant value)
      return data.map(() => 0.75);
    }
    return data.map((x) => (x - this.min) / (this.max - this.min));
  }

  // Fit to the data and transform it in one step
  fitTransform(data) {
    this.fit(data);
    return this.transform(data);
  }
}

class MaxMinScaler {
  constructor() {
    this.min = null;
    this.max = null;
  }

  fit(data) {
    this.min = Math.min(...data);
    this.max = Math.max(...data);
  }

  transform(data) {
    if (this.min === null || this.max === null) {
      throw new Error("Scaler has not been fitted with data.");
    }
    if (this.min === this.max) {
      // If min and max are the same, return 0.5 (or another appropriate constant value)
      return data.map(() => 0.75);
    }
    return data.map((x) => 1 - (x - this.min) / (this.max - this.min));
  }

  fitTransform(data) {
    this.fit(data);
    return this.transform(data);
  }
}
