import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { AuthService } from './../shared';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@Component({
  selector: 'cme-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  dialogRef: MatDialogRef<LoginDialogComponent, any> | undefined | null;

  constructor(public dialog: MatDialog, private auth: AuthService) {}

  ngOnInit() {
    this.auth.isAuthenticated$.pipe(distinctUntilChanged(), debounceTime(0)).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        if (this.dialogRef) {
          this.dialogRef.close();
          this.dialogRef = undefined;
        }
      } else {
        if (!this.dialogRef) {
          this.openDialog();
        }
      }
    });
  }

  openDialog = () => {
    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      disableClose: true,
      closeOnNavigation: false
    });
  };
}
