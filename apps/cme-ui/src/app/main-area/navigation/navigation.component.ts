import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cme-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  public readonly menuEntries = [
    { translationKey: 'home-view.menu-entry', link: ['/home'] },
    { translationKey: 'solution-view.menu-entry', link: ['/solution'] },
    { translationKey: 'domain-model-view.menu-entry', link: ['/domain-model'] },
    { translationKey: 'cost-view.menu-entry', link: ['/cost'] },
    { translationKey: 'quality-view.menu-entry', link: ['/quality'] }
  ];

  @Output() public entrySelected = new EventEmitter<void>();

  constructor() {}

  public onEntryClick(): void {
    this.entrySelected.emit();
  }
}
