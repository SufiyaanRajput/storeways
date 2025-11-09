import {createContext} from 'react';
import {makeObservable, observable, action} from "mobx";

class Store {
  id=null;
  activeTheme=null;
  name=null;
  logo=null;
  settings=null;
  subDomain=null;
  termsOfService=null;
  privacyPolicy=null;

  constructor() {
    makeObservable(this, {
      id: observable,
      name: observable,
      activeTheme: observable,
      logo: observable,
      settings: observable,
      subDomain: observable,
      termsOfService: observable,
      privacyPolicy: observable,
      setStore: action,
      clearStore: action
    })
  }

  setStore({id, name, subDomain, settings, activeTheme, privacyPolicy, termsOfService, logo}){
    this.id = id;
    this.name=name;
    this.subDomain=subDomain;
    this.settings=settings;
    this.activeTheme=activeTheme;
    this.privacyPolicy=privacyPolicy;
    this.termsOfService=termsOfService;
    this.logo=logo;
  }

  clearStore(){
    this.id=null;
    this.activeTheme=null;
    this.name=null;
    this.logo=null;
    this.settings=null;
    this.subDomain=null;
    this.termsOfService=null;
    this.privacyPolicy=null;
  }
}

export const storeStore = new Store();

export default createContext(storeStore);