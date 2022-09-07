import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Color} from "../../../../../shared/models/color.model";


// angular animation flying here
@Component({
  selector: 'app-hero-bubble',
  templateUrl: './hero-bubble.component.html',
  styleUrls: ['./hero-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBubbleComponent implements OnInit {
  @Input() public color!: Color;
  @Input() public from!: {x: number, y: number};
  @Input() public to!: {x: number, y: number};

  ngOnInit(): void {
    console.log(this.to);
  }
}
