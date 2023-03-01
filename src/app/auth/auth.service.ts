import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { AuthActions } from './store/auth.action-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: Store<AppState>, private http: HttpClient) {}

  login(email: string, password: string) {
    this.store.dispatch(AuthActions.loginStart({ email, password }));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  autoLogin() {
    this.store.dispatch(AuthActions.autoLogin());
  }

}