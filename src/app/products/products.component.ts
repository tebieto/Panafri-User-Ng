import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Products } from "../shared/products/products.model";
import { ProductsService } from "../shared/products/products.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { Router } from '@angular/router';
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'products',
	templateUrl: 'products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductsService]
})

export class ProductsComponent implements OnInit {
	productList: Array<Products> = [];

    product = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private ProductsService: ProductsService,
    private routerExtensions: RouterExtensions,
    private router: Router,
	) { }

    ngOnInit() {
      this.isLoading = true;
      
      this.ProductsService.load()
        .subscribe(loadedProducts => {
          loadedProducts.forEach((productObject) => {
            this.productList.unshift(productObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
          
          console.log(this.productList)
        });
        
        
    }

    requestProduct(item) {

      var Product= this.productList.find(p => {
       return p.id===item
       });
       let result = {token: getString("token")}
       const param = Object.assign({}, result, Product);
       this.router.navigate(["/request"], { queryParams: param });
     }

	public sBLoaded(args) {
		var searchbar: SearchBar = <SearchBar>args.object;
		searchbar.android.clearFocus();
	}

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}