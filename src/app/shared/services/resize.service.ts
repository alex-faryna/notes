import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, filter, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class ResizeService extends Observable<number> implements OnDestroy {
  private reloadTrigger = new BehaviorSubject<ResizeObserverEntry[]>([]);
  private resizeObserver: ResizeObserver;

  constructor() {
    super();
    Object.assign(this, this.reloadTrigger.asObservable().pipe(
      filter(val => !!val.length),
      map(([val]) => val.contentRect.width)
    ));
    this.resizeObserver = new ResizeObserver(entries =>
      this.reloadTrigger.next(entries));
    console.log(this);
  }

  public observe(elem: Element): ResizeService {
    this.resizeObserver.observe(elem);
    return this;
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
