import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { getString,setString,clear} from "tns-core-modules/application-settings";

import { Review } from "./review.model";
import { Config } from "../config";

@Injectable()
export class ReviewService {
    constructor(private http: Http) { }
    token= ""
    review(review: Review) {
        
         this.token = "Bearer" + review.token

        let headers = new Headers({ "Authorization": this.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            Config.apiUrl + "review",
            JSON.stringify({
                avatar: review.avatar,
                partner_id: review.partner_id,
                rating: review.rating,
                message: review.message,
                name: review.name,
            }), 
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            map(data => {
                return data
            }),
            catchError(this.handleErrors)
        );
    }

    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", this.token);
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}