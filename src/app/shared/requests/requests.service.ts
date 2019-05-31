import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { getString,setString,clear} from "tns-core-modules/application-settings";

import { Config } from "../config";
import { Requests } from "./requests.model";

@Injectable()
export class RequestsService {
    baseUrl = Config.apiUrl + "requests";

    constructor(private http: Http) { }

    load(params) {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
        
        let headers = new Headers({ "Authorization": "Bearer " + getString("token") });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.get(this.baseUrl,options).pipe(
            map(res => res.json()),
            map(data => {
                
                let requestList = [];
                data.forEach((request) => {
                    requestList.push(new Requests(
                        request.id, 
                        request.type, 
                        request.sender, 
                        request.receiver,
                        request.status,
                        request.delivery,
                        request.location,
                        request.seler_status,
                        request.buyer_status,
                        request.created_at,
                        request.updated_at, 
                        ));
                });
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