import { Component, OnInit } from "@angular/core";
import { Signup } from "../../shared/authentication/signup/signup.model";
import { SignupService } from "../../shared/authentication/signup/signup.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";
import { ActivatedRoute } from "@angular/router";


@Component({
	moduleId: module.id,
	selector: 'change',
	templateUrl: 'change.component.html',
  styleUrls: ['./change.component.css'],
  providers: [SignupService]
})
export class ChangeComponent implements OnInit {
  user: Signup;
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
  isLoggingIn = true;
  isLoading = false;
  constructor(private router: Router, 
    private changeService: SignupService, 
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
    this.user = new Signup();
  
  
  }

  ngOnInit() {
    
    this.page.actionBarHidden = false;
  
  }

  
  signUp() {
    this.user.token=getString("token")
    // console.log(this.user)
    this.isLoading = true;
    this.changeService.change(this.user)
    .subscribe(
      (result) => {
        this.isLoading = false;
        if(result) {
          alert(result.success)
        }
        this.logout()
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
        alert("Unfortunately we could not change your password.")
      }
    );
      
  }

  logout() {
    setString("token", "")
    this.routerExtensions.navigate(['welcome']);
  }

  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}