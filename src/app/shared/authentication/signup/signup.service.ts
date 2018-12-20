import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Signup } from "./signup.model";
import { Config } from "../../config";

@Injectable()
export class SignupService {
    token=""
    constructor(private http: Http) { }

    signup(signup: Signup) {
        return this.http.post(
            Config.apiUrl + "register",
            JSON.stringify({
                name: signup.name,
                email: signup.email,
                phone: signup.phone,
                password: signup.password,
                password_confirmation: signup.password_confirmation,
                deviceToken: signup.deviceToken
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            map(data => {return data}),
            catchError(this.handleErrors)
        );
    }

    edit(signup: Signup) {
        
        this.token = "Bearer" + signup.token
        console.log(signup)
        let headers = new Headers({ "Authorization": this.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            Config.apiUrl + "edit/user",
            JSON.stringify({
                name: signup.name,
                email: signup.email,
                phone: signup.phone,
                avatar: signup.avatar,
            }),
            { headers: this.getCommonHeaders() }
        ).pipe(
            map(response => response.json()),
            map(data => {return data}),
            catchError(this.handleErrors)
        );
    }

    change(signup: Signup) {
        
        this.token = "Bearer" + signup.token
         console.log(this.token)

        let headers = new Headers({ "Authorization": this.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            Config.apiUrl + "change/password",
            JSON.stringify({
                password: signup.password,
                password_confirmation: signup.password_confirmation,
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
        headers.append("Authorization", this.token);
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}