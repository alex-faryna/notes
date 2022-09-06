import {Component, Input, OnInit} from '@angular/core';
import {ColorBubble} from "../../../../../shared/models/color.model";

@Component({
  selector: 'app-hero-bubble',
  templateUrl: './hero-bubble.component.html',
  styleUrls: ['./hero-bubble.component.scss']
})
export class HeroBubbleComponent implements OnInit {

  @Input() public from!: ColorBubble;

  constructor() { }

  ngOnInit(): void {
  }

}
