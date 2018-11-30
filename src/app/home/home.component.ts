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
    product = "";
    service = "";
    user = "";
    AuthName = "";
    AuthAvatar = "";
    isLoading = false;
    listLoaded = false;
    TokenParams= "";

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
    this.isLoading = true;

    this.route.queryParams.subscribe(params => {
      
        this.TokenParams=getString("token")

        this.UserService.load(params)
        .subscribe(loadedUser => {
          this.AuthName=loadedUser[0].name
          this.AuthAvatar=loadedUser[0].avatar
          loadedUser.forEach((userObject) => {
            this.userList.unshift(userObject);
            
          },
          (error) => {
            alert("Unfortunately we could not retireve your profile.")
            this.routerExtensions.navigate(['login']);
          }
      
          );
          this.isLoading = false;
          this.listLoaded = true;
        });
      });
      
      this.ProductsService.load()
        .subscribe(loadedProducts => {
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
    this.routerExtensions.navigate(['login']);
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