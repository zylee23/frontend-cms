import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '../constants/route.constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {

  constructor(private router: Router) { }

  goToRegistration() {
    this.router.navigateByUrl(Route.REGISTRATION);
  }

  goToLogin() {
    this.router.navigateByUrl(Route.LOGIN);
  }

}
