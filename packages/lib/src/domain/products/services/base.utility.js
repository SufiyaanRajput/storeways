class BaseUtilityService {
  constructor() {}

  getVariationGroupBySelection(productVariationStocks, selectedVariationOptions) {
    return productVariationStocks.filter(pvs => {
      return selectedVariationOptions.every(svo => {
        //todo: also include non groups variation
        return pvs.variationGroup.find(vg => vg.name === svo.variationName && vg.value === svo.option);
      })
    });
  }
}

export default BaseUtilityService;