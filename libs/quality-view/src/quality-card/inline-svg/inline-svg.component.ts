import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LogService } from '@cme2/logging';

@Component({
  selector: 'cme-inline-svg',
  template: '',
  styleUrls: ['./inline-svg.component.scss']
})
export class InlineSvgComponent implements OnChanges {
  private _xmlContent: string | undefined;

  @Input() src: string | undefined;

  @Input() color = 'grey';

  constructor(private element: ElementRef, private logger: LogService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.src) {
      this.fetchSvgXml(changes.src.currentValue);
    } else if (changes.color && this._xmlContent) {
      this.update();
    }
  }

  private fetchSvgXml(newSrc: string) {
    this.logger.trace(`fetching url '${newSrc}' to inline svg content`);
    fetch(newSrc)
      .then((res: Response) => {
        if (res.ok) {
          res.text().then(svgText => {
            if (svgText) {
              this._xmlContent = svgText;
              this.update();
            }
          });
        }
      })
      .catch(err => {
        this.logger.error(`Could not load svg content from url '${newSrc}'`, err);
      });
  }

  private update() {
    if (this._xmlContent) {
      const svgText = this.parseSvgFromXml(this._xmlContent, this.color);
      this.element.nativeElement.innerHTML = svgText;
    }
  }

  private parseSvgFromXml(xmlStr: string, color: string): string {
    const matches = /(<svg.*?>(.*?)<\/svg>)/.exec(xmlStr);
    if (matches) {
      const result = matches[1]
        .replace(/width=".*?"/g, '')
        .replace(/height=".*?"/g, '')
        .replace(/<svg/, `<svg style="fill: ${color}"`);
      return result;
    }
    return '';
  }
}
