import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SearchBar } from "ui/search-bar";
import { Reviews } from "../shared/reviews/reviews.model";
import { ReviewsService } from "../shared/reviews/reviews.service";
import { switchMap } from "rxjs/operators";
import { RouterExtensions } from 'nativescript-angular/router';
import { View } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";
import { ActivatedRoute } from '@angular/router';
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { getString,setString,clear} from "tns-core-modules/application-settings";


@Component({
	moduleId: module.id,
	selector: 'reviews',
	templateUrl: 'reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  providers: [ReviewsService]
})

export class ReviewsComponent implements OnInit {
	reviewList= [];
  
    review = "";
    isLoading = false;
    listLoaded = false;

	constructor(
		private ReviewsService: ReviewsService,
    private routerExtensions: RouterExtensions,
    private route: ActivatedRoute
	) { }

    ngOnInit() {
      this.isLoading = true;

      if(getString("token").length==0) {
        this.routerExtensions.navigate(["welcome"]); 
      }

     
      this.ReviewsService.load()
        .subscribe(loadedReviews => {
          if (loadedReviews.length<=0){
            alert('No review at the moment')
            return
          }
          loadedReviews.forEach((reviewObject) => {
            this.reviewList.unshift(reviewObject);
          });
          this.isLoading = false;
          this.listLoaded = true;
        },
        (error)=>{
          // console.log(error)
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

    reviewPartner(item) {

      var Partner= this.reviewList.find(r => {
       return r.id===item
       });
       let param = {token: getString("token"),  id:Partner.id, name:Partner.name, avatar:Partner.avatar, device:Partner.profile.about, }
       this.routerExtensions.navigate(["/review"], { queryParams: param });
     }

	public goBack() {
		this.routerExtensions.backToPreviousPage();
  }

}