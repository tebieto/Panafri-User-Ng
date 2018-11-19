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
    isLoading = false;
    listLoaded = false;

	constructor(
    private ServiceService: ServicesService,
		private ProductsService: ProductsService,
		public router: Router,
    private routerExtensions: RouterExtensions,
    private page: Page
	) { }

  ngOnInit() {

    this.page.actionBarHidden = false;
    this.isLoading = true;
      this.ProductsService.load()
        .subscribe(loadedProducts => {
          loadedProducts.forEach((productObject) => {
            this.productList.unshift(productObject);
            
          });
          this.isLoading = false;
          this.listLoaded = true;
        });

        this.isLoading = true;
        this.ServiceService.load()
          .subscribe(loadedServices => {
            loadedServices.forEach((serviceObject) => {
              this.serviceList.unshift(serviceObject);
              console.log(serviceObject)
            });
            this.isLoading = false;
            this.listLoaded = true;
          });
  }

  // submit() {
  //   this.router.navigate(['authenticate']);
  // }

  public sBLoaded(args){
    var searchbar:SearchBar = <SearchBar>args.object;
    searchbar.android.clearFocus();
  }

  onOpenDrawerTap() {
    this.drawerComponent.sideDrawer.showDrawer();
  }

  onCloseDrawerTap() {
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  goToProduct(i) {
    this.routerExtensions.navigate(['products', i]);
  }

  request() {
    this.routerExtensions.navigate(['requests']);
  }

  goToCategories() {
    this.routerExtensions.navigate(['categories']);
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
    this.routerExtensions.navigate(['authentication', 'login']);
  }

  goToProfile() {
    this.routerExtensions.navigate(['profile'])
  }
}