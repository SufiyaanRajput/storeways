import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const defaultProduct = {
  key: null,
  name: null,
  categoryIds: [],
  sku: null,
  status: null,
  description: null,
  returnPolicy: null,
  stock: null,
  price: null,
  images: [],
  maxOrderQuantity: -1,
  variations: [],
};

export const productAtom = atomWithStorage("product", defaultProduct);

export const setProductAtom = atom(null, (get, set, product) => {
    console.log('setProductAtom', product);
  const current = get(productAtom) || defaultProduct;
  set(productAtom, { ...current, ...product });
});

export const clearProductAtom = atom(null, (_get, set) => {
  set(productAtom, defaultProduct);
});

export { defaultProduct };

