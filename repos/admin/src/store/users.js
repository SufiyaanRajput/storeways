import {createContext} from 'react';
import {makeObservable, observable, action, autorun} from "mobx";

class User {
  name=null;
  mobile=null;
  role=null;
  storeId=null;
  authToken=null;

  constructor({name=null, mobile=null, role=null, authToken=null, storeId=null}={}) {
    this.name = name;
    this.mobile=mobile;
    this.role=role;
    this.storeId=storeId;
    this.authToken=authToken;

    this.load();
    makeObservable(this, {
      name: observable,
      mobile: observable,
      role: observable,
      storeId: observable,
      authToken: observable,
      setUser: action,
      setToken: action,
      clearStore: action
    })
  }

  load(){
    const presisted = localStorage.getItem('user');
    if (presisted) {
      this.setUser(JSON.parse(presisted));
    }
  }

  setUser({name, mobile, role, storeId, authToken}){
    this.name = name;
    this.mobile=mobile;
    this.role=role;
    this.storeId=storeId;
    this.authToken=authToken;
    localStorage.setItem('auth-token', authToken);
  }

  setToken(token){
    this.authToken = token;
  }

  clearStore(){
    this.name = null;
    this.mobile=null;
    this.role=null;
    this.storeId=null;
    this.authToken=null;
    localStorage.removeItem('user');
  }
}

let isFirstRun = true;
export const userStore = new User();

autorun(() => {
  const newUser = { ...userStore };

  if(typeof window !== 'undefined' && !isFirstRun){
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  isFirstRun = false;
});

export default createContext(userStore);