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
  styleUrls: ['./login.component.scss'],
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
      else {
        this.addAnimations();

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
  addAnimations() {
    const loginSideBar = document.getElementsByClassName("loginSideBar")[0];
    
    loginSideBar.setAttribute("style", "-moz-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);-webkit-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);transition:all 1000ms cubic-bezier(0.23, 1, 0.32, 1);");
    loginSideBar.querySelector(".menu").setAttribute("style", "-moz-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);-webkit-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);transition:all 1000ms cubic-bezier(0.23, 1, 0.32, 1);");
    loginSideBar.querySelector(".loginForm").setAttribute("style", "display:block;-moz-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);-webkit-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);transition:all 1000ms cubic-bezier(0.23, 1, 0.32, 1);");
    loginSideBar.querySelector(".login input").setAttribute("style", "-moz-transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);-webkit-transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);transition:all 400ms cubic-bezier(0.77, 0, 0.175, 1);");
    loginSideBar.querySelector(".loginButton").setAttribute("style", "-moz-transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);-webkit-transition: all 400ms cubic-bezier(0.77, 0, 0.175, 1);transition:all 400ms cubic-bezier(0.77, 0, 0.175, 1);") 
    loginSideBar.querySelectorAll(".loginUsername, .loginPassword, .loginButton").forEach(el =>{
      el.setAttribute("style", "-moz-transition: all 600ms cubic-bezier(0.77, 0, 0.175, 1);-webkit-transition: all 600ms cubic-bezier(0.77, 0, 0.175, 1);transition:all 600ms cubic-bezier(0.77, 0, 0.175, 1);")
    })
    loginSideBar.querySelector(".loginName").setAttribute("style", "-moz-transition: all 800ms cubic-bezier(0.23, 1, 0.32, 1);-webkit-transition: all 800ms cubic-bezier(0.23, 1, 0.32, 1);transition:all 800ms cubic-bezier(0.23, 1, 0.32, 1);")
    loginSideBar.querySelector(".loginName i").setAttribute("style", "-moz-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);-webkit-transition: all 1000ms cubic-bezier(0.23, 1, 0.32, 1);transition:all 1000ms cubic-bezier(0.23, 1, 0.32, 1);")
  }
  loginSuccessful(element: any, data: any) {
    this.router.navigate([this.returnUrl]);
    document.getElementsByClassName("loginUsername")[0].classList.add("hidden");
    document.getElementsByClassName("loginPassword")[0].classList.add("hidden");
    document.getElementsByClassName("loginButton")[0].classList.add("hidden");
    document.getElementsByClassName("loginUsername")[0].setAttribute('disabled', 'true');
    document.getElementsByClassName("loginPassword")[0].setAttribute('disabled', 'true');
    document.getElementsByClassName("loginButton")[0].setAttribute('disabled', 'true');


    setTimeout(() => {
      element.classList.remove("processing");
      element.classList.remove("error");
      document.getElementsByClassName("loginSideBar")[0].classList.add("sideBar");
      this.email.value = "";
      this.password.value = "";
      setTimeout(() => {
        this.addAnimations();
      }, 1000);
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
          document.getElementsByClassName("loginUsername")[0].setAttribute('disabled', 'false');
          document.getElementsByClassName("loginPassword")[0].setAttribute('disabled', 'false');
          document.getElementsByClassName("loginButton")[0].setAttribute('disabled', 'false');
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
