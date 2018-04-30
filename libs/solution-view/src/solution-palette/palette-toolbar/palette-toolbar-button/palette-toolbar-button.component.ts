import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cme-palette-toolbar-button',
  templateUrl: './palette-toolbar-button.component.html',
  styleUrls: ['./palette-toolbar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteToolbarButtonComponent implements OnInit {
  @Input() icon = '';
  @Input() tooltip = '';
  @Input() disableTooltip = false;

  @Output() click = new EventEmitter<MouseEvent>();

  @HostBinding('class.disabled')
  @Input()
  disabled = false;

  constructor() {}

  ngOnInit() {}

  handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled === false) {
      this.click.emit(event);
    }
  }
}
