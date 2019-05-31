import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from "../../shared/products/products.model";
import { ProductsService } from "../../shared/products/products.service";
import { Services } from "../../shared/services/services.model";
import { ServicesService } from "../../shared/services/services.service";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-ui-sidedrawer/angular";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";
import { ActivatedRoute } from '@angular/router';
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import { LocalNotifications } from "nativescript-local-notifications";
import { Observable } from "tns-core-modules/data/observable";
import { getString,setString,clear} from "tns-core-modules/application-settings";
import { UserService } from "../../shared/user/user.service";
import { User } from "../../shared/user/user.model";

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
  DeviceToken=""
  NotTitle=""
  NotBody=""
  NotImage=""
  NotIcon=""
  noProduct=0;
  noService=0;
    product = "";
    service = "";
    user = "";
    AuthName = "";
    AuthAvatar = "";
    isLoading = false;
    listLoaded = false;
    TokenParams= [];

	constructor(
    private ServiceService: ServicesService,
    private ProductsService: ProductsService,
    private UserService: UserService,
		public router: Router,
    private routerExtensions: RouterExtensions,
    private page: Page,
    private route: ActivatedRoute
	) { }

  ngOnInit() {
    this.page.actionBarHidden = false;
    
    messaging.getCurrentPushToken()
      .then(token => {
        this.DeviceToken=token
        setString("deviceToken", this.DeviceToken);
      });

    messaging.registerForPushNotifications({
      onPushTokenReceivedCallback: (token: string): void => {
        // console.log("Firebase plugin received a push token: " + token);
      },
    
      onMessageReceivedCallback: (message: Message) => {
       
        if(message.data.app=="user"){return}
       // console.log("Push message received: " + message.data.body);
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
    

    this.UserService.load(getString("token"))
        .subscribe(loadedUser => {  
            
            if(loadedUser[0].status) {
              setString("token", "")
            } else if(loadedUser[0].user) {
            this.router.navigate(["/home"], { queryParams: { jwt: getString("token") } });
            }
          },
          (error) => {
          });

    this.isLoading = true;

      
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

  request(item) {

   var Product= this.productList.find(p => {
    return p.id===item
    });
    this.router.navigate(["/RequestLogin"], { queryParams: Product });
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

  Login() {
    this.routerExtensions.navigate(['login']);
  }

  Register() {
    this.routerExtensions.navigate(['signup'])
  }

    public searchPhrase: string;

    public onSearchSubmit(args) {
        let searchBar = <SearchBar>args.object;
        let active =searchBar.text
        this.routerExtensions.navigate(['search', active]);
        
    }

    public sBLoaded(args){
      var searchbar:SearchBar = <SearchBar>args.object;
      searchbar.android.clearFocus();
  
    }

    public onTextChanged(args) {
       
    }
}