import { Component, OnInit } from "@angular/core";
import { Signup } from "../../../shared/authentication/signup/signup.model";
import { SignupService } from "../../../shared/authentication/signup/signup.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
	moduleId: module.id,
	selector: 'signup',
	templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})
export class SignupComponent implements OnInit {
  user: Signup;
  isLoggingIn = true;
  isLoading = false;
  Product={}
  constructor(private router: Router, 
    private signupService: SignupService, 
    private page: Page,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute
    ) {
    this.user = new Signup();
    this.user.email = "regina@gmail.com";
    this.user.name = "Regina Ebieto";
    this.user.phone = "08399485734";
    this.user.password = "1223454allu4";
    this.user.password_confirmation = "1223454allu4";
  
  
  }

  ngOnInit() {
    this.page.actionBarHidden = false;

    this.route.queryParams.subscribe(params => {

    this.Product= params
    }
    );
  }


  
  signUp() {
    this.isLoading = true;
    this.signupService.signup(this.user)
    .subscribe(
      (result) => {
        this.isLoading = false;

          var Product = this.Product
          var token= {token:result.token}
          const param = Object.assign({}, token, Product);
          this.router.navigate(["/AuthRequest"], { queryParams: param });
    },
      (error) => alert("Unfortunately we could not create your account.")
    );
      
  }

  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

  Login() {

    this.router.navigate(["/RequestLogin"], { queryParams: this.Product });
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}