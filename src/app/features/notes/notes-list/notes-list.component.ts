import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, HostBinding,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {asap, debounceTime, delay, filter, take, tap} from "rxjs";
import {Note, NoteStates} from "../../../shared/models/note.model";
import {Store} from "@ngrx/store";
import {AppState, notesAnimation, notesSelector} from "../../../state/notes.state";
import {ResizeService} from "../../../shared/services/resize.service";
import {GridService, Layout} from "./services/grid.service";
import {NoteListItemComponent} from "./components/note-list-item/note-list-item.component";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResizeService, GridService],
})
export class NotesListComponent implements OnInit {
  public readonly noteStates = NoteStates;

  @ViewChildren("note") public notes!: QueryList<NoteListItemComponent>;

  public notes$ = this.store.select(notesSelector).pipe(
    filter(notes => notes.length > 0),
    tap(notes => setTimeout(() => {
      console.log("notes change");
      this.gridService.relayout(this.notes);
      this.layoutAnimation(this.gridService.layout, notes);
    })),
  );

  constructor(private ref: ElementRef,
              private cdr: ChangeDetectorRef,
              private resize$: ResizeService,
              private gridService: GridService,
              private store: Store<AppState>) {
  }

  public ngOnInit(): void {
    const gridSize$ = this.resize$.observe(this.ref.nativeElement);
    gridSize$.pipe(take(1))
      .subscribe(width => this.gridService.gridChanged(width));
    gridSize$.pipe(
      debounceTime(100),
      delay(50)
    ).subscribe(width => {
      this.gridService.gridChanged(width)
      // const heights = this.notes?.toArray().map(note => note.elem.getBoundingClientRect().height);
      // const layout = this.gridService.relayout(heights || []);
      // console.log(layout);
      this.layoutAnimation(this.gridService.layout, []);
    });
  }

  // maybe effect? for server loading??
  // only animation on visible elements
  public layoutAnimation(layout: Layout, notes: Note[]): void {
    const len = this.notes?.length || 0;
    const ids: number[] = [];
    for (let i = 0; i < len; i++) {
      const note = this.notes!.get(i);
      //if (this.notes?.get(i)?.loadingAnimation) {
      // anothe animation for when we manually add a note
      if (notes[i]?.loadedAnimation) {
        ids.push(i);
        console.log("ok");
        // this.notes!.get(i)!.loadingAnimation = false;
        // web animation i guess here and then callback
        const anim = this.notes!.get(i)!.elem.animate([
          {
            opacity: 0,
            transform: `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1] + 25}px)`,
          },
          {
            opacity: 1,
            transform: `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`,
          }
        ], {
          duration: 250,
          delay: i * 15,
          fill: "backwards",
        });
          anim.onfinish = () => {
            if (i + 1 === len) {
              this.store.dispatch(notesAnimation({ids}));
            }
            // this.notes!.get(i)!.elem.style.opacity = "1";
            this.notes!.get(i)!.elem.style.transitionDelay = `${i * 5}ms`;
          }

        // in callback set the transition prop in css
        // after that need to get rid of the serverLoading prop

        /*this.notes!.get(i)!.elem.style.transitionDelay = `0`;
        this.notes!.get(i)!.elem.style.opacity = "0";
        this.notes!.get(i)!.elem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1] + 15}px)`;
        this.cdr.detectChanges();
        // try
        this.notes!.get(i)!.elem.style.transition = "opacity 400ms ease-out, transform 0ms ease-out";
        this.notes!.get(i)!.elem.style.opacity = "1";
        this.notes!.get(i)!.elem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`;*/
      } else {
        //console.log("not ok");
        //console.log(notes[i]);
        //this.notes!.get(i)!.elem.style.transition = "transform 100ms ease-out";
        //this.notes!.get(i)!.elem.style.transitionDelay = `${i * 5}ms`;
        // this opacity should be set in anoyher place
        // or try to play with opacity: 1 in css and then just set the opacity to 0 in the animation
        this.notes!.get(i)!.elem.style.opacity = "1"; // try with this in comment: should move but the create note should not be created
        this.notes!.get(i)!.elem.style.transform = `translate(${layout[i][0] + this.gridService.pos}px, ${layout[i][1]}px)`;
      }
      // this.notes!.get(i)!.elem.style.opacity = "1";
    }
  }

  public id(index: number, el: Note): number {
    return el.id;
  }
}
