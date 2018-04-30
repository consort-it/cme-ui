import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { PresentationModeProvider, PresentationMode } from '@cme2/shared';
import { combineLatest, filter, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { pageDuration } from '../shared';

@Component({
  selector: 'cme-presentation-progress-bar',
  templateUrl: './presentation-progress-bar.component.html',
  styleUrls: ['./presentation-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fillAnimation', [
      transition('* => animate', [animate(pageDuration + 'ms linear', style({ transform: 'translateX(0)' }))])
    ])
  ]
})
export class PresentationProgressBarComponent implements OnInit, OnDestroy {
  public progress: 'off' | 'animate' = 'off';
  private subscription = Subscription.EMPTY;

  public constructor(private presentationModeProvider: PresentationModeProvider, private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.presentationModeProvider.presentationMode$
      .pipe(
        combineLatest(
          this.presentationModeProvider.currentPage$.pipe(
            startWith('') // combineLatest emits only when all combines have emitted
          )
        )
      )
      .subscribe(([mode, pageName]) => {
        this.progress = 'off';
        this.cdr.detectChanges();
        if (mode === PresentationMode.On) {
          setTimeout(() => {
            this.progress = 'animate';
            this.cdr.detectChanges();
          });
        }
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription = Subscription.EMPTY;
  }
}
