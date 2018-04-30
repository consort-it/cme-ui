import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cme-not-logged-in-view',
  templateUrl: './not-logged-in-view.component.html',
  styleUrls: ['./not-logged-in-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotLoggedInViewComponent {}
