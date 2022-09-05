import {Component} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public selectedColor: ColorBubble | null = null;
}
