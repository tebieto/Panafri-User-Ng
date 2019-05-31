import { Component, OnInit } from "@angular/core";
import { Signup } from "../../../shared/authentication/signup/signup.model";
import { SignupService } from "../../../shared/authentication/signup/signup.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'signup',
	templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService]
})
export class SignupComponent implements OnInit {
  user: Signup;
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
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
    
  
  
  }

  ngOnInit() {

    this.page.actionBarHidden = false;
  
    messaging.getCurrentPushToken()
      .then(token => {
        this.DeviceToken=token
        setString("deviceToken", this.DeviceToken);
      });

    

    this.route.queryParams.subscribe(params => {

    this.Product= params
    }
    );
  }


  
  signUp() {

    this.user.deviceToken= this.DeviceToken;
    this.isLoading = true;
    this.signupService.signup(this.user)
    .subscribe(
      (result) => {
        this.isLoading = false;
          setString("token", result.token);
          var Product = this.Product
          var token= {token:result.token}
          const param = Object.assign({}, token, Product);
          this.router.navigate(["/AuthRequest"], { queryParams: param });
    },
      (error) => {
        let body = JSON.stringify(error._body)
        //console.log(body)
       
        if (body){
          body = body.replace(/"|\\|}|\{|]|\[/g, "")
          body = body.replace(/,/g, " ")
          alert(body)
          return
        }
        alert("Unfortunately we could not create your account.")
      }
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