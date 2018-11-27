import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Requests } from "../shared/requests/requests.model";
import { RequestsService } from "../shared/requests/requests.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { ActivatedRoute } from '@angular/router';
import { ListViewEventData, RadListView } from "nativescript-ui-listview";


@Component({
	moduleId: module.id,
	selector: 'requests',
	templateUrl: 'requests.component.html',
  styleUrls: ['./requests.component.css'],
  providers: [RequestsService]
})

export class RequestsComponent implements OnInit {
	requestList= [];
  
    request = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private RequestsService: RequestsService,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute
	) { }

    ngOnInit() {
      this.isLoading = true;

      this.route.queryParams.subscribe(params => {
     
      this.RequestsService.load(params)
        .subscribe(loadedRequests => {
          loadedRequests.forEach((requestObject) => {
            this.requestList.unshift(requestObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
          console.log(this.requestList);
        });
          
      });
    }

    onSwipeCellStarted(args: ListViewEventData) {
      var swipeLimits = args.data.swipeLimits;
      var swipeView = args.object;
      var rightItem = swipeView.getViewById<View>("delete-view");
      swipeLimits.right = rightItem.getMeasuredWidth();
      swipeLimits.left = 0;
      swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
    }

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}