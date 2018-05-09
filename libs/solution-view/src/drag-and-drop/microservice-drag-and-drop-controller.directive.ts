import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { filter, throttleTime } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { DragAndDropService } from './microservice-drag-and-drop.service';
import {
  DRAG_AND_DROP_KEY,
  DRAG_AND_DROP_PHASE,
  MICROSERVICE_DRAG_AND_DROP,
  USE_PLACEHOLDER_ON_DRAGOVER
} from './shared';

export interface DragAndDropEvent {
  targetPhase: string;
  targetKey: string;
  droppedKey: string;
}

const DRAG_IN_PROGRESS_CLASSNAME = 'drag-in-progress';
const DRAG_AND_DROP_PLACEHOLDER_CLASSNAME = 'drag-and-drop-placeholder';

@Directive({
  selector: '[cmeMicroserviceDragAndDropController]'
})
export class MicroserviceDragAndDropControllerDirective {
  private _draggedElement: HTMLElement | undefined;
  private _currentTarget: HTMLElement | undefined;
  private _clone: HTMLElement | undefined;
  private _heightThreshold = 0;
  private _dragover$$: Subject<Event> = new Subject<Event>();
  private _droppedBeforeEvent: DragAndDropEvent | undefined;
  private _droppedAfterEvent: DragAndDropEvent | undefined;

  @Output() droppedBefore = new EventEmitter<DragAndDropEvent>();
  @Output() droppedAfter = new EventEmitter<DragAndDropEvent>();

  @HostListener('dragenter', ['$event'])
  onDragenter(event: DragEvent) {
    const target = event.target as HTMLElement;

    if (target === this._draggedElement) {
      if (this._clone && this._clone.parentElement) {
        this.renderer.removeChild(this._clone.parentElement, this._clone);
      }
      return;
    }

    if (this.hasMicroserviceDragAndDropAttribute(target) === false) {
      return;
    }

    if (this.usePlaceholderOnDragover(target) === false) {
      target.classList.add(DRAG_AND_DROP_PLACEHOLDER_CLASSNAME);
      if (this._clone && this._clone.parentElement) {
        this.renderer.removeChild(this._clone.parentElement, this._clone);
      }
      this.prepareDroppedBeforeEvent(target, this._draggedElement as HTMLElement);
      event.preventDefault();
      return;
    }

    event.preventDefault();

    this._currentTarget = target;
    this._heightThreshold = this._currentTarget.offsetHeight / 2;
  }

  @HostListener('dragover', ['$event'])
  onDragover(event: DragEvent) {
    const target = event.target as HTMLElement;

    if (this.hasMicroserviceDragAndDropAttribute(target) === false) {
      return;
    }

    if (event.target === this._clone) {
      event.preventDefault();
      return;
    }

    if (this.usePlaceholderOnDragover(target) === false) {
      event.preventDefault();
      return;
    }

    this._dragover$$.next(event);
  }

  @HostListener('dragleave', ['$event'])
  onDragleave(event: DragEvent) {
    const target = event.target as HTMLElement;

    if (this.usePlaceholderOnDragover(target) === false) {
      target.classList.remove(DRAG_AND_DROP_PLACEHOLDER_CLASSNAME);
    }

    this._currentTarget = undefined;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (this._droppedBeforeEvent) {
      this.droppedBefore.emit(this._droppedBeforeEvent);
      this._droppedBeforeEvent = undefined;
      this._droppedAfterEvent = undefined;
    }

    if (this._droppedAfterEvent) {
      this.droppedAfter.emit(this._droppedAfterEvent);
      this._droppedAfterEvent = undefined;
      this._droppedBeforeEvent = undefined;
    }

    if (this._clone && this._clone.parentElement) {
      this.renderer.removeChild(this._clone.parentElement, this._clone);
    }
  }

  constructor(
    private dragAndDropService: DragAndDropService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.dragAndDropService.dragstart$.subscribe(element => {
      this._draggedElement = element;
      this._draggedElement.classList.add(DRAG_IN_PROGRESS_CLASSNAME);

      this._clone = this._draggedElement.cloneNode(true) as HTMLElement;
      this._clone.innerHTML = '';
      this._clone.classList.add(DRAG_AND_DROP_PLACEHOLDER_CLASSNAME);
    });

    this.dragAndDropService.dragend$.subscribe(() => {
      if (this._draggedElement) {
        this._draggedElement.classList.remove(DRAG_IN_PROGRESS_CLASSNAME);
        this._draggedElement = undefined;
      }

      if (this._clone) {
        this.renderer.removeChild(this._clone.parentElement, this._clone);
        this._clone = undefined;
      }
    });

    this._dragover$$
      .pipe(
        throttleTime(200),
        filter(event => event.target !== this._draggedElement),
        filter(event => this.hasMicroserviceDragAndDropAttribute(event.target as HTMLElement))
      )
      .subscribe(event => {
        const y = (event as any).layerY; // TS def of UIEvent does not contain layerY
        const target = event.target as HTMLElement;

        if (y < this._heightThreshold) {
          if (target.previousElementSibling === this._draggedElement) {
            this.renderer.removeChild(target.parentElement, this._clone);
          } else {
            event.preventDefault();
            this.renderer.insertBefore(target.parentElement, this._clone, target);
            this.prepareDroppedBeforeEvent(target, this._clone!);
          }
        } else {
          if (target.nextElementSibling) {
            if (target.nextElementSibling === this._draggedElement) {
              this.renderer.removeChild(target.parentElement, this._clone);
            } else {
              event.preventDefault();
              this.renderer.insertBefore(target.parentElement, this._clone, target.nextElementSibling);
              this.prepareDroppedAfterEvent(target, this._clone!);
            }
          } else {
            if (target === this._draggedElement) {
              this.renderer.removeChild(target.parentElement, this._clone);
            } else {
              event.preventDefault();
              this.renderer.appendChild(target.parentElement, this._clone);
              this.prepareDroppedAfterEvent(target, this._clone!);
            }
          }
        }
      });
  }

  private prepareDroppedBeforeEvent(targetElement: HTMLElement, droppedElement: HTMLElement) {
    this._droppedAfterEvent = undefined;
    this._droppedBeforeEvent = this.buildEventObject(targetElement, droppedElement);
  }

  private prepareDroppedAfterEvent(targetElement: HTMLElement, droppedElement: HTMLElement) {
    this._droppedBeforeEvent = undefined;
    this._droppedAfterEvent = this.buildEventObject(targetElement, droppedElement);
  }

  private buildEventObject(targetElement: HTMLElement, droppedElement: HTMLElement) {
    const targetPhase = targetElement.getAttribute(DRAG_AND_DROP_PHASE);
    const targetKey = targetElement.getAttribute(DRAG_AND_DROP_KEY);
    const droppedKey = droppedElement.getAttribute(DRAG_AND_DROP_KEY);

    return {
      targetPhase: targetPhase ? targetPhase : '',
      targetKey: targetKey ? targetKey : '',
      droppedKey: droppedKey ? droppedKey : ''
    };
  }

  private hasMicroserviceDragAndDropAttribute(element: HTMLElement): boolean {
    const attr = element.getAttribute(MICROSERVICE_DRAG_AND_DROP);
    return attr === 'true';
  }

  private usePlaceholderOnDragover(element: HTMLElement): boolean {
    const attr = element.getAttribute(USE_PLACEHOLDER_ON_DRAGOVER);
    return attr === 'true';
  }
}
