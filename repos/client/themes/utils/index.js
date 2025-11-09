export const imageKitLoader = ({ src, width, quality, height }) => {
  if(src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }

  if (height) {
    params.push(`h-${height}`)
  }

  const paramsString = params.join(",");
  var urlEndpoint = `https://ik.imagekit.io/oceanlabs`;
  if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  return `${urlEndpoint}/${src}?tr=${paramsString},c-force`
}

export const createGAEvent = ({action, category, label, value}) => {
  if (window.gtag) {
    window.gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': value
    });
  }
}

export const getVariationGroupBySelection = (productVariationStocks, selectedVariationOptions) => {
  return productVariationStocks.filter(pvs => {
    return selectedVariationOptions.every(svo => {
      //todo: also include non groups variation
      return pvs.variationGroup.find(vg => vg.name === svo.variationName && vg.value === svo.option);
    })
  });
}