import { Injectable } from '@angular/core';
import Amplify, { Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { LogService } from '@cme2/logging';
import { distinctUntilChanged } from 'rxjs/operators';
import { Hub } from 'aws-amplify';
import { AmplifyService } from '@cme2/aws-amplify-angular-yolo';

interface Session {
  idToken: any;
  refreshToken: any;
  accessToken: any;
}

interface User {
  Session: Session;
  username: string;
  challengeName?: string;
  challengeParam?: any;
  getSession: Function;
}

export interface AuthError {
  code: string;
  name: string;
  message: string;
}

interface UserAttribute {
  Name: string;
  Value: string;
}

@Injectable()
export class AuthService {
  private _user: User | null | undefined;
  private _session: Session | null | undefined;
  private _isAuthenticated = false;
  private _userAttributes: UserAttribute[] = [];
  private _fullName$$ = new BehaviorSubject<string>('');
  private _username$$ = new BehaviorSubject<string>('');
  private _isAuthenticated$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated);
  private _jwtToken$$: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private log: LogService, private amplifyService: AmplifyService) {
    Amplify.configure({
      Auth: {
        userPoolId: 'eu-central-1_M4FyC0JPA',
        userPoolWebClientId: '2k853680577ef72a77g5u6nuvg',
        region: 'eu-central-1'
      }
    });
    Hub.listen('auth', this, 'AuthListener');

    amplifyService.authStateChange$.subscribe((authState: any) => {
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
        this.loadExistingSession();
      }
    });

    this.loadExistingUser();
    this.loadExistingSession();
  }

  loadExistingUser() {
    Auth.currentAuthenticatedUser().then(
      (user: User) => {
        this.user = user;
        this.log.info(`Authenticated user:`, user);
        this.loadUserAttributes();
      },
      () => {
        this.user = null;
      }
    );
  }

  loadExistingSession() {
    return new Promise(resolve => {
      Auth.currentSession().then(
        (session: Session) => {
          this.session = session;
          this.log.info(`Initialized session:`, session);
          resolve();
        },
        () => {
          this.session = null;
          resolve();
        }
      );
    });
  }

  login(
    username: string,
    password: string,
    successCallback: () => void,
    failCallback: (err: AuthError) => void,
    completeRegistrationCallback: (requiredAttributes: string[]) => void
  ) {
    Auth.signIn(username, password).then(
      async (user: User) => {
        this.user = user;
        await this.loadExistingSession();
        if (this.user && this.user.challengeName && this.user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          const requiredAttributes = ['password', ...this.user.challengeParam.requiredAttributes];
          completeRegistrationCallback(requiredAttributes);
        } else {
          if (this.isAuthenticated) {
            successCallback();
          } else {
            failCallback({
              code: '',
              name: '',
              message: 'Login was successful, but no session found'
            });
          }
        }
      },
      (err: AuthError) => {
        this.user = null;
        this.session = null;
        failCallback(err);
      }
    );
  }

  completeRegistration(
    newPassword: string,
    requiredAttributes: any,
    successCallback: () => void,
    failCallback: (err: AuthError) => AuthError
  ) {
    Auth.completeNewPassword(this.user, newPassword, requiredAttributes).then(
      async (v: any) => {
        await this.loadExistingSession();
        successCallback();
      },
      (err: AuthError) => {
        failCallback(err);
      }
    );
  }

  logout() {
    Auth.signOut().then(() => {
      this.session = null;
      this.user = null;
    });
  }

  private set session(session: any) {
    this._session = session;
    this._isAuthenticated = !!this._session;
    if (this._isAuthenticated$$) {
      this._isAuthenticated$$.next(this._isAuthenticated);
    }
    if (this._session && this._session.accessToken) {
      this._jwtToken$$.next(this._session.accessToken.jwtToken);
    }
  }

  accessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      Auth.currentSession().then(
        (session: Session) => {
          this.session = session;
          resolve(session.accessToken.jwtToken);
        },
        err => {
          this.session = null;
          this.log.warn(`Session expired.`, err);
          reject('expired token');
        }
      );
    });
  }

  private get user(): User | undefined | null {
    return this._user;
  }

  private set user(user: User | undefined | null) {
    this._user = user;
    if (this._user) {
      this._username$$.next(this._user.username);
      this.loadUserAttributes();
    } else {
      this._username$$.next('');
      this._fullName$$.next('');
    }
  }

  private async loadUserAttributes() {
    if (this._user) {
      const loadAttributes = () => {
        return new Promise(resolve => {
          Auth.userAttributes(this._user).then(
            (userAttributes: UserAttribute[]) => {
              this._userAttributes = userAttributes;
              this.log.info(`Loaded user attributes:`, userAttributes);
              resolve();
            },
            (err: AuthError) => {
              resolve();
            }
          );
        });
      };

      await loadAttributes();

      const fullUser = `${this.getUserAttributeByName('given_name')} ${this.getUserAttributeByName('family_name')}`;
      this._fullName$$.next(fullUser);
    }
  }

  getUserAttributeByName(attributeName: string) {
    attributeName = attributeName.toLowerCase();
    const match = this._userAttributes.filter(att => att.Name.toLowerCase() === attributeName);
    if (match.length === 1) {
      return match[0].Value;
    }
    return '';
  }

  get fullName$(): Observable<string> {
    return this._fullName$$.asObservable();
  }

  get username$(): Observable<string> {
    return this._username$$.asObservable();
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated$$.pipe(distinctUntilChanged());
  }

  onHubCapsule(capsule: any) {
    const { channel, payload } = capsule;
    this.log.debug(JSON.stringify(capsule));
    if (channel === 'auth') {
      this.onAuthEvent(payload);
      this.loadExistingUser();
      this.loadExistingSession();
    }
  }

  onAuthEvent(payload: any) {
    this.log.debug(JSON.stringify(payload));
    const { event, data } = payload;
    switch (event) {
      case 'signIn':
        // tslint:disable-next-line:no-console
        this.log.debug('user signed in');
        break;
      case 'signUp':
        // tslint:disable-next-line:no-console
        this.log.debug('user signed up');
        break;
      case 'signOut':
        // tslint:disable-next-line:no-console
        this.log.debug('user signed out');
        break;
      case 'signIn_failure':
        // tslint:disable-next-line:no-console
        this.log.debug('user sign in failed' + data);
        break;
    }
  }
}
