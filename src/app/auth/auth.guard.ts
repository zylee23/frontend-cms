import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { isAuthenticated } from './store/auth.selectors';
import { Route } from '../constants/route.constants';

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
        this.router.navigateByUrl(Route.LANDING);
      })
    )
  };

}