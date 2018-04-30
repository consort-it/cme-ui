import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSelectionList, MatListOption, MatSelectionListChange } from '@angular/material';
import { NgForm } from '@angular/forms';
import { TeamEditComponent } from '../team-edit/team-edit.component';

@Component({
  selector: 'cme-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements AfterViewInit, OnDestroy {
  @Input() public name = '';
  @Output() public nameChange = new EventEmitter<string>();
  @Input() public email = '';
  @Output() public emailChange = new EventEmitter<string>();
  @Input() public selectedRoles = new Array<string>();
  @Output() public selectedRolesChange = new EventEmitter<string[]>();
  @Output() public removePerson = new EventEmitter<void>();
  @ViewChild('form') form: NgForm | undefined;

  constructor(private teamEditor: TeamEditComponent) {}

  ngAfterViewInit() {
    if (this.form) {
      this.teamEditor.registerPersonEditComponent(this);
    }
  }

  ngOnDestroy() {
    this.teamEditor.unregisterPersonEditComponent(this);
  }

  get isValid(): boolean {
    if (this.form) {
      return !!this.form.valid;
    }
    return false;
  }

  isSelected(roleName: string): boolean {
    return this.selectedRoles.find(x => x === roleName) !== undefined;
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.selectedRolesChange.emit(event.source.selectedOptions.selected.map(item => item.value));
  }
}
