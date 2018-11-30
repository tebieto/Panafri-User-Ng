import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { getString,setString,clear} from "tns-core-modules/application-settings";

import { Request } from "./request.model";
import { Config } from "../config";

@Injectable()
export class RequestService {
    constructor(private http: Http) { }
    token= ""
    request(request: Request) {
        console.log(request)
         this.token = "Bearer" + request.token

        let headers = new Headers({ "Authorization": this.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            Config.apiUrl + "request",
            JSON.stringify({

                product_id: request.product_id,
                type: request.type,
                seller_id: request.seller_id,
                buyer_id: request.buyer_id,
                delivery: request.delivery,
                location: request.location,
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