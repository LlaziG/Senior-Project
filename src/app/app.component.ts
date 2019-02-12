import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  login() {
    let element = document.querySelector(".loginButton");
		//Process
		if(!(element.className.indexOf("processing") >= 0)){
			element.classList.remove("error");
			element.classList.add("processing");
			element.querySelector("span").style.display = "none";
			setTimeout(function() {
        element.querySelector("div").style.display = "block";
			}, 200);
			//Start Ajax
      //Failed
      setTimeout(function() {
        element.classList.remove("processing");
        element.querySelector("div").style.display = "none";
        
        setTimeout(function() {
          element.querySelector("span").style.display = "block";
          element.classList.add("error");
        }, 300);
      }, 2000);
      //Success
      setTimeout(function() {
        document.getElementsByClassName("loginUsername")[0].classList.add("hidden");
        document.getElementsByClassName("loginPassword")[0].classList.add("hidden");
        document.getElementsByClassName("loginButton")[0].classList.add("hidden");
        setTimeout(function() {
          element.classList.remove("processing");
          element.classList.remove("error");
          document.getElementsByClassName("loginSideBar")[0].classList.add("sideBar");
          //Logout
          document.querySelector('.sideBar .image img').addEventListener("click", ()=>{
            document.getElementsByClassName("loginSideBar")[0].classList.remove("sideBar");
            setTimeout(function() {
              document.getElementsByClassName("loginUsername")[0].classList.remove("hidden");
              document.getElementsByClassName("loginPassword")[0].classList.remove("hidden");
              document.getElementsByClassName("loginButton")[0].classList.remove("hidden");
            }, 600);
            
          });
        }, 800);
      }, 5000);
    }
  }
  title = 'angular';
}
