import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from "../shared/products/products.model";
import { ProductsService } from "../shared/products/products.service";
import { Services } from "../shared/services/services.model";
import { ServicesService } from "../shared/services/services.service";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-ui-sidedrawer/angular";
import { SearchBar } from "ui/search-bar";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user.model";
import { ActivatedRoute } from '@angular/router';
import { getString,setString,clear} from "tns-core-modules/application-settings";
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";

@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ProductsService, ServicesService, UserService]
})

export class HomeComponent implements OnInit {
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

  productList: Array<Products> = [];
  serviceList: Array<Services> = [];
  userList: Array<User> = [];
    user=""
    product = "";
    service = "";
    AuthName = "";
    AuthAvatar = "";
    AuthEmail=""
    AuthPhone=""
    isLoading = false;
    listLoaded = false;
    TokenParams= "";
    NotTitle=""
    NotBody=""
    NotImage=""
    NotIcon=""
    noService=0
    noProduct=0
    NotRequestStatus=""
    NotRequestType=""
    NotProductName=""
    NotProductOwner=""
    NotProductPrice=""

	constructor(
    private ServiceService: ServicesService,
    private ProductsService: ProductsService,
    private UserService: UserService,
		public router: Router,
    private routerExtensions: RouterExtensions,
    private page: Page,
    private route: ActivatedRoute
	) { 

    
  }
 
  ngOnInit() {

    LocalNotifications.addOnMessageReceivedCallback(
      function (notification) {
        
      }
  ).then(i=> {
    if(this.NotRequestType=="Request"){
      // console.log("It worked:" + this.NotRequestType)
    let param = {token: getString("token"), name:this.NotProductName, image: this.NotImage , owner:this.NotProductOwner, price:this.NotProductPrice, status:this.NotRequestStatus }
    this.routerExtensions.navigate(["/status"], { queryParams: param });
    }

  }
  )

    if(getString("token").length==0) {
      this.router.navigate(["welcome"]); 
    }

    messaging.registerForPushNotifications({
      onPushTokenReceivedCallback: (token: string): void => {
        // console.log("Firebase plugin received a push token: " + token);
      },
    
      onMessageReceivedCallback: (message: Message) => {
        
        if(message.data.app=="user") {
          return false
        }
       this.NotTitle=message.data.title
       this.NotBody=message.data.body
       this.NotImage=message.data.image
       this.NotProductName=message.data.name
       this.NotProductPrice= message.data.price
       this.NotProductOwner=message.data.id
       this.NotRequestStatus=message.data.status
       this.NotRequestType=message.data.type
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
            // console.log("Notification scheduled");
          },
          function(error) {
            // console.log("scheduling error: " + error);
          }
      )
      
      },
    
      // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
      showNotifications: true,
    
      // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
     
    }).then(() =>  console.log("Registered for push"));
    
    this.page.actionBarHidden = false;
    this.isLoading = true;
    this.TokenParams= getString("token");
    this.route.queryParams.subscribe(params => {
      
      });

      this.UserService.load(getString("token"))
        .subscribe(loadedUser => {
          this.AuthName=loadedUser[0].user.name
          this.AuthAvatar=loadedUser[0].user.avatar
            this.AuthEmail=loadedUser[0].user.email
            this.AuthPhone=loadedUser[0].user.phone
            this.isLoading = false;
            this.listLoaded = true;
          },
          (error) => {
            alert("Unfortunately we could not retireve your profile.")
            this.routerExtensions.navigate(['login']);
          });
         
      
      
      this.ProductsService.load()
        .subscribe(loadedProducts => {
          if (loadedProducts.length<=0){
            if (this.noProduct==1){return}
            this.noProduct==1
            alert('No product at the moment')
            return
          }
          loadedProducts.forEach((productObject) => {
            this.productList.unshift(productObject);
            
          },
          (error) => alert("Unfortunately we could not load products.")
      
          );
          this.isLoading = false;
          this.listLoaded = true;
        });

        this.isLoading = true;
        this.ServiceService.load()
          .subscribe(loadedServices => {
            if (loadedServices.length<=0){
              if (this.noService==1){return}
              this.noService==1
              alert('No service at the moment')
              return
            }
            loadedServices.forEach((serviceObject) => {
              this.serviceList.unshift(serviceObject);
              
            },
            (error) => alert("Unfortunately we could not load services.")
      
            );
            this.isLoading = false;
            this.listLoaded = true;
          });

        
  }

  // submit() {
  //   this.router.navigate(['authenticate']);
  // }

  onOpenDrawerTap() {
    this.drawerComponent.sideDrawer.showDrawer();
  }

  onCloseDrawerTap() {
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  goToProduct(i) {
    this.routerExtensions.navigate(['products', i]);
  }

  goToRequests() {
    this.routerExtensions.navigate(['requests'], { queryParams: { jwt: this.TokenParams }});
  }

  goToCategories() {
    this.routerExtensions.navigate(['categories']);
  }
  goToCategory(name: string) {
    this.routerExtensions.navigate(['category', name]);
  }

  goToProducts() {
    this.routerExtensions.navigate(['products']);
  }

  goToServices() {
    this.routerExtensions.navigate(['services']);
  }

  goToNotifications() {
    this.routerExtensions.navigate(['notifications']);
  }

  logout() {
    setString("token", "")
    this.TokenParams=""
    this.routerExtensions.navigate(['welcome']);
  }

  goToProfile() {
    this.routerExtensions.navigate(['profile'])
  }

  public searchPhrase: string;

  onSearchSubmit(args) {

    let searchBar = <SearchBar>args.object;
        let active =searchBar.text
        this.routerExtensions.navigate(['search', active]);

  }

  reviewPartners() {
     this.router.navigate(["/reviews"]);
   }

   editProfile() {
    let profile= {name:this.AuthName, avatar:this.AuthAvatar, email:this.AuthEmail, phone:this.AuthPhone}
    this.router.navigate(["/edit-profile"], {queryParams:profile});
  }

  changePassword() {
    this.router.navigate(["/change-password"]);
  }

  requestProduct(item) {

    var Product= this.productList.find(p => {
     return p.id===item
     });
     let result = {token: this.TokenParams}
     const param = Object.assign({}, result, Product);
     this.router.navigate(["/request"], { queryParams: param });
   }

   requestService(item) {

    var Service= this.serviceList.find(s => {
     return s.id===item
     });
     let result = {token: this.TokenParams}
     const param = Object.assign({}, result, Service);
     this.router.navigate(["/request"], { queryParams: param });
   }

  public sBLoaded(args){
    var searchbar:SearchBar = <SearchBar>args.object;
    searchbar.android.clearFocus();

  }

  public onTextChanged(args) {
       
        
  }

}