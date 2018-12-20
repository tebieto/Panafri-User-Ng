import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { UserService } from "../../shared/user/user.service";
import { User } from "../../shared/user/user.model";
import { SellerService } from "../../shared/seller/seller.service";
import { Seller } from "../../shared/seller/seller.model";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import * as phone from 'nativescript-phone';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'status',
	templateUrl: 'status.component.html',
  styleUrls: ['./status.component.css'],
  providers: [UserService, SellerService]
})
export class StatusComponent implements OnInit {
  userList: Array<User> = [];
  sellerList: Array<Seller> = [];
  statusList=[]
  SellerName= ""
  SellerAvatar= ""
  SellerPhone= ""
  PageTitle=""
  productName=""
  productImage=""
  token=getString("token")
  SellerDeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  isLoading = true;
  listLoaded = false;
  isStatusing = true;
  constructor(private router: Router, 
    private UserService: UserService,
    private SellerService: SellerService,  
    private page: Page,
    private route: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    ) {
  
  }

  ngOnInit() {
  if(getString("token").length==0) {
    this.router.navigate(["welcome"]); 
  }

  this.isLoading = true;
  this.listLoaded = false;
    this.page.actionBarHidden = false;

    this.route.queryParams.subscribe(params => {
      this.statusList.push(params)

      this.SellerService.load(params)
      .subscribe(loadedSeller => {
        console.log(loadedSeller)
        this.SellerName = loadedSeller[0].name
        this.SellerAvatar = loadedSeller[0].avatar
        this.SellerPhone = loadedSeller[0].phone
        this.SellerDeviceToken = loadedSeller[0].profile.about
        
        this.isLoading = false;
        this.listLoaded = true;

      })
        
        
    });

    
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
    this.isStatusing = !this.isStatusing;
  }

  

  
}