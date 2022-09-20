import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit, QueryList,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {combineLatest, debounceTime, tap} from "rxjs";
import {rxsize} from "../../../shared/utils/rxsizable.utils";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {wrapGrid} from "animate-css-grid";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {Store} from "@ngrx/store";
import {AppState, maxColsSelector, notesSelector, posSelector, widthChanged} from "../../../state/notes.state";
import {ResizeService} from "../../../shared/services/resize.service";
import {GridService} from "./services/grid.service";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";


// appear animation not working
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizeService, GridService],
})
export class NotesListComponent implements OnInit {
  public readonly noteStates = NoteStates;
  /*@ViewChild("grid", {static: true}) public gridRef!: ElementRef;
  public loaded = false;
  public notes: Note[] = [];
  public pos = 0;
  public cols = 1;*/

  @ViewChildren("note") public notes?: QueryList<NoteListItemComponent>;

  public notes$ = this.store.select(notesSelector).pipe(
    tap(() => setTimeout(() => {
      const heights = this.notes?.toArray().map(note => note.elem.clientHeight);
      //this.gridService.relayout(heights || []);
      this.layoutAnimation(this.gridService.layout);
    })),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private resize$: ResizeService,
              private gridService: GridService,
              private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.gridService.appendLayout([100, 20, 30, 40, 50]);
    }, 14000);
    // first time layout calculating goes without animation and without debounce (after view init)
    this.resize$.observe(this.ref.nativeElement)
      .pipe(debounceTime(250))
      .subscribe(width => {
        this.gridService.gridChanged(width);
        // const heights = this.notes?.toArray().map(note => note.elem.getBoundingClientRect().height);
        // const layout = this.gridService.relayout(heights || []);
        // console.log(layout);
        this.layoutAnimation(this.gridService.layout)
      });

    // this.gridService.gridChanged()
    /*const animate = wrapGrid(this.gridRef.nativeElement, {
      duration: 250,
      stagger: 5,
    }).forceGridAnimation;*/

    /*rxsize(this.ref.nativeElement)
      // tweak //remove for some interesting real-time effects
      .pipe(debounceTime(250))
      .subscribe(([val]) => {
        this.store.dispatch(widthChanged({width: val.contentRect.width}));
      });

    this.store.select(maxColsSelector).subscribe(val => {
      this.cols = val;
      this.cdr.detectChanges();
    });

    this.store.select(posSelector).subscribe(val => {
      if (this.pos && !this.loaded) {
        this.loaded = true;
      }
      this.pos = val;
      this.cdr.detectChanges();
    });

    combineLatest([
      this.store.select(maxColsSelector),
      this.store.select(notesSelector).pipe(tap(val => this.notes = val))
    ]).subscribe(() => {
      this.cdr.detectChanges();
      // animate();
    });*/
  }

  // only animation on visible elements
  public layoutAnimation(layout: [number, number][]): void {
    this.notes?.toArray().map(note => note.elem).forEach((elem: HTMLElement, i) => {
      elem.style.transitionDelay = `${i * 5}ms`;
      elem.style.transform = `translate(${layout[i][0]}px, ${layout[i][1]}px)`;
    });
    this.ref.nativeElement.style.transform = `translate(${this.gridService.pos}px, 0)`;
  }

  public id(index: number, el: Note): number {
    return el.id;
  }
}
