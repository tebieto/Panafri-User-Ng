import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Search } from "../shared/search/search.model";
import { SearchService } from "../shared/search/search.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { Router } from '@angular/router';
import { getString,setString,clear} from "tns-core-modules/application-settings";


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
    private router: Router,
    private route: ActivatedRoute,
	) { }

    ngOnInit() {
      const Active = this.route.snapshot.paramMap.get('name');
      this.PageTitle = Active + ' Search'
      this.isLoading = true;
      this.SearchService.load(Active)
        .subscribe(loadedSearch => {
          if (loadedSearch.length<=0){
            alert('Result not found')
            return
          }
          loadedSearch.forEach((searchObject) => {
            this.searchList.unshift(searchObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
        });
    }

    requestSearch(item) {

      var Search= this.searchList.find(s => {
       return s.id===item
       });
       let result = {token: getString("token")}
       const param = Object.assign({}, result, Search);
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