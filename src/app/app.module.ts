import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NotesListModule} from "./features/notes/notes-list/notes-list.module";
import {MatIconModule} from "@angular/material/icon";
import {SideMenuModule} from "./features/side-menu/side-menu.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NotesListModule,
    MatIconModule,
    SideMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
