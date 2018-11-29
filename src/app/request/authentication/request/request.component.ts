import { Component, OnInit } from "@angular/core";
import { Request } from "../../../shared/request/request.model";
import { RequestService } from "../../../shared/request/request.service";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../../../shared/user/user.service";
import { User } from "../../../shared/user/user.model";
import { SellerService } from "../../../shared/seller/seller.service";
import { Seller } from "../../../shared/seller/seller.model";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import * as phone from 'nativescript-phone';


@Component({
	moduleId: module.id,
	selector: 'request',
	templateUrl: 'request.component.html',
  styleUrls: ['./request.component.css'],
  providers: [RequestService, UserService, SellerService]
})
export class RequestComponent implements OnInit {
  userList: Array<User> = [];
  sellerList: Array<Seller> = [];
  requestList= []
  request: Request;
  AuthName= ""
  AuthAvatar= ""
  SellerName= ""
  SellerAvatar= ""
  SellerPhone= ""
  PageTitle=""
  token=""
  isLoading = true;
  listLoaded = false;
  isRequesting = true;
  constructor(private router: Router, 
    private requestService: RequestService,
    private UserService: UserService,
    private SellerService: SellerService,  
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
    this.request = new Request();
  
  }

  ngOnInit() {
  this.isLoading = true;
  this.listLoaded = false;
    this.page.actionBarHidden = false;
    this.route.queryParams.subscribe(params => {
      this.token= params.token
      this.requestList.push(params)
      const token = {jwt: params.token}
      this.PageTitle= params.name

      this.SellerService.load(params)
      .subscribe(loadedSeller => {
        this.SellerName = loadedSeller[0].name
        this.SellerAvatar = loadedSeller[0].avatar
        this.SellerPhone = loadedSeller[0].phone
        
      })

      this.UserService.load(token)
      .subscribe(loadedUser => {
        this.request.product_id= params.id
        this.request.buyer_id = loadedUser[0].user.id
        this.request.type= params.type
        this.request.seller_id= params.owner
        this.request.delivery= 1
        this.request.location= "Bariga"
        this.request.token= params.token
        this.Request()

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
          console.log(result)
          this.isLoading = false;
          this.listLoaded = true;
        
         
      },
        (error) => {
          
          alert("Unfortunately we could not send request.")
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