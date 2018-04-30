import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PresentationModeProvider, PresentationMode } from '@cme2/shared';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cme-main-area',
  templateUrl: './main-area.component.html',
  styleUrls: ['./main-area.component.scss']
})
export class MainAreaComponent implements OnInit, OnDestroy {
  @Input() public navigationVisible = false;
  @Output() public readonly navigationVisibleChange = new EventEmitter<boolean>();
  public navigationButtonIcon: 'menu' | 'clear' = 'menu';
  public navigationButtonVisible = true;
  private subscription = Subscription.EMPTY;

  public constructor(private presentationModeProvider: PresentationModeProvider, private cdr: ChangeDetectorRef) {}

  public onOpenedChange(opened: boolean): void {
    this.navigationVisibleChange.emit(opened);
    this.updateNavigationButtonIcon(opened);
  }

  public onEntrySelected(): void {
    this.toggleNavigation();
  }

  public toggleNavigation(): void {
    this.navigationVisible = !this.navigationVisible;
    this.updateNavigationButtonIcon(this.navigationVisible); // immediately change button label
  }

  public updateNavigationButtonIcon(navigationVisible: boolean): void {
    this.navigationButtonIcon = navigationVisible ? 'clear' : 'menu';
  }

  public ngOnInit(): void {
    this.subscription = this.presentationModeProvider.presentationMode$.subscribe(mode => {
      if (mode === PresentationMode.On) {
        this.navigationVisible = false;
      }
      this.navigationButtonVisible = mode !== PresentationMode.On;
      this.cdr.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription = Subscription.EMPTY;
  }
}
