import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { getString,setString,clear} from "tns-core-modules/application-settings";

import { Config } from "../config";
import { Reviews } from "./reviews.model";

@Injectable()
export class ReviewsService {
    baseUrl = Config.apiUrl + "reviews";

    constructor(private http: Http) { }

    load() {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        
        let headers = new Headers({ "Authorization": "Bearer " + getString("token") });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.get(this.baseUrl,options).pipe(
            map(res => res.json()),
            map(data => {
                return data;
            }),
        );
    }

    
    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Kinvey " + Config.token);
        return headers;
    }

    handleErrors(error: Response) {
        // console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}