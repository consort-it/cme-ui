import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceContextComponent } from './service-context.component';
import { MatIconModule, MatFormFieldModule, MatChipsModule, MatButtonModule } from '@angular/material';
import { EditListModalComponent } from './edit-list-modal/edit-list-modal.component';
import { I18nModule } from '@cme2/i18n';
import { ContextDiagramComponent } from './context-diagram/context-diagram.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatChipsModule, MatButtonModule, I18nModule],
  declarations: [ServiceContextComponent, EditListModalComponent, ContextDiagramComponent],
  exports: [ServiceContextComponent, ContextDiagramComponent],
  entryComponents: [EditListModalComponent]
})
export class ServiceContextModule {}
