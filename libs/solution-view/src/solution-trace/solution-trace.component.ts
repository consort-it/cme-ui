import { Component, HostBinding, Input, OnInit, HostListener } from '@angular/core';

export enum SolutionTraceType {
  SolutionStart,
  SolutionEnd,
  Horizontal,
  HorizontalSouth,
  HorizontalNorth,
  HorizontalNorthSouth,
  Empty
}

@Component({
  selector: 'cme-solution-trace',
  templateUrl: './solution-trace.component.html',
  styleUrls: ['./solution-trace.component.scss']
})
export class SolutionTraceComponent implements OnInit {
  @Input() traceType: SolutionTraceType | undefined;

  @HostBinding('class.solution-start')
  get solutionStart() {
    return this.matchType(SolutionTraceType.SolutionStart);
  }

  @HostBinding('class.solution-end')
  get solutionEnd() {
    return this.matchType(SolutionTraceType.SolutionEnd);
  }

  @HostBinding('class.horizontal')
  get horizontal() {
    return this.matchType(SolutionTraceType.Horizontal);
  }

  @HostBinding('class.horizontal-south')
  get horizontalSouth() {
    return this.matchType(SolutionTraceType.HorizontalSouth);
  }

  @HostBinding('class.horizontal-north')
  get horizontalNorth() {
    return this.matchType(SolutionTraceType.HorizontalNorth);
  }

  @HostBinding('class.horizontal-north-south')
  get horizontalNorthAndSouth() {
    return this.matchType(SolutionTraceType.HorizontalNorthSouth);
  }

  @HostBinding('class.empty')
  get empty() {
    return this.matchType(SolutionTraceType.Empty);
  }

  @Input()
  @HostBinding('class.no-trace')
  noTrace = false;

  constructor() {}

  ngOnInit() {}

  private matchType(type: SolutionTraceType): boolean {
    if (this.traceType === undefined) {
      return false;
    }
    return this.traceType === type;
  }
}
