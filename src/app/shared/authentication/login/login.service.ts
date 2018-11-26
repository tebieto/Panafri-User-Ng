import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Login } from "./login.model";
import { Config } from "../../config";

@Injectable()
export class LoginService {
    constructor(private http: Http) { }
    
    login(login: Login) {
        return this.http.post(
            Config.apiUrl + "login",
            JSON.stringify({
                email: login.email,
                password: login.password
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            map(data => {return data}),
            catchError(this.handleErrors)
        );
    }

    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}