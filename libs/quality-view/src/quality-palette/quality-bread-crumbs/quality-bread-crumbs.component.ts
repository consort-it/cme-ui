import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { QualityPaletteService } from '../services/quality-palette.service';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

@Component({
  selector: 'cme-quality-bread-crumbs',
  templateUrl: './quality-bread-crumbs.component.html',
  styleUrls: ['./quality-bread-crumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityBreadCrumbsComponent implements OnInit {
  public title$: Observable<string | undefined> = empty();

  constructor(private qualityPalette: QualityPaletteService, private translationService: TranslateService) {}

  ngOnInit() {
    this.title$ = this.qualityPalette.context$.pipe(
      filter(context => !!context),
      switchMap(context => {
        return this.translationService.get(context!.titleKey);
      })
    );
  }
}
