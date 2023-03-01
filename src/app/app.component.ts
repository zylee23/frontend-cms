import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from './store/app.reducer';
import { AuthService } from './auth/auth.service';
import { selectAuthState } from './auth/store/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  private storeSub: Subscription;
  username: string = null;
  role: string = null;

  constructor(private authService: AuthService, private store: Store<AppState>) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.storeSub = this.store.select(selectAuthState).subscribe({
      next: resolve => {
        this.username = resolve.username;
        this.role = resolve.role;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}
