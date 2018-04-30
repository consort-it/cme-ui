import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MetaDataService } from '@cme2/core-services';
import { Subscription } from 'rxjs/Subscription';

declare var mermaid: any;

@Component({
  selector: 'cme-context-view',
  templateUrl: './context-view.component.html',
  styleUrls: ['./context-view.component.scss']
})
export class ContextViewComponent implements OnInit, OnDestroy {
  @ViewChild('contextDiagram') diagramElement: ElementRef | undefined;
  @ViewChild('temp') tempElement: ElementRef | undefined;

  svg = '';
  error = false;

  subscription = Subscription.EMPTY;

  constructor(private meta: MetaDataService) {}

  ngOnInit() {
    mermaid.initialize({});
    this.subscription = this.meta.currentProject$.subscribe(project => {
      this.renderDiagram(project.context || '');
    });
  }

  private renderDiagram(graphDefinition: string) {
    this.diagramElement!.nativeElement.innerHTML = '';
    this.tempElement!.nativeElement.innHTML = '';
    try {
      mermaid.render(
        'context-diagram',
        graphDefinition,
        (svg: any) => {
          this.svg = svg;
          this.diagramElement!.nativeElement.innerHTML = this.svg;
          this.diagramElement!.nativeElement.style.maxWidth = '';
          const dimension = this.diagramElement!.nativeElement.firstChild.lastChild.getBoundingClientRect();
          const svgElement = this.diagramElement!.nativeElement.firstChild;
          svgElement.style.width = dimension.width + 20;
          svgElement.style.height = dimension.height + 20;

          this.error = false;
        },
        this.tempElement!.nativeElement
      );
    } catch (err) {
      this.error = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
