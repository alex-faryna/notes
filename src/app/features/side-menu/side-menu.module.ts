import {NgModule} from '@angular/core';
import {SideMenuComponent} from "./side-menu.component";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  exports: [
    SideMenuComponent
  ]
})
export class SideMenuModule { }
