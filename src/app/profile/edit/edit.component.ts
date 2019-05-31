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
import * as imagepicker from "nativescript-imagepicker";
import { knownFolders, Folder, File } from "tns-core-modules/file-system";
var BackgroundHttp = require("nativescript-background-http");
import { Config } from "../../shared/config";


@Component({
	moduleId: module.id,
	selector: 'edit',
	templateUrl: 'edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [SignupService]
})
export class EditComponent implements OnInit {
  imageAssets = [];
  uploadResponse=[]
  imageSrc: any;
  isSingleMode: boolean = true;
  thumbSize: number = 80;
  previewSize: number = 300;
  user: Signup;
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
  isLoggingIn = true;
  isLoading = false;
  constructor(private router: Router, 
    private editService: SignupService, 
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
    this.user = new Signup();
  
  
  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.user.name= params.name
      this.user.avatar=params.avatar
      this.user.email=params.email
      this.user.phone= params.phone
      
    })


    this.page.actionBarHidden = false;
  
  }

  
  signUp() {
    this.user.token=getString("token")
    this.isLoading = true;
    this.editService.edit(this.user)
    .subscribe(
      (result) => {
        if(result){
          alert(result.success)
        }
        this.isLoading = false;
        this.router.navigate(["/home"], {queryParams: {jwt:getString("token")}});
    },
      (error) => alert("Unfortunately we could not edit your profile.")
    );
      
  }

  public onSelectSingleTap() {
    this.isSingleMode = true;

    let context = imagepicker.create({
        mode: "single"
    });
    this.startSelection(context);
}

private startSelection(context) {
  
  let that = this;

  context
  .authorize()
  .then(() => {
      that.imageAssets = [];
      that.imageSrc = null;
      return context.present();
  })
  .then((selection) => {
      that.imageSrc = that.isSingleMode && selection.length > 0 ? selection[0] : null;
      this.user.avatar= this.imageSrc._android
      this.saveImage(this.user.avatar)
      // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
      selection.forEach(function (element) {
          element.options.width = that.isSingleMode ? that.previewSize : that.thumbSize;
          element.options.height = that.isSingleMode ? that.previewSize : that.thumbSize;
      });

      that.imageAssets = selection;
  }).catch(function (e) {
      console.log(e);
  });
}

saveImage(file){

  // upload configuration
var bghttp = require("nativescript-background-http");
var session = bghttp.session("image-upload");
var request = {
        url: Config.otherUrl + "save/image",
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream"
        }
    };

    let params = [{ "name": "img", "filename": file, "mimeType": "image/png" }];

    let task = session.multipartUpload(params, request);
    
    task.on("responded", (event) => {
      let data = JSON.parse(event.data)
      this.user.avatar= data.URL
    });

    task.on("error", event => {
      
    })

}


  public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
}