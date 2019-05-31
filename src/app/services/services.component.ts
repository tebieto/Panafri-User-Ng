import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Services } from "../shared/services/services.model";
import { ServicesService } from "../shared/services/services.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { Router } from '@angular/router';
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'services',
	templateUrl: 'services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [ServicesService]
})

export class ServicesComponent implements OnInit {
	serviceList: Array<Services> = [];

    service = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private ServicesService: ServicesService,
    private routerExtensions: RouterExtensions,
    private router: Router,
	) { }

    ngOnInit() {
      this.isLoading = true;
      this.ServicesService.load()
        .subscribe(loadedServices => {
          if(loadedServices.length<=0){
            alert('No service at the moment')
          }
          loadedServices.forEach((serviceObject) => {
            this.serviceList.unshift(serviceObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
        });
    }

    requestService(item) {

      var Service= this.serviceList.find(s => {
       return s.id===item
       });
       let result = {token: getString("token")}
       const param = Object.assign({}, result, Service);
       this.router.navigate(["/request"], { queryParams: param });
     }

	public sBLoaded(args) {
		var searchbar: SearchBar = <SearchBar>args.object;
		searchbar.android.clearFocus();
  }
  
  onSearchSubmit(args) {

    let searchBar = <SearchBar>args.object;
        let active =searchBar.text
        this.routerExtensions.navigate(['search', active]);

  }

  public onTextChanged(args) {
       
        
  }

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}