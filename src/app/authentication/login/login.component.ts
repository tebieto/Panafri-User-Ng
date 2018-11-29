import { Component, OnInit } from "@angular/core";
import { Login } from "../../shared/authentication/login/login.model";
import { LoginService } from "../../shared/authentication/login/login.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";


@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: Login;
  DeviceToken=""
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

    messaging.getCurrentPushToken()
    .then(token => {
      this.DeviceToken=token
      console.log(this.DeviceToken)
    });
    messaging.registerForPushNotifications({
      onPushTokenReceivedCallback: (token: string): void => {
        console.log("Firebase plugin received a push token: " + token);
      },
    
      onMessageReceivedCallback: (message: Message) => {
        console.log("Push message received: " + message.title);
      },
    
      // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
      showNotifications: true,
    
      // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
      showNotificationsWhenInForeground: true
    }).then(() => console.log("Registered for push"));
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