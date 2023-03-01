import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { isAuthenticated } from './store/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.store.select(isAuthenticated).pipe(
      tap(authenticated => {
        if (authenticated) {
          return true;
        }
        // TODO: refactor route URL
        this.router.navigateByUrl('/landing');
      })
    )
  };

}