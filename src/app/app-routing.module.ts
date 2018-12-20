import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { CategoryComponent } from "./categories/category/category.component";



const routes: Routes = [
    { path: "", redirectTo: "/welcome", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "welcome", loadChildren: "~/app/welcome/home/home.module#HomeModule" },
    { path: "products", loadChildren: "~/app/products/products.module#ProductsModule" },
    { path: "services", loadChildren: "~/app/services/services.module#ServicesModule" },
    { path: "categories", loadChildren: "~/app/categories/categories.module#CategoriesModule" },
    { path: "category/:name", loadChildren: "~/app/categories//category/category.module#CategoryModule" },
    { path: "search/:name", loadChildren: "~/app/search/search.module#SearchModule" },
    { path: "signup", loadChildren: "~/app/authentication/signup/signup.module#SignupModule" },
    { path: "change-password", loadChildren: "~/app/password/change/change.module#ChangeModule" },
    { path: "edit-profile", loadChildren: "~/app/profile/edit/edit.module#EditModule" },
    { path: "RequestRegister", loadChildren: "~/app/request/authentication/signup/signup.module#SignupModule" },
    { path: "login", loadChildren: "~/app/authentication/login/login.module#LoginModule" },
    { path: "request-status", loadChildren: "~/app/requests/status/status.module#StatusModule" },
    { path: "RequestLogin", loadChildren: "~/app/request/authentication/login/login.module#LoginModule" },
    { path: "requests", loadChildren: "~/app/requests/requests.module#RequestsModule" },
    { path: "reviews", loadChildren: "~/app/reviews/reviews.module#ReviewsModule" },
    { path: "request", loadChildren: "~/app/request/request.module#RequestModule" },
    { path: "review", loadChildren: "~/app/review/review.module#ReviewModule" },
    { path: "AuthRequest", loadChildren: "~/app/request/authentication/request/request.module#RequestModule" },
];


@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
