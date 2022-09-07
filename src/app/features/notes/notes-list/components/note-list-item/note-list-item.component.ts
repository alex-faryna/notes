import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {getContrastColor} from "../../../../../shared/models/color.model";

@Component({
  selector: 'app-note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
