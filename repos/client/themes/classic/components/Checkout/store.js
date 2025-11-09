import {createContext} from 'react';
import {makeObservable, observable, action, autorun, values} from "mobx";

class Checkout {
  order = {};

  constructor() {
    this.load();
    makeObservable(this, {
      order: observable,
      setOrder: action,
      clearStore: action
    })
  }

  load(){
    try{
      const presisted = localStorage.getItem('checkout');

      if (presisted) {
        this.order = JSON.parse(presisted).order;
      }
    }catch(e) {

    }
  }

  setOrder(order){
    this.order = order;
  }

  clearStore(){
    this.items = [];
  }
}

let isFirstRun = true;
export const checkoutStore = new Checkout();

autorun(() => {
  const newCheckout = { ...checkoutStore };

  if(typeof window !== 'undefined' && !isFirstRun){
    localStorage.setItem('checkout', JSON.stringify(newCheckout));
  }

  isFirstRun = false;
});

export default createContext(checkoutStore);