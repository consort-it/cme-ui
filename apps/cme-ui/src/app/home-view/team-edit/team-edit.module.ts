import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import {
  MatCard,
  MatCardModule,
  MatFormFieldModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatSelectModule,
  MatListModule,
  MatInputModule,
  MatIconModule,
  MatExpansionModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    I18nModule,
    MatExpansionModule
  ],
  declarations: [TeamEditComponent, PersonEditComponent],
  exports: [TeamEditComponent, PersonEditComponent]
})
export class TeamEditModule {}
