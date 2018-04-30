import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonEditShowCaseComponent } from './person-edit-show-case/person-edit-show-case.component';
import { PersonEditComponent } from '../../../../cme-ui/src/app/home-view/team-edit/person-edit/person-edit.component'; //tslint:disable-line
import { TeamEditModule } from '../../../../cme-ui/src/app/home-view/team-edit/team-edit.module'; //tslint:disable-line
import { TeamViewShowCaseComponent } from './team-view-show-case/team-view-show-case.component'; //tslint:disable-line
import { HomeViewModule } from '../../../../cme-ui/src/app/home-view'; //tslint:disable-line

@NgModule({
  imports: [CommonModule, TeamEditModule, HomeViewModule],
  declarations: [PersonEditShowCaseComponent, TeamViewShowCaseComponent],
  exports: [PersonEditShowCaseComponent, TeamViewShowCaseComponent]
})
export class TeamShowCaseModule {}
