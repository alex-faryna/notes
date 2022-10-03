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
    this.store.dispatch(loadNotes({from: false, count: 100}));
  }

  public addNote(bubble: ColorBubble): void {
    this.store.dispatch(addNote({bubble}));
    const color = bubble.color.color;
    const target = (bubble.event.target as HTMLElement).getBoundingClientRect();
    setTimeout(() => {
      const bubbleContainer = this.bubble!.nativeElement;
      const bubbleElement = this.bubble!.nativeElement.firstElementChild as HTMLElement;
      bubbleElement.style.background = color;
      bubbleElement.animate(this.getBubbleAniamtion(target.left, color), {duration: 400});
      bubbleContainer.animate(this.getBubbleContainerAnimation(target.top), {duration: 400});
    });
  }

  private getBubbleContainerAnimation(top: number): Keyframe[] {
    return [
      {
        transform: `translateY(${top}px)`,
        easing: "ease-out",
      },
      {
        transform: `translateY(25px)`,
        offset: 0.35,
        easing: "ease-in",
      },
      {
        transform: `translateY(110px)`,
      }
    ];
  }

  private getBubbleAniamtion(left: number, color: string): Keyframe[] {
    return [
      {
        opacity: 1,
        borderRadius: "50%",
        transform: `translateX(${left}px)`,
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
        aspectRatio: 2.5,
        opacity: 1,
      },
      {
        borderColor: color,
        borderRadius: "4px",
        width: "200px",
        aspectRatio: 3.3,
        transform: `translateX(${this.gridService.pos + 92 }px)`,
        opacity: 0.35,
      }
    ];
  }


}
