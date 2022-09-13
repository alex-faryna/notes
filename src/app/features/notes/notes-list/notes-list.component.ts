import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {combineLatest, debounceTime, tap} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {wrapGrid} from "animate-css-grid";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {AppState, colsSelector, notesSelector, posSelector, widthChanged} from "../../../state/notes.state";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('notesList', [
      transition('* => *', [
        query(':enter .note-view',
          [
            style({opacity: 0, paddingTop: '20px'}),
            stagger('75ms', animate('150ms linear'))
          ],
          {optional: true}
        ),
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {
  public readonly noteStates = NoteStates;
  @ViewChild("grid", {static: true}) public gridRef!: ElementRef;

  public notes: Note[] = [];
  public pos = 0;
  public cols = 1;

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    const animate = wrapGrid(this.gridRef.nativeElement, {
      duration: 250,
      stagger: 5,
    }).forceGridAnimation;

    rxsize(this.ref.nativeElement)
      // tweak //remove for some interesting real-time effects
      .pipe(debounceTime(250))
      .subscribe(([val]) => {
        this.store.dispatch(widthChanged({width: val.contentRect.width}));
      });

    this.store.select(colsSelector).subscribe(val => {
      this.cols = val;
      this.cdr.detectChanges();
    });

    this.store.select(posSelector).subscribe(val => {
      this.pos = val;
      this.cdr.detectChanges();
    });

    combineLatest([
      this.store.select(colsSelector),
      this.store.select(notesSelector).pipe(tap(val => this.notes = val))
    ]).subscribe(() => {
      this.cdr.detectChanges();
      animate();
    });
  }

  public id(index: number, el: Note): number {
    return el.id;
  }
}
