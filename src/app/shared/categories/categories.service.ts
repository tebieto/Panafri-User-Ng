import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Categories } from "./categories.model";

@Injectable()
export class CategoriesService {
    baseUrl = Config.apiUrl + "categories";

    constructor(private http: Http) { }

    load() {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        let params = new URLSearchParams();
        params.append("sort", "{\"_kmd.lmt\": 1}");

        return this.http.get(this.baseUrl).pipe(
            map(res => res.json()),
            map(data => {
                let categoryList = [];
                data.forEach((categories) => {
                    categoryList.push(new Categories(
                        categories.id, 
                        categories.name, 
                        categories.type,
                        categories.image, 
                        categories.created_at,
                        categories.updated_at, 
                        ));
                });
                return categoryList;
            }),
            catchError(this.handleErrors)
        );
    }

    
    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Kinvey " + Config.token);
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}