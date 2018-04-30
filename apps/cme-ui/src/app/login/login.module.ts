import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { I18nModule } from '@cme2/i18n';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginComponent } from './login.component';
import Amplify from 'aws-amplify';
import { AmplifyAngularModule, AmplifyService } from '@cme2/aws-amplify-angular-yolo';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    I18nModule,
    AmplifyAngularModule
  ],
  declarations: [LoginComponent, LoginDialogComponent],
  exports: [LoginComponent],
  entryComponents: [LoginDialogComponent]
})
export class LoginModule {}
