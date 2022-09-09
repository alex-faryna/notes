import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Color} from "../../../../../shared/models/color.model";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-hero-bubble',
  template: '',
  styleUrls: ['./hero-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hero', [
      state('*', style({ visibility: "hidden" })),
      transition(':enter', [
        style({ background: "{{color}}", left: "{{x1}}px", top: "{{y1}}px", visibility: "visible" }),
        animate(250, style({background: "{{color}}", left: "{{x2}}px", top: "{{y2}}px"}))
      ], {params: {color: "#000000", x2: 0, y2: 0}})
    ])
  ]
})
export class HeroBubbleComponent {
  @HostBinding('@hero') private get hero () {
    return {
      value: "hero",
      params: {
        color: this.color.color,
        x1: this.from.x,
        y1: this.from.y,
        x2: this.to.x,
        y2: this.to.y,
      }
    }
  }
  @Input() public color!: Color;
  @Input() public from!: {x: number, y: number};
  @Input() public to!: {x: number, y: number};
}

// animation

/*@ViewChild("newNote") public newNoteRef!: ElementRef;
  //@ViewChild("hero") public heroRef!: ElementRef;
  @Input()
  public set newNote(value: ColorBubble | null) {
    // animate when we change the color too
    console.log(value);
    if (value) {
      const prevColumns = this.cols;
      // get prev columns
      // becuase animation occurs only after we add new elements or number of cols change
      this._newNote = (value as ColorBubble).color;
      this.updateGrid();
      this.cdr.detectChanges();
      const x = this.x + 10 + Math.floor((this.width - this.grid.clientWidth) / 2);
      this._newNoteState = NoteCreationState.ANIMATION;
      this.cdr.detectChanges();

      // maybe animation here flying
      // or maybe something like jumping??
      const {left, top} = (value.event.target as HTMLElement).getBoundingClientRect();
      const {y, width, height} = this.newNoteRef.nativeElement.getBoundingClientRect();
      const animation = this.heroRef.nativeElement.animate([
        {top, left},
        // make maybe weird shape
        //{ top: (top + y) / 2, left: (left + x) / 2, width: width / 2, height: height / 2,
         // borderRadius: '5px', padding: '10px'},
        {
          top: y, left: x, width: width - 10, height: height - 10,
          borderRadius: '5px', padding: '10px',
        },
      ], {
        duration: 250,
        fill: "both",
      });
      // do we really need this?
      animation.finished.then((res: any) => {

        // hack but we only need it if it is already in edit mode
        if (prevColumns === this.cols) {
          this._newNoteState = NoteCreationState.INPUT; // remove form here as it is not the place
          // after animation too i guess
          this.cdr.detectChanges();

          // feat(new note while editing this note bug)
          // actually when editing we need to cover it only if we don't have written anything there
          // if we have already type something then it must add as a new one
        }
        // works i guess :))
        //setTimeout(() => {
          // this.notesService.upd();
          //this._newNote = null;
          //this.cdr.detectChanges();
          // think about the logic when we add it and etcetera
         // console.log(res);
        //}, 1000);
      });
    }
  }*/
