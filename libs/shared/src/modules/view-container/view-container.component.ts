import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Inject
} from '@angular/core';
import { LogService } from '@cme2/logging';
import { ViewContainerContentDirective } from '@cme2/shared/src/modules/view-container/view-container-content.directive';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

import { PresentationMode, PresentationModeProvider } from '../../interfaces';
import { ViewContainerPaletteDirective } from './view-container-palette.directive';
import { DOCUMENT } from '@angular/common';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'cme-view-container',
  templateUrl: './view-container.component.html',
  styleUrls: ['./view-container.component.scss']
})
export class ViewContainerComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() public title = '';
  @Input()
  public set paletteVisible(value: boolean) {
    this._paletteVisible = value;
    if (this._paletteVisible) {
      this.paletteHeaderVisible = true;
    }
  }
  @Output() public readonly paletteVisibleChange = new EventEmitter<boolean>();
  @ContentChild(ViewContainerPaletteDirective) paletteChild: any;
  @ContentChild(ViewContainerContentDirective) contentChild: any;

  public get paletteVisible(): boolean {
    return this._paletteVisible;
  }

  private _destroyer$$ = new Subject<void>();
  private _paletteVisible = false;
  public paletteButtonVisible = true;
  public paletteHeaderVisible = false;

  public get isPaletteExisting() {
    return !!this.paletteChild;
  }

  public constructor(
    private presentationModeProvider: PresentationModeProvider,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private logger: LogService
  ) {}

  public onPaletteVisibleChange(visible: boolean): void {
    this.paletteVisibleChange.emit(visible);
    this.paletteVisible = visible;
  }

  public togglePalette(): any {
    this.paletteVisible = !this.paletteVisible;
  }

  public onPaletteButtonClick(): void {
    this.togglePalette();
  }

  public ngOnInit() {
    this.presentationModeProvider.presentationMode$.pipe(takeUntil(this._destroyer$$)).subscribe(mode => {
      if (mode === PresentationMode.On) {
        this.paletteVisible = false;
      }
      this.paletteButtonVisible = mode !== PresentationMode.On;
      this.cdr.detectChanges();
    });

    fromEvent(this.document, 'keyup')
      .pipe(takeUntil(this._destroyer$$), filter((key: any) => key.code === 'KeyE'))
      .subscribe(() => this.togglePalette());
  }

  onPaletteClosing(event: any) {
    this.paletteHeaderVisible = false;
  }

  ngAfterContentInit(): void {
    if (!this.paletteChild) {
      this.logger.debug(
        '[ViewContainerComponent] No palette provided, palette button hidden. Use cmeViewContainerPalette directive if you want a palette to show.'
      );
    }
    if (!this.contentChild) {
      this.logger.error(
        '',
        new Error(
          '[ViewContainerComponent] No content provided! Use cmeViewContainerContent directive to provide a content.'
        )
      );
    }
  }

  public ngOnDestroy() {
    this._destroyer$$.next();
  }
}
