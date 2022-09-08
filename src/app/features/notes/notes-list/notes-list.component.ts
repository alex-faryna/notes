import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, Subject} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {GridParams, NotesService} from "../../../shared/services/notes.service";
import {wrapGrid} from "animate-css-grid";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('notesList', [
      transition('* => *', [
        query(':enter .stale-note',
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
export class NotesListComponent implements OnInit, AfterViewInit {
  public readonly noteStates = NoteStates;
  @ViewChildren("grid") public gridRef!: QueryList<ElementRef>;

  @Input() set notes(value: Note[]) {
    this._notes = value ?? [];
    this.noteStorage.valueLength(value?.length || 0);
  }

  public _notes: Note[] = [];
  public gridOptions$: Subject<GridParams> = new Subject<GridParams>();

  private animate?: () => void;

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private noteStorage: NotesService) {
  }

  public ngOnInit(): void {
    rxsize(this.ref.nativeElement)
      // tweak
      .pipe(debounceTime(250)) //remove for some interesting real-time effects
      .subscribe(([val]) => this.noteStorage.gridResized(val.contentRect.width));

    // maybe remove later
    this.noteStorage.gridData$.subscribe(val => {
      this.gridOptions$.next(val);
      this.cdr.detectChanges();
    });

    this.noteStorage.gridData$.pipe(
      filter(() => !!this.animate),
      map(({cols}) => cols),
      distinctUntilChanged()
    ).subscribe(() => this.animate!());
  }

  public ngAfterViewInit(): void {
    this.gridRef.changes.subscribe(({first}) => {
      this.animate = wrapGrid(first.nativeElement, {
        duration: 250,
        stagger: 5,
      }).forceGridAnimation;
    });
  }

  public idFn(index: number, el: Note): number {
    return el.id;
  }
}
