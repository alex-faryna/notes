import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../../shared/services/notes.service";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  public colsCount = 3;
  public notes$ = this.notesService.getNotesList();

  public get cols(): number[] {
    return [...Array(this.colsCount).keys()];
  }

  constructor(private notesService: NotesService) { }


  ngOnInit(): void {
  }

}
