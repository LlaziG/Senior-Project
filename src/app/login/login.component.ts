import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { timeout } from 'q';
import { routerTransition } from '../router.animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [routerTransition]
})
export class LoginComponent implements OnInit {
  email: any;
  password: any;
  returnUrl: string;

  ngOnInit() {
    this.email = document.getElementById("loginUsername");
    this.password = document.getElementById("loginPassword");
    setTimeout(() => {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      if (localStorage.getItem('currentUser')) {
        this.loginSuccessful(document.querySelector(".loginButton"), "");
      }
    }, 1);
    

  }
  constructor(private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
  async login() {
    let element = document.querySelector(".loginButton");
    //Process
    if (!(element.className.indexOf("processing") >= 0)) {
      element.classList.remove("error");
      element.classList.add("processing");
      element.querySelector("span").style.display = "none";
      setTimeout(() => {
        element.querySelector("div").style.display = "block";
      }, 200);
      //Start Ajax
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.authenticationService.login(this.email.value, this.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loginSuccessful(element, data);
          },
          error => {
            this.loginFailed(element, error);
          });
    }
  }
  loginSuccessful(element: any, data: any) {
    this.router.navigate([this.returnUrl]);
    document.getElementsByClassName("loginUsername")[0].classList.add("hidden");
    document.getElementsByClassName("loginPassword")[0].classList.add("hidden");
    document.getElementsByClassName("loginButton")[0].classList.add("hidden");
    setTimeout(() => {
      element.classList.remove("processing");
      element.classList.remove("error");
      document.getElementsByClassName("loginSideBar")[0].classList.add("sideBar");
      this.email.value = "";
      this.password.value = "";
      //Logout
      document.querySelector('.sideBar .image img').addEventListener("click", () => {
        element.querySelector("div").style.display = "none";
        element.querySelector("span").style.display = "block";
        document.getElementsByClassName("loginSideBar")[0].classList.remove("sideBar");
        setTimeout(() => {
          this.logout();
          document.getElementsByClassName("loginUsername")[0].classList.remove("hidden");
          document.getElementsByClassName("loginPassword")[0].classList.remove("hidden");
          document.getElementsByClassName("loginButton")[0].classList.remove("hidden");
        }, 600);
      });
    }, 800);
  }
  loginFailed(element: any, error: any) {
    element.classList.remove("processing");
    element.querySelector("div").style.display = "none";

    setTimeout(() => {
      element.querySelector("span").style.display = "block";
      element.classList.add("error");
    }, 300);
  }
}
