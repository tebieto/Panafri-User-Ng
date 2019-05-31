import { Component, OnInit } from "@angular/core";
import { Color } from "tns-core-modules/color";
import { Login } from "../../shared/authentication/login/login.model";
import { LoginService } from "../../shared/authentication/login/login.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";

@Component({
	moduleId: module.id,
	selector: 'forgot',
	templateUrl: 'forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  providers: [LoginService]
})
export class ForgotComponent implements OnInit {
  user: Login;
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
  isLoggingIn = true;
  isLoading = false;
  constructor(private router: Router, 
    private loginService: LoginService, 
    private page: Page,
    private routerExtensions: RouterExtensions,
    ) {
    this.user = new Login();
    this.user.email = "tebieto@gmail.com";
    this.user.deviceToken= this.DeviceToken
  }

  ngOnInit() {
    // console.log("device token:" + getString("deviceToken"))
    // console.log("token:" + getString("token"))
    this.page.actionBarHidden = false;
  
    messaging.getCurrentPushToken()
      .then(token => {
        this.DeviceToken=token
        setString("deviceToken", this.DeviceToken);
      });

   
  }


  
  Forgot() {
    this.isLoading = true;
    this.user.deviceToken= this.DeviceToken;
    
    this.loginService.forgot(this.user)
    .subscribe(
      (result) => {
        this.isLoading=false
        if(result.success) {
          alert("A new password has been sent to your email address")
          return
        }
    },
      (error) => {
        this.isLoading=false
        if(error.status==500 ) {
          alert("Internal server error.")
          return
        }

        if(error.status==400 ) {
          alert("Invalid email address.")
          return
        }
        console.log("error m:"+error)
        alert("Unfortunately we could not establish a connection.")
        return
    }
    );
      
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}