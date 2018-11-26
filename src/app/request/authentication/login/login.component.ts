import { Component, OnInit } from "@angular/core";
import { Login } from "../../../shared/authentication/login/login.model";
import { LoginService } from "../../../shared/authentication/login/login.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';


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
  Product= {};
  constructor(private router: Router, 
    private loginService: LoginService, 
    private page: Page,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute
    ) {
    this.user = new Login();
    this.user.email = "tebieto@gmail.com";
    this.user.password = "1223454allu4";
  
  }

  ngOnInit() {
    this.page.actionBarHidden = false;

    this.route.queryParams.subscribe(params => {

    this.Product= params
    }
    );
  }


  
  Login() {
    this.isLoading = true;
    
    this.loginService.login(this.user)
      .subscribe(
        (result) => {
          this.isLoading = false;
          var Product = this.Product
          const param = Object.assign({}, result, Product);
          this.router.navigate(["/AuthRequest"], { queryParams: param });
      },
        (error) => alert("Unfortunately we could not find your account.")
      );
      
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  Register() {

    this.router.navigate(["/RequestRegister"], { queryParams: this.Product });
  }

  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}