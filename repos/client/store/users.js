import {createContext} from 'react';
import {makeObservable, observable, action, autorun} from "mobx";

class User {
  id=null;
  name=null;
  mobile=null;
  role=null;
  storeId=null;
  authToken=null;
  email=null;
  address=null;
  landmark=null;
  pincode=null;

  constructor() {
    makeObservable(this, {
      id: observable,
      name: observable,
      email: observable,
      mobile: observable,
      role: observable,
      storeId: observable,
      authToken: observable,
      address: observable,
      landmark: observable,
      pincode: observable,
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

  setUser({id, name, mobile, role, storeId, email = null, address=null, landmark=null, pincode=null, authToken}){
    this.id = id;
    this.name = name;
    this.mobile=mobile;
    this.email=email;
    this.role=role;
    this.storeId=storeId;
    this.authToken=authToken;
    this.address=address;
    this.landmark=landmark;
    this.pincode=pincode;
    localStorage.setItem('auth-token', authToken);
  }

  setToken(token){
    this.authToken = token;
  }

  clearStore(){
    this.id = null;
    this.name = null;
    this.mobile=null;
    this.email=null;
    this.role=null;
    this.storeId=null;
    this.address=null;
    this.landmark=null;
    this.pincode=null;
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