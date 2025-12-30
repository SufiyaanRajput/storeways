class BaseUtilityService {
  constructor() {}

  makeSubtotal(products) {
    return products.reduce((acc, item) => {
      acc+=Number(item.price) * Number(item.quantity);
      return acc; 
    }, 0);
  }

  makeChargeByType(type, storeSettings) {
    if (!storeSettings[type]) return 0;
    if (storeSettings[type].type === 'VALUE') return storeSettings[type].value;
    const subTotal = this.makeSubtotal(products);
    return (subTotal * storeSettings[type].value) / 100;
  }

  makeTotal(products, storeSettings) {
    return this.makeSubtotal(products) + this.makeChargeByType('otherCharges', storeSettings) + this.makeChargeByType('tax', storeSettings);
  }
}

export default BaseUtilityService;