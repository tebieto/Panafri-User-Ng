import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Services } from "../shared/services/services.model";
import { ServicesService } from "../shared/services/services.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";


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
	) { }

    ngOnInit() {
      this.isLoading = true;
      this.ServicesService.load()
        .subscribe(loadedServices => {
          loadedServices.forEach((serviceObject) => {
            this.serviceList.unshift(serviceObject);
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