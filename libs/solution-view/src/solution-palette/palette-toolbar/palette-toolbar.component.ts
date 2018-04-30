import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cme-palette-toolbar',
  templateUrl: './palette-toolbar.component.html',
  styleUrls: ['./palette-toolbar.component.scss']
})
export class PaletteToolbarComponent implements OnInit {
  constructor() {}

  @Input() infotext = '';

  ngOnInit() {}
}
