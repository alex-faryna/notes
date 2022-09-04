import {Observable} from "rxjs";

export const rxsize = (elem: Element): Observable<ResizeObserverEntry[]> => {
  return new Observable(subscriber => {
    const ro = new ResizeObserver(entries => {
      subscriber.next(entries);
    });
    ro.observe(elem);
    return function unsubscribe() {
      ro.unobserve(elem);
    }
  });
}
