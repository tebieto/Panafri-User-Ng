import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Search } from "../shared/search/search.model";
import { SearchService } from "../shared/search/search.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";


@Component({
	moduleId: module.id,
	selector: 'search',
	templateUrl: 'search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})

export class SearchComponent implements OnInit {
	searchList: Array<Search> = [];
    PageTitle= ""
    search = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private SearchService: SearchService,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute,
	) { }

    ngOnInit() {
      const Active = this.route.snapshot.paramMap.get('name');
      this.PageTitle = Active + ' Search'
      this.isLoading = true;
      this.SearchService.load(Active)
        .subscribe(loadedSearch => {
          loadedSearch.forEach((searchObject) => {
            this.searchList.unshift(searchObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
        });
    }

	public sBLoaded(args) {
		var searchbar: SearchBar = <SearchBar>args.object;
		searchbar.android.clearFocus();
  }

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}