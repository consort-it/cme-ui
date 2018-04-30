import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LastCommitService } from './last-commit.service';
import { Observable } from 'rxjs/Observable';
import { Commit } from './commit';

@Component({
  selector: 'cme-last-commit',
  templateUrl: './last-commit.component.html',
  styleUrls: ['./last-commit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LastCommitComponent {
  constructor(public lastCommitService: LastCommitService) {}
}
