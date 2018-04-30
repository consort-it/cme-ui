import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { LogService } from '@cme2/logging';
import { ViewContainerContentDirective } from '@cme2/shared/src/modules/view-container/view-container-content.directive';
import { Subscription } from 'rxjs/Subscription';

import { PresentationMode, PresentationModeProvider } from '../../interfaces';
import { ViewContainerPaletteDirective } from './view-container-palette.directive';

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

  private _paletteVisible = false;
  private subscription = Subscription.EMPTY;
  public paletteButtonVisible = true;
  public paletteHeaderVisible = false;

  public get isPaletteExisting() {
    return !!this.paletteChild;
  }

  public constructor(
    private presentationModeProvider: PresentationModeProvider,
    private cdr: ChangeDetectorRef,
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
    this.subscription = this.presentationModeProvider.presentationMode$.subscribe(mode => {
      if (mode === PresentationMode.On) {
        this.paletteVisible = false;
      }
      this.paletteButtonVisible = mode !== PresentationMode.On;
      this.cdr.detectChanges();
    });
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
    this.subscription.unsubscribe();
    this.subscription = Subscription.EMPTY;
  }
}
