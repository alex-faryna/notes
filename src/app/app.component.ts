import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {ColorBubble} from "./shared/models/color.model";
import {Store} from "@ngrx/store";
import {addNote, AppState, loadNotes} from "./state/notes.state";
import {GridService} from "./features/notes/notes-list/services/grid.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GridService],
})
export class AppComponent {
  @ViewChild("bubble") private bubble?: ElementRef<HTMLElement>;

  constructor(private store: Store<AppState>, private gridService: GridService) {
    this.store.dispatch(loadNotes({from: 0, count: 10}));
  }

  public addNote(bubble: ColorBubble): void {
    this.store.dispatch(addNote({bubble}));

    const target = (bubble.event.target as HTMLElement).getBoundingClientRect();

    setTimeout(() => {
      const bubbleContainer = this.bubble!.nativeElement;
      const bubbleElement = this.bubble!.nativeElement.firstElementChild as HTMLElement;
      const duration = 400 * 1;
      bubbleContainer.animate([
        {
          transform: `translateY(${target.top}px)`,
          easing: "ease-out",
        },
        {
          transform: `translateY(${25 + (this.gridService.cols > 1 ? 0 : 0 /* 0 */)}px)`,
          offset: 0.35,
          easing: "ease-in",
        },
        {
          transform: `translateY(${110}px)`,
        }
      ], {duration});

      bubbleElement.style.background = bubble.color.color;
      console.log(this.gridService.cols);
      bubbleElement.animate([
        {
          opacity: 1,
          borderRadius: "50%",
          transform: `translateX(${target.left}px)`,
          easing: "ease-in-out",
        },
        {
          borderRadius: "35%",
          offset: 0.65,
          width: "50px",
          aspectRatio: 1.3,
        },
        {
          borderRadius: "6px",
          offset: 0.75,
          width: "75px",
          aspectRatio: 1.85,
          opacity: 1,
        },
        {
          borderColor: bubble.color.color,
          borderRadius: "4px",
          width: "200px",
          aspectRatio: 2.5,
          transform: `translateX(${this.gridService.pos + 72 + 20 /* +(this.gridService.cols > 1 ? 35 : 125) */ }px)`,
          opacity: 0.35,
        }
      ], {duration});
    });
  }
}
