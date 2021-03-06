import { Component, OnInit } from "@angular/core";
import { Request } from "../shared/request/request.model";
import { RequestService } from "../shared/request/request.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user.model";
import { SellerService } from "../shared/seller/seller.service";
import { Seller } from "../shared/seller/seller.model";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import * as phone from 'nativescript-phone';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";
import { Notification } from "../shared/notification/request/notification.model";
import {  NotificationService } from "../shared/notification/request/notification.service";


@Component({
	moduleId: module.id,
	selector: 'request',
	templateUrl: 'request.component.html',
  styleUrls: ['./request.component.css'],
  providers: [RequestService, UserService, SellerService, NotificationService]
})
export class RequestComponent implements OnInit {
  userList: Array<User> = [];
  sellerList: Array<Seller> = [];
  requestList= []
  request: Request;
  not: Notification;
  AuthId=""
  AuthName= ""
  AuthAvatar= ""
  SellerId=""
  SellerName= ""
  SellerAvatar= ""
  SellerPhone= ""
  PageTitle=""
  productName=""
  productPrice=""
  productImage=""
  token=getString("token")
  SellerDeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  isLoading = true;
  listLoaded = false;
  isRequesting = true;
  constructor(private router: Router, 
    private requestService: RequestService,
    private UserService: UserService,
    private SellerService: SellerService,
    private notificationService: NotificationService,  
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
    this.request = new Request();
    this.not = new Notification();
  
  }

  ngOnInit() {
  if(getString("token").length==0) {
    this.router.navigate(["welcome"]); 
  }
  this.isLoading = true;
  this.listLoaded = false;
    this.page.actionBarHidden = false;
    this.route.queryParams.subscribe(params => {
      
      this.token= params.token
      this.requestList.push(params)
      const token = params.token
      this.PageTitle= params.name
      this.productName= params.name
      this.productPrice= params.price
      this.productImage= params.image
      this.SellerId = params.owner

      this.SellerService.load(params)
      .subscribe(loadedSeller => {
        // console.log(loadedSeller)
        this.SellerName = loadedSeller[0].name
        this.SellerAvatar = loadedSeller[0].avatar
        this.SellerPhone = loadedSeller[0].phone
        this.SellerDeviceToken = loadedSeller[0].profile.about
        // console.log("device:" + this.SellerDeviceToken)

      })

      this.UserService.load(token)
      .subscribe(loadedUser => {
      
        if(loadedUser[0].status){
          const newParam = Object.keys(params).reduce((object, key) => {
            if (key !== "token") {
              object[key] = params[key]
            }
            return object
          }, {})
          this.router.navigate(["/RequestLogin"], { queryParams: newParam});
        }

        this.request.product_id= params.id
        this.request.buyer_id = loadedUser[0].user.id
        this.request.type= params.type
        this.request.seller_id= params.owner
        this.request.delivery= 1
        this.request.location= "Unknown"
        this.request.token= params.token
        this.Request()

        this.AuthId=loadedUser[0].user.id
        this.AuthName=loadedUser[0].user.name
        this.AuthAvatar=loadedUser[0].user.avatar
        loadedUser.forEach((userObject) => {
        this.userList.unshift(userObject);
          
        },
        (error) => alert("Unfortunately we could not load user.")
    
        );

        
        
      });

    
    })
    
  }


  
  Request() {
    this.requestService.request(this.request)
      .subscribe(
        (result) => {
          // console.log(result)

          
        this.notify(result.id)

          this.isLoading = false;
          this.listLoaded = true;
        
         
      },
        (error) => {
          
          alert("Unfortunately we could not send request.")
          this.routerExtensions.navigate(['login']);
        } 
      );
      
  }

  notify(rid) {
        this.not.id = this.SellerId;
        this.not.title = this.AuthName.toUpperCase();
        this.not.body = this.AuthName.toUpperCase() + " requested " + this.productName;
        this.not.image = this.productImage;
        this.not.type= "Request"
        this.not.name = this.productName
        this.not.price = this.productPrice
        this.not.rid = rid
        this.not.app = "partner";
        this.not.icon = this.AuthAvatar;
        this.not.deviceToken = this.SellerDeviceToken;
        this.not.authDeviceToken =  getString("deviceToken")

        this.notificationService.notification(this.not)
    .subscribe(
      (result) => {
       // console.log(result)
    },
      (error) => {
        // console.log(error)
        alert("Unfortunately we could not push notification.")
      }
    );

  }

  onSwipeCellStarted(args: ListViewEventData) {
    var swipeLimits = args.data.swipeLimits;
    var swipeView = args.object;
    var rightItem = swipeView.getViewById<View>("delete-view");
    swipeLimits.right = rightItem.getMeasuredWidth();
    swipeLimits.left = 0;
    swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
  }

  public goBack() {
		this.router.navigate(["/home"], { queryParams: { jwt: this.token } });
  }

  toggleDisplay() {
    this.isRequesting = !this.isRequesting;
  }

  call() {

      phone.dial(String(this.SellerPhone), true)
    
  }

  
}