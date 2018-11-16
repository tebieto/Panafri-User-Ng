import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-ui-sidedrawer/angular";
import { SearchBar } from "ui/search-bar";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";

@Component({
  selector: 'products',
  moduleId: module.id,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

  constructor(
    public router: Router,
    private routerExtensions: RouterExtensions,
    private page: Page
  ) { }

  ngOnInit() {

    this.page.actionBarHidden = false;
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