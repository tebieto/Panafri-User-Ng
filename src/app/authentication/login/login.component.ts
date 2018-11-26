import { Component, OnInit } from "@angular/core";
import { Login } from "../../shared/authentication/login/login.model";
import { LoginService } from "../../shared/authentication/login/login.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';


@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: Login;
  isLoggingIn = true;
  isLoading = false;
  constructor(private router: Router, 
    private loginService: LoginService, 
    private page: Page,
    private routerExtensions: RouterExtensions,
    ) {
    this.user = new Login();
    this.user.email = "tebieto@gmail.com";
    this.user.password = "1223454allu4";
  
  }

  ngOnInit() {
    this.page.actionBarHidden = false;
  }


  
  Login() {
    this.isLoading = true;
    
    this.loginService.login(this.user)
      .subscribe(
        (result) => {
          this.isLoading = false;
         
          this.router.navigate(["/home"], { queryParams: { jwt: result.token } });
      },
        (error) => alert("Unfortunately we could not find your account.")
      );
      
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}