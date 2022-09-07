import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {getContrastColor} from "../../../../../shared/models/color.model";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  /*animations: [
    trigger('animate', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('250ms', style({ opacity: 1, transform: 'translateX(0px)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('250ms', style({ opacity: 0, transform: 'translateX(10px)' }))
      ])
    ])
  ],*/
})
export class NoteListItemComponent {
  @Input() public title = "";
  @Input() public content = "";
  @Input() public test? = "";
  @Input() public test2? = "";
  @Input() public set color(val: string | undefined) {
    this._color = val ? val : this._color;
    this.textColor = getContrastColor(this._color);
  };

  public _color = "#424242";
  public textColor = "#ffffff";
}
