import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Config } from "../config";
import { Products } from "./products.model";

@Injectable()
export class ProductsService {
    baseUrl = Config.apiUrl + "products";
   
    constructor(private http: Http) { }

    load() {
        // Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
       // console.log(this.baseUrl)
        return this.http.get(this.baseUrl).pipe(
            map(res => res.json()),
            map(data => {
                let productList = [];
                data.forEach((product) => {
                    productList.push(new Products(
                        product.id, 
                        product.name, 
                        product.price, 
                        product.owner,
                        product.type, 
                        product.description, 
                        product.category, 
                        product.location,
                        product.status,
                        product.image, 
                        product.created_at,
                        product.updated_at, 
                        ));
                });
                return productList;
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