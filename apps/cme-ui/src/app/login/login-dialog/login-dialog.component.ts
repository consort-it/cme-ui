import { Component, OnInit } from '@angular/core';

import { AuthError, AuthService } from './../../shared';
import Amplify from 'aws-amplify';

@Component({
  selector: 'cme-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  errorMessage = '';

  constructor(private auth: AuthService) {
    Amplify.configure({
      Auth: {
        userPoolId: 'eu-central-1_M4FyC0JPA',
        userPoolWebClientId: '2k853680577ef72a77g5u6nuvg',
        mandatorySignIn: false,
        identityPoolId: 'eu-central-1:9d48d6d4-cce7-4764-a39b-0f10d662276a'
      }
    });
  }

  ngOnInit() {}

  login(credentials: { user: string; password: string }) {
    this.auth.login(credentials.user, credentials.password, () => {}, this.fail, () => {});
  }

  fail = (err: AuthError) => {
    this.errorMessage = err.message;
  };
}
