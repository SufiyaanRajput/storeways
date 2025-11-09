import {createContext} from 'react';
import {makeObservable, observable, action, autorun, values} from "mobx";

class Cart {
  items = [];
  totalAmount = 0;

  constructor() {
    this.load();
    makeObservable(this, {
      items: observable,
      totalAmount: observable,
      addItem: action,
      setTotalAmount: action,
      setItems: action,
      removeItem: action,
      clearStore: action
    })
  }

  load(){
    try{
      const presisted = localStorage.getItem('cart');
    if (presisted) {
      this.setItems(JSON.parse(presisted));
    }
    }catch(e) {

    }
  }

  setItems({items, totalAmount}){
    this.items = items;

    if (totalAmount) {
      this.totalAmount = totalAmount;
    }
  }

  setTotalAmount(amount){
    this.totalAmount = amount;
  }

  addItem(value){
    const hasItem = this.items.some(item => item.id === value.id);
    
    if (hasItem) {
      this.items = this.items.map(item => {
        if (item.id === value.id) {
          return {...value};
        }

        return {...item};
      });
    } else {
      this.items = [...this.items, {...value}];
    }
  }

  removeItem(id){
    this.items = this.items.filter(item => item.id !== id);
  }

  clearStore(){
    this.items = [];
    this.totalAmount = 0;
  }
}

let isFirstRun = true;
export const cartStore = new Cart();

autorun(() => {
  const newCart = { ...cartStore };

  if(typeof window !== 'undefined' && !isFirstRun){
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  isFirstRun = false;
});

export default createContext(cartStore);