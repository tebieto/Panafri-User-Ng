import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Signup } from "./signup.model";
import { Config } from "../../config";

@Injectable()
export class SignupService {
    constructor(private http: Http) { }

    signup(signup: Signup) {
        return this.http.post(
            Config.apiUrl + "register",
            JSON.stringify({
                name: signup.name,
                email: signup.email,
                phone: signup.phone,
                password: signup.password,
                password_confirmation: signup.password_confirmation
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            catchError(this.handleErrors)
        );
    }

    getCommonHeaders() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", Config.authHeader);
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}