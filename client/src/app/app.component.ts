import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'q';
import { routerTransition } from './router.animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
  title = 'angular';
}
