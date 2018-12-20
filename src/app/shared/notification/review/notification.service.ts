import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Notification } from "../review/notification.model";
import { Config } from "../../config";

@Injectable()
export class NotificationService {
    constructor(private http: Http) { }
    data={}
    notification(notification: Notification) {
        this.data = { "data": {
            "id" : notification.id,
            "title" : notification.title,
            "body"  : notification.body,
            "app"  : "user",
            "image"  : notification.image,
            "device"  : notification.authDeviceToken,
        },
        "to" : notification.deviceToken
    }

        return this.http.post(
            Config.fcmUrl,this.data,
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
        headers.append("Authorization", Config.fcmAuth);
        return headers;
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}