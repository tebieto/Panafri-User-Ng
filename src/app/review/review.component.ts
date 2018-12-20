import { Component, OnInit } from "@angular/core";
import { Review } from "../shared/review/review.model";
import { ReviewService } from "../shared/review/review.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../shared/user/user.service";
import {Slider} from "tns-core-modules/ui/slider";
import { User } from "../shared/user/user.model";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { getString,setString,clear} from "tns-core-modules/application-settings";
import { Notification } from "../shared/notification/review/notification.model";
import {  NotificationService } from "../shared/notification/review/notification.service";
import { registerElement } from 'nativescript-angular/element-registry';
registerElement('StarRating', () => require('nativescript-star-ratings').StarRating);




@Component({
	moduleId: module.id,
	selector: 'review',
	templateUrl: 'review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [ReviewService, UserService, NotificationService]
})
export class ReviewComponent implements OnInit {
  userList: Array<User> = [];
  reviewList= []
  review: Review;
  rating=3
  not: Notification;
  AuthId=""
  AuthName= ""
  message=""
  AuthAvatar= ""
  PageTitle=""
  partnerAvatar=""
  partnerId=0
  token=getString("token")
  PartnerDeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  isLoading = true;
  listLoaded = false;
  isReviewing = true;
  constructor(private router: Router, 
    private reviewService: ReviewService,
    private UserService: UserService,
    private notificationService: NotificationService,  
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
    this.review = new Review();
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
      this.reviewList.push(params)
      this.PageTitle= params.name
      this.partnerId= parseInt(params.id)
      this.partnerAvatar= params.avatar
      this.PartnerDeviceToken=params.device

      this.UserService.load(this.token)
      .subscribe(loadedUser => {
  
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


  
  Review() {
    
    this.review.token=this.token
    this.review.partner_id=this.partnerId
    this.review.avatar= this.AuthAvatar
    this.review.name= this.AuthName
    this.review.rating= this.rating
    this.reviewService.review(this.review)
      .subscribe(
        (result) => {
          console.log(result)

          
          this.notify()

          this.isLoading = false;
          this.listLoaded = true;
        
         
      },
        (error) => {
          console.log(error)
        } 
      );
      
  }

  notify() {
        this.not.id = this.AuthId;
        this.not.title = this.AuthName.toUpperCase();
        this.not.body = this.AuthName.toUpperCase() + " reviewed you.";
        this.not.image = this.AuthAvatar;
        this.not.type = "Review"
        this.not.app = "partner";
        this.not.icon = this.AuthAvatar;
        this.not.deviceToken = this.PartnerDeviceToken;
        this.not.authDeviceToken =  getString("deviceToken")
        console.log(this.not)
        this.notificationService.notification(this.not)
    .subscribe(
      (result) => {
       console.log(result)
    },
      (error) => alert("Unfortunately we could not push notification.")
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
    this.isReviewing = !this.isReviewing;
  }

  remark(rt){
    let rating = parseInt(rt)
    if(rating==7) {
      return "Perfect"
    }

    if(rating>3 && rating<7) {
      return "Good"
    }

    if(rating==3) {
      return "Okay"
    }

    if(rating<3) {
      return "Poor"
    }
  }

 onSliderChange(args) {
    const sliderComponent: Slider = <Slider>args.object;
    this.rating= sliderComponent.value
}

  arrayGold(n: number): any[] {
    return Array(n);
  }

  arrayWhite(n: number): any[] {
    let m = 7-n
    return Array(m);
  }


  
}