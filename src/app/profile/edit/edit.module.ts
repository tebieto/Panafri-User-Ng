import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HttpModule } from '@angular/http';
import { EditRoutingModule } from "./edit-routing.module";
import { EditComponent } from "../edit/edit.component";
import { NativeScriptUISideDrawerModule,  } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular";
import { GridViewModule } from 'nativescript-grid-view/angular';
import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";



@NgModule({
    bootstrap: [
        EditComponent
    ],
    imports: [
        EditRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptUIGaugeModule,
        NativeScriptCommonModule,
        GridViewModule,
        NativeScriptFormsModule
    ],
    declarations: [
        EditComponent,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class EditModule { }
