import { Component, OnInit } from "@angular/core";
import { Login } from "../../../shared/authentication/login/login.model";
import { LoginService } from "../../../shared/authentication/login/login.service";
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
	selector: 'login',
	templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  user: Login;
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
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
    console.log("device token:" + getString("deviceToken"))
    console.log("token:" + getString("token"))
    this.page.actionBarHidden = false;
  
    messaging.getCurrentPushToken()
      .then(token => {
        this.DeviceToken=token
        setString("deviceToken", this.DeviceToken);
      });

    messaging.registerForPushNotifications({
      onPushTokenReceivedCallback: (token: string): void => {
        console.log("Firebase plugin received a push token: " + token);
      },
    
      onMessageReceivedCallback: (message: Message) => {
       console.log("Push message received: " + message.data.body);
       this.NotTitle=message.data.title
       this.NotBody=message.data.body
       this.NotImage=message.data.image
       this.NotIcon=message.data.icon
       LocalNotifications.schedule([{
        id: 1,
        title: this.NotTitle,
        body: this.NotBody,
        badge: 1,
        ongoing: true, // makes the notification ongoing (Android only)
        icon: this.NotIcon,
        image: this.NotImage,
        thumbnail: true,
        at: new Date(new Date().getTime() + (10 * 1000)) // 10 seconds from now
      }]).then(
          function() {
            console.log("Notification scheduled");
          },
          function(error) {
            console.log("scheduling error: " + error);
          }
      )
      
      },
    
      // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
      showNotifications: true,
    
      // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
     
    }).then(() => console.log("Registered for push"));
    
    this.route.queryParams.subscribe(params => {

    this.Product= params
    }
    );
  }


  
  Login() {
    this.isLoading = true;

    
    this.user.deviceToken= this.DeviceToken;
    console.log(this.user)
    
    this.loginService.login(this.user)
      .subscribe(
        (result) => {
          this.isLoading = false;
          setString("token", result.token);
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