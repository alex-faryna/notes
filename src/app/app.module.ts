import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {NotesListModule} from "./features/notes/notes-list/notes-list.module";
import {MatIconModule} from "@angular/material/icon";
import {SideMenuModule} from "./features/side-menu/side-menu.module";
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {NotesEffects, notesReducer} from "./state/notes.state";
import {EffectsModule} from "@ngrx/effects";
import {HttpClientModule} from "@angular/common/http";

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // console.log('state', state);
    console.log('action', action.type);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NotesListModule,
    MatIconModule,
    SideMenuModule,
    StoreModule.forRoot({notes: notesReducer}, { metaReducers }),
    EffectsModule.forRoot([NotesEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
