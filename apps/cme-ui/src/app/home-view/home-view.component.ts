import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MetaDataService } from '@cme2/core-services';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cme-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeViewComponent implements OnInit {
  constructor(public metadataService: MetaDataService) {}

  ngOnInit() {}
}
