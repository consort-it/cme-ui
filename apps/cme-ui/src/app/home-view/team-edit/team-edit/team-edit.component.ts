import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';
import { MetaDataPerson, MetadataProject } from '@cme2/core-services';
import { PersonEditComponent } from '../person-edit/person-edit.component';

@Component({
  selector: 'cme-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TeamEditComponent implements DoCheck {
  public isValid = false;

  private _personEditComps: PersonEditComponent[] = [];

  @Input() project: MetadataProject | undefined;
  @Output() projectChange = new EventEmitter<MetadataProject>();

  onRemovePerson(person: MetaDataPerson) {
    if (this.project) {
      const index = this.project.team.indexOf(person);
      if (index !== -1) this.project.team.splice(index, 1);
    }
  }
  onAddPerson() {
    if (this.project) {
      this.project.team.push({ name: '', email: '', roles: [] });
    }
  }

  ngDoCheck() {
    this.isValid = this._personEditComps.every(x => x.isValid);
  }

  registerPersonEditComponent(personEditComponent: PersonEditComponent) {
    this._personEditComps.push(personEditComponent);
  }

  unregisterPersonEditComponent(personEditComponent: PersonEditComponent) {
    const idx = this._personEditComps.findIndex(x => x === personEditComponent);
    if (idx > -1) {
      this._personEditComps.splice(idx, 1);
      this.ngDoCheck();
    }
  }
}
