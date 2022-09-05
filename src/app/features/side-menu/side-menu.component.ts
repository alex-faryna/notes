import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {THEME_COLORS} from "../../shared/models/color.model";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";

export const showBubble = trigger('showBubble', [
  transition(':enter', [
    style({top: 0}),
    animate("500ms ease-out")
// keyframes([
//       style({top: "90px"}),
//     ])),
  ]) //{params: {idx: "0"}}
]);

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [showBubble],
})
export class SideMenuComponent {
  public readonly colors = THEME_COLORS;
  public showColors = false;

  constructor(private cdr: ChangeDetectorRef) {
  }
}
