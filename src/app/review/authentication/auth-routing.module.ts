import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";


const routes: Routes = [
    { path: "", component: SignupComponent },
    { path: "login", component: LoginComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class AuthRoutingModule { }
