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
                password: login.password,
                deviceToken: login.deviceToken,
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            map(data => {return data})
        );
    }

    forgot(login: Login) {
        return this.http.post(
            Config.otherUrl + "reset",
            JSON.stringify({
                email: login.email,
                password: login.password,
                deviceToken: login.deviceToken,
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(data => {return data}),
            map(response => response.json()),
            
        );
    }

    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

  
}