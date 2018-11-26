import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpModule } from '@angular/http';
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryComponent } from "../category/category.component";
import { NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptUISideDrawerModule,  } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular";
import { GridViewModule } from 'nativescript-grid-view/angular';
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";



@NgModule({
    bootstrap: [
        CategoryComponent
    ],
    imports: [
        CategoryRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIGaugeModule,
        NativeScriptCommonModule,
        GridViewModule
    ],
    declarations: [
        CategoryComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class CategoryModule { }
