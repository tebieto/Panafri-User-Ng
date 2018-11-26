import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Search } from "./search.model";

@Injectable()
export class SearchService {
    baseUrl = Config.apiUrl + "search/";

    constructor(private http: Http) { }

    load(Active) {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        let params = new URLSearchParams();
        params.append("sort", "{\"_kmd.lmt\": 1}");

        return this.http.get(this.baseUrl + Active).pipe(
            map(res => res.json()),
            map(data => {
                let searchList = [];
                data.forEach((search) => {
                    searchList.push(new Search(
                        search.id, 
                        search.name, 
                        search.price, 
                        search.owner,
                        search.type, 
                        search.description, 
                        search.category, 
                        search.location,
                        search.status,
                        search.image, 
                        search.created_at,
                        search.updated_at, 
                        ));
                });
                return searchList;
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