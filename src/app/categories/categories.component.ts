import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Categories } from "../shared/categories/categories.model";
import { CategoriesService } from "../shared/categories/categories.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";


@Component({
	moduleId: module.id,
	selector: 'categories',
	templateUrl: 'categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [CategoriesService]
})

export class CategoriesComponent implements OnInit {
	categoryList: Array<Categories> = [];
    category = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private CategoriesService: CategoriesService,
    private routerExtensions: RouterExtensions,
	) { }

    ngOnInit() {
      this.isLoading = true;
      this.CategoriesService.load()
        .subscribe(loadedCategories => {
          loadedCategories.forEach((categoryObject) => {
            this.categoryList.unshift(categoryObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
        });
    }

    goToCategory(name: string) {
      this.routerExtensions.navigate(['category', name]);
    }

	public sBLoaded(args) {
		var searchbar: SearchBar = <SearchBar>args.object;
		searchbar.android.clearFocus();
	}

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}