import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Category } from "../../shared/category/category.model";
import { CategoryService } from "../../shared/category/category.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { Router } from '@angular/router';
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'category',
	templateUrl: 'category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [CategoryService]
})

export class CategoryComponent implements OnInit {
	categoryList: Array<Category> = [];
    PageTitle= ""
    category = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private CategoryService: CategoryService,
    private routerExtensions: RouterExtensions,
    private router: Router,
    private route: ActivatedRoute,
	) { }

    ngOnInit() {
      const Active = this.route.snapshot.paramMap.get('name');
      this.PageTitle = Active + ' Category'
      this.isLoading = true;
      this.CategoryService.load(Active)
        .subscribe(loadedCategory => {
          
          loadedCategory.forEach((categoryObject) => {
            this.categoryList.unshift(categoryObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
          
          
        });
    }

    requestCategory(item) {

      var Category= this.categoryList.find(c => {
       return c.id===item
       });
       let result = {token: getString("token")}
       const param = Object.assign({}, result, Category);
      

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