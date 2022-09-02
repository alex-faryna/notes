import {
  AfterViewChecked,
  Directive,
  ElementRef, Host,
  Input,
  NgZone,
  OnChanges, Optional, SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {NgSwitch} from "@angular/common";

@Directive({
  selector: '[notesContainer]'
})
export class NotesContainer {

  constructor() {
    console.log("??");
  }

  cool(): void {
    console.log("cool method");
  }
}

@Directive({
  selector: '[notesColumn]'
})
export class NotesColumn {

  @Input() notesColumn: number = 1;

  constructor(private view: ViewContainerRef,
              private template: TemplateRef<any>,
              @Optional() @Host() notesContainer: NotesContainer) {
    console.log("ok");
    console.log(notesContainer);
    notesContainer.cool();
  }
}

@Directive({
  selector: '[notesFor][notesForOf]'
})
export class NotesFor implements OnChanges {

  @Input() notesForIdx!: number;
  @Input() notesForOf!: any[];

  constructor(private view: ViewContainerRef,
              private template: TemplateRef<any>) {
  }


  public ngOnChanges(changes: SimpleChanges) {
    if (this.isValue(changes['notesForIdx'].currentValue) && this.isValue(changes['notesForOf'].currentValue)) {
      this.view.clear();
      const col = this.view.element.nativeElement.parentElement;
      this.notesForOf.forEach((item, index) => {
        this.view.createEmbeddedView(this.template, {$implicit: item, index}).detectChanges();
      });
    }
  }

  private isValue(val: unknown): boolean {
    return val !== null && val !== undefined;
  }
}
