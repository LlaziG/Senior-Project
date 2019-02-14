import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {}
  login() {
    let element = document.querySelector(".loginButton");
		//Process
		if(!(element.className.indexOf("processing") >= 0)){
			element.classList.remove("error");
			element.classList.add("processing");
			element.querySelector("span").style.display = "none";
			setTimeout(() => {
        element.querySelector("div").style.display = "block";
			}, 200);
			//Start Ajax
      //Failed
     setTimeout(() => {
        element.classList.remove("processing");
        element.querySelector("div").style.display = "none";
        
       setTimeout(() => {
          element.querySelector("span").style.display = "block";
          element.classList.add("error");
        }, 300);
      }, 20000);
      //Success
     setTimeout(() => {
        this.router.navigate(['/', 'dashboard']);
        document.getElementsByClassName("loginUsername")[0].classList.add("hidden");
        document.getElementsByClassName("loginPassword")[0].classList.add("hidden");
        document.getElementsByClassName("loginButton")[0].classList.add("hidden");
       setTimeout(() => {
          element.classList.remove("processing");
          element.classList.remove("error");
          document.getElementsByClassName("loginSideBar")[0].classList.add("sideBar");
         
          //Logout
          document.querySelector('.sideBar .image img').addEventListener("click", ()=>{
            element.querySelector("div").style.display = "none";
            element.querySelector("span").style.display = "block";
            document.getElementsByClassName("loginSideBar")[0].classList.remove("sideBar");
           setTimeout(() => {
              document.getElementsByClassName("loginUsername")[0].classList.remove("hidden");
              document.getElementsByClassName("loginPassword")[0].classList.remove("hidden");
              document.getElementsByClassName("loginButton")[0].classList.remove("hidden");
            }, 600);
            
          });
        }, 800);
      }, 500);
    }
  }
  title = 'angular';
}
