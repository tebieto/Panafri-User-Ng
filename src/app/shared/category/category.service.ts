import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Category } from "./category.model";

@Injectable()
export class CategoryService {
    baseUrl = Config.apiUrl + "category/";

    constructor(private http: Http) { }

    load(Active) {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        let params = new URLSearchParams();
        params.append("sort", "{\"_kmd.lmt\": 1}");

        return this.http.get(this.baseUrl + Active).pipe(
            map(res => res.json()),
            map(data => {
                let categoryList = [];
                data.forEach((category) => {
                    categoryList.push(new Category(
                        category.id, 
                        category.name, 
                        category.price, 
                        category.owner,
                        category.type, 
                        category.description, 
                        category.category, 
                        category.location,
                        category.status,
                        category.image, 
                        category.created_at,
                        category.updated_at, 
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