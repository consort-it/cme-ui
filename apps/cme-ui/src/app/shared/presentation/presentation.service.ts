import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LogService } from '@cme2/logging';
import { PresentationMode, PresentationModeProvider } from '@cme2/shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { timer } from 'rxjs/observable/timer';
import { filter, first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

export const pageDuration = 10000;

type RouterCommand = any[];

const isValidRouteForPresentationMode = function(route: Route): boolean {
  return route.path && route.data && route.data.shouldShowInPresentationMode && route.data.pageName;
};

@Injectable()
export class PresentationService implements PresentationModeProvider {
  private readonly presentationMode$$ = new BehaviorSubject<PresentationMode>(PresentationMode.Off);
  public readonly presentationMode$ = this.presentationMode$$.asObservable();

  private readonly currentPage$$ = new Subject<string>();
  public readonly currentPage$ = this.currentPage$$.asObservable();

  public get presentationMode(): PresentationMode {
    return this.presentationMode$$.value;
  }

  public get pageDuration(): number {
    return pageDuration;
  }

  public set presentationMode(value: PresentationMode) {
    this.presentationMode$$.next(value);
    if (value === PresentationMode.On) {
      this.startRoutingLoop();
    }
  }

  public constructor(private router: Router, private logService: LogService) {}

  private startRoutingLoop(): void {
    const routerCommands = this.getAllPagesForPresentationMode();
    if (routerCommands.length === 0) {
      this.logService.warn(
        'Did not find any valid routes for presentation mode. Route data must contain flag shouldShowInPresentationMode and a pageName!'
      );
      return;
    }
    timer(0, pageDuration)
      .pipe(takeUntil(this.presentationMode$.pipe(filter(mode => mode === PresentationMode.Off), first())))
      .subscribe(i => {
        const pageInfo = routerCommands[i % routerCommands.length];
        this.router.navigate(pageInfo.routerCommand);
        this.currentPage$$.next(pageInfo.pageName);
      });
  }

  private getAllPagesForPresentationMode(): Array<{ routerCommand: RouterCommand; pageName: string }> {
    const results: { routerCommand: RouterCommand; pageName: string }[] = [];
    this.getPagesForPresentationModeRecursive(this.router.config || [], results);
    this.logService.debug('Found routes for presentation loop:', results);
    return results;
  }

  private getPagesForPresentationModeRecursive(
    routes: Route[],
    intermediateResults: Array<{ routerCommand: RouterCommand; pageName: string }> = []
  ): void {
    const routeWithPresentationModePages = routes.filter(
      route => route.children && route.data && route.data.containsPresentationModePages
    );

    intermediateResults.push(
      ...routes
        .filter(route => isValidRouteForPresentationMode(route))
        .map(route => ({ routerCommand: [`/${route.path}`], pageName: route.data!.pageName }))
    );

    routeWithPresentationModePages.forEach(route => {
      if (route.children) {
        this.getPagesForPresentationModeRecursive(route.children, intermediateResults);
      }
    });
  }
}
