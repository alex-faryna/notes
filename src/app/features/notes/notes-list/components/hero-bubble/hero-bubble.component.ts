import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Color} from "../../../../../shared/models/color.model";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-hero-bubble',
  templateUrl: './hero-bubble.component.html',
  styleUrls: ['./hero-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hero', [
      state('void', style({ background: "red" })),
      transition(':enter', [
        animate(1500, style({background: "{{color}}"}))
      ], {params: {color: "blue"}})
    ])
  ]
})
export class HeroBubbleComponent implements OnInit {
  @HostBinding('@hero') private get hero () {
    return {
      value: "hero",
      params: {
        color: this.color.color
      }
    }
  }
  @Input() public color!: Color;
  @Input() public from!: {x: number, y: number};
  @Input() public to!: {x: number, y: number};

  ngOnInit(): void {
    console.log(this.to);
  }
}
