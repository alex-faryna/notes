import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, NgZone, OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {NotesService} from "../../../shared/services/notes.service";
import {NoteListItemComponent} from "./note-list-item/note-list-item.component";
import {Note} from "../../../shared/models/note.model";
import {BehaviorSubject, debounceTime, delay, skip, startWith, Subject} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";

const OFFSET = 35;

enum InsertMode {
  right,
  bottom,
  done
}

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesListComponent implements OnInit, AfterViewInit {
  @ViewChildren('noteCard') private notesCards!: QueryList<NoteListItemComponent>;

  public colsCount = 3;
  public notes$ = this.notesService.getNotesList();
  public get cols(): number[] {
    return [...Array(this.colsCount).keys()];
  }

  private availableSpots: number[][] = [];

  // test
  public data: Note[][] = [];
  // ngFor col of data
  // ngFor note of col - already sorted out


  // 1st variant: have width, have n cols, insert the components into the columns -
  // drawback -have to init components here which i don't really want

  // 2nd variant: thinking
  // just thinking: mb create own ngFor with the heights?

  // 3d variant:
  // we have a stream, and each new value goes to the process of sleecting which column to use
  // so we add new value, the stream adds new to the dom but burh wtf
  // (i mean we have a new value, then the dom needs to inset it so i checks before adding this concrete value

  // flex
  // cols min 200pc max 250px flex 1 0 auto - for columns


  // maybe something like a directive which you give to 3 divs (columns) and it keeps a shared state,
  // so when we add a val, the other two know i has added
  // or at least so it can keep the top heights for everyone so they know
  // something similar to open mpi, where you have data [5,6,7] and each col has access to all data, so the first one know it has id 1, and his value is 5, the smaller one so he inserts
  // it means they know others know

  // ngfor with shared state or smth

  // ngfor performance bor please

  constructor(private notesService: NotesService,
              private cdr: ChangeDetectorRef,
              private ref: ElementRef) {
  }

  public ngOnInit(): void {
    rxsize(this.ref.nativeElement)
      .pipe(skip(1), debounceTime(75))
      //.subscribe(() => this.updateView());
  }

  public ngAfterViewInit(): void {
    this.notesCards.changes
      .pipe(startWith(this.notesCards))
      //.subscribe(() => this.updateView());
  }

  public trackByMethod(index: number, el: Note): number {
    return el.id;
  }

  private updateView(): void {
    console.log("update view");
    let firstRow = true;
    const notesContainerWidth = this.ref.nativeElement.clientWidth;
    for (let note of this.ref.nativeElement.children) {
      if (this.availableSpots.length === 0) {
        this.availableSpots = [[note.clientWidth, 0], [0, note.clientHeight]];
        continue;
      }

      const baseY = this.availableSpots[0][1];
      const baseSpots: number[][] = [];
      for (const spot of this.availableSpots) {
        if (spot[1] > baseY + OFFSET) {
          break;
        }
        baseSpots.push(spot);
      }

      const spot = baseSpots.reduce((prev, curr) =>
        prev[0] < curr[0] ? prev : curr);

      const left = spot[0];
      const top = spot[1];
      note.style.left = `${left}px`;
      note.style.top = `${top}px`;

      let idx = 0;
      for (const [i, temp] of this.availableSpots.entries()) {
        if (temp[0] === spot[0] && temp[1] === spot[1]) {
          idx = i;
          break;
        }
      }
      this.availableSpots.splice(idx, 1);

      const noteWidth = note.clientWidth;
      const rightSpot = [left + noteWidth, top];
      const bottomSpot = [left, top + note.clientHeight];
      const noteRightSide = noteWidth + left;

      if (firstRow && noteRightSide + noteWidth > notesContainerWidth) {
        firstRow = false;
      }

      let insertMode = firstRow
        ? InsertMode.right
        : InsertMode.bottom;
      for (const [i, temp] of this.availableSpots.entries()) {
        if (insertMode === InsertMode.right) {
          if (rightSpot[1] < temp[1]) {
            this.availableSpots.splice(i, 0, rightSpot);
            insertMode = InsertMode.bottom;
          } else if (rightSpot[1] === temp[1] && rightSpot[0] <= temp[0]) {
            this.availableSpots.splice(i, 0, rightSpot);
            insertMode = InsertMode.bottom;
          }
        } else if (insertMode === InsertMode.bottom) {
          if (bottomSpot[1] < temp[1]) {
            this.availableSpots.splice(i, 0, bottomSpot);
            insertMode = InsertMode.done;
          } else if (bottomSpot[1] === temp[1] && bottomSpot[0] <= temp[0]) {
            this.availableSpots.splice(i, 0, bottomSpot);
            insertMode = InsertMode.done;
          }
        }
      }
      if (insertMode === InsertMode.right) {
        this.availableSpots.push(rightSpot, bottomSpot);
      } else if(insertMode === InsertMode.bottom) {
        this.availableSpots.push(bottomSpot);
      }
    }
    this.cdr.markForCheck();
    this.availableSpots = [];
  }
}
