import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

interface Coordinates {
  x: number;
  y: number;
}

const DOMAIN_MODEL_GRID_SIZE = 20;

@Directive({
  selector: '[cmeDomainModelDragAndDrop]'
})
export class DomainModelDragAndDropDirective implements AfterViewInit, OnChanges {
  @Input() positionX = 0;
  @Input() positionY = 0;
  @Input() gridSize = DOMAIN_MODEL_GRID_SIZE;
  @Input() zIndex = 0;

  @Output() positionChanged = new EventEmitter<Coordinates>();
  @Output() dragAndDropStart = new EventEmitter<undefined>();
  @Output() dragAndDropEnd = new EventEmitter<undefined>();

  private initialCoordinates: Coordinates = { x: 0, y: 0 };
  private moveStartCoordinates: Coordinates = { x: 0, y: 0 };
  private moveCurrentCoordinates: Coordinates = { x: 0, y: 0 };

  private dragAndDropInProgress = false;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (this.dragAndDropInProgress === false) {
      this.dragAndDropStart.emit();

      this.moveStartCoordinates.x = event.clientX;
      this.moveStartCoordinates.y = event.clientY;
      this.moveCurrentCoordinates = { x: 0, y: 0 };

      this.elementRef.nativeElement.style.zIndex = '10000000000';
      this.elementRef.nativeElement.setPointerCapture(event.pointerId);

      this.dragAndDropInProgress = true;
    }
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (event.buttons === 1 && this.dragAndDropInProgress) {
      this.moveCurrentCoordinates.x = event.clientX - this.moveStartCoordinates.x;
      this.moveCurrentCoordinates.y = event.clientY - this.moveStartCoordinates.y;

      this.elementRef.nativeElement.style.transform = `translate3d(${this.moveCurrentCoordinates.x}px, ${
        this.moveCurrentCoordinates.y
      }px, 0)`;
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    if (this.dragAndDropInProgress === true) {
      let tempX = this.initialCoordinates.x + this.moveCurrentCoordinates.x;
      let tempY = this.initialCoordinates.y + this.moveCurrentCoordinates.y;

      tempX = this.calulateGridCoord(tempX);
      tempY = this.calulateGridCoord(tempY);

      if (tempX !== this.initialCoordinates.x || tempY !== this.initialCoordinates.y) {
        this.initialCoordinates.x = tempX;
        this.initialCoordinates.y = tempY;
        this.setCoordinatesOnElement(this.initialCoordinates.x, this.initialCoordinates.y);
        this.positionChanged.emit(this.initialCoordinates);
      }

      this.elementRef.nativeElement.style.transform = '';
      this.elementRef.nativeElement.style.zIndex = this.zIndex;
      this.elementRef.nativeElement.releasePointerCapture(event.pointerId);

      this.dragAndDropInProgress = false;

      this.dragAndDropEnd.emit();
    }
  }

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.positionX && changes.positionX.currentValue) {
      this.positionX = changes.positionX.currentValue;
      this.initialCoordinates.x = this.positionX;
    }

    if (changes.positionY && changes.positionY.currentValue) {
      this.positionY = changes.positionY.currentValue;
      this.initialCoordinates.y = this.positionY;
    }

    if (changes.positionX || changes.positionY) {
      this.setCoordinatesOnElement(this.initialCoordinates.x, this.initialCoordinates.y);
    }

    if (changes.zIndex) {
      this.elementRef.nativeElement.style.zIndex = this.zIndex;
    }
  }

  ngAfterViewInit(): void {
    this.setCoordinatesOnElement(this.positionX, this.positionY);
  }

  private setCoordinatesOnElement(x: number, y: number) {
    this.elementRef.nativeElement.style.left = x + 'px';
    this.elementRef.nativeElement.style.top = y + 'px';
  }

  private calulateGridCoord(coord: number): number {
    const rest = coord % this.gridSize;
    if (rest > this.gridSize / 2) {
      coord = coord + (this.gridSize - rest);
    } else {
      coord = coord - rest;
    }
    return coord;
  }
}
