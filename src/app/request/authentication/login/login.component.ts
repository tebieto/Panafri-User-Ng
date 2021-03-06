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
  
  }

  ngOnInit() {
    //console.log("device token:" + getString("deviceToken"))
    //console.log("token:" + getString("token"))
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


  
  Login() {
    this.isLoading = true;

    
    this.user.deviceToken= this.DeviceToken;
    //console.log(this.user)
    
    this.loginService.login(this.user)
      .subscribe(
        (result) => {
          this.isLoading = false;
          setString("token", result.token);
          var Product = this.Product
          const param = Object.assign({}, result, Product);
          
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
          alert("Unfortunately we could not find your account.")

        }
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