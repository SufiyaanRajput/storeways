import {createContext} from 'react';
import {makeObservable, observable, action, autorun} from "mobx";

class Product {
    key = null;
    name = null;
    categoryIds = [];
    sku = null;
    status = null;
    description=null;
    returnPolicy=null;
    stock=null;
    price=null;
    images=[];
    maxOrderQuantity=-1;
    variations=[];

  constructor() {
    this.load();
    makeObservable(this, {
      key: observable,
      name: observable,
      categoryIds: observable,
      description: observable,
      returnPolicy: observable,
      stock: observable,
      maxOrderQuantity: observable,
      price: observable,
      images: observable,
      sku: observable,
      status: observable,
      variations: observable,
      setProduct: action,
      clearStore: action
    })
  }

  load(){
    const presisted = localStorage.getItem('product');
    if (presisted) {
      this.setProduct(JSON.parse(presisted));
    }
  }

  setProduct({key, name, categoryIds, sku, status, variations, description, returnPolicy, stock, price, images, maxOrderQuantity}){
    this.key = key;
    this.name = name;
    this.categoryIds = categoryIds;
    this.sku = sku;
    this.maxOrderQuantity = maxOrderQuantity || -1;
    this.status = status;
    this.description = description;
    this.returnPolicy = returnPolicy;
    this.images = images || [];
    this.stock = stock;
    this.price = price;
    this.variations = variations;
  }

  clearStore(){
    this.key = null;
    this.name = null;
    this.categoryIds = [];
    this.sku = null;
    this.maxOrderQuantity = null;
    this.description=null;
    this.returnPolicy=null;
    this.stock=null;
    this.price=null;
    this.images=[];
    this.status = null;
    this.variations = [];
  }
}

let isFirstRun = true;
export const productStore = new Product();

autorun(() => {
  const newProduct = { ...productStore };

  if(typeof window !== 'undefined' && !isFirstRun){
    localStorage.setItem('product', JSON.stringify(newProduct));
  }

  isFirstRun = false;
});

export default createContext(productStore);