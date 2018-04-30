import { Component, Input } from '@angular/core';

@Component({
  selector: 'cme-icon-with-indicator',
  templateUrl: './icon-with-indicator.component.html',
  styleUrls: ['./icon-with-indicator.component.scss']
})
export class IconWithIndicatorComponent {
  @Input() healthIndex: number | undefined | null;

  @Input() iconName = 'bug.svg';

  @Input() indicatorCount: number | undefined;

  @Input() indicatorTooltip: string | undefined;

  get healthColor(): string {
    if (this.healthIndex === undefined || this.healthIndex === null) {
      return 'grey';
    }
    if (this.healthIndex === 0) {
      return 'red';
    }
    if (this.healthIndex === 100) {
      return 'green';
    }

    return '#FFC400';
  }

  get iconFullPath(): string {
    return `assets/quality-view/${this.iconName}`;
  }
}
