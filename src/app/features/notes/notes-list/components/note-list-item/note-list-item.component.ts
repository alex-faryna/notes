import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-note-list-item',
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteListItemComponent implements OnInit {

  @Input() public title = "";
  @Input() public content = "";
  @Input() public test? = "";
  @Input() public test2? = "";

  constructor() { }

  ngOnInit(): void {
  }

}
