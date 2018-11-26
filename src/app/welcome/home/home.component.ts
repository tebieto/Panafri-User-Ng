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

@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ProductsService, ServicesService]
})

export class HomeComponent implements OnInit {
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

  productList: Array<Products> = [];
  serviceList: Array<Services> = [];
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
		public router: Router,
    private routerExtensions: RouterExtensions,
    private page: Page,
    private route: ActivatedRoute
	) { }

  ngOnInit() {
    this.page.actionBarHidden = false;
    this.isLoading = true;

      
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