import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Color, ColorBubble, THEME_COLORS} from "../../shared/models/color.model";
import {AppState, loadNotes} from "../../state/notes.state";
import {Store} from "@ngrx/store";

const BUBBLE_FRAME_TIME = 85;

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  @ViewChildren("colorBubble") private bubbles!: QueryList<ElementRef>;
  public readonly colors = THEME_COLORS.reverse();
  public readonly animation = [
    {transform: "translateY(0)", easing: "ease-out"},
    ...THEME_COLORS.map((_, i) => ({
      transform: `translateY(${20 + (i + 1) * 36}px)`,
    })),
  ];

  public showColors = false;
  @Output() private bubbleClick = new EventEmitter<ColorBubble>();

  constructor(private store: Store<AppState>) {
  }

  public animateBubbles(show = true): void {
    const easing = show ? "ease-out" : 'ease-in';
    const animation = this.animation.map(anim => ({...anim, easing}));
    [...this.bubbles].reverse().forEach((bubble, i) => {
      bubble.nativeElement.animate(animation.slice(0, i + 2), {
        duration: BUBBLE_FRAME_TIME * (i + 1),
        delay: show ? 0 : BUBBLE_FRAME_TIME * (this.bubbles.length - i),
        fill: "forwards",
        direction: show ? "normal" : "reverse",
      });
    });
  }

  public bubbleClicked(color: Color, event: MouseEvent): void {
    this.bubbleClick.emit({color, event});
  }

  public more(): void {
    console.log("more");
    this.store.dispatch(loadNotes({from: 0, count: 10}));
  }
}
