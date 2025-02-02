import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { timer } from 'rxjs';
import {transpile} from 'typescript';

@Component({
  selector: 'app-prompt2-code-output',
  templateUrl: './prompt2-code-output.component.html',
  styleUrls: ['./prompt2-code-output.component.css']
})
export class Prompt2CodeOutputComponent {
  public outputContent: SafeHtml = ""
  @Input() public outputHTMLCode = "Code"
  @Input() public outputScriptCode = "Script"
  @Output() public backPressed = new EventEmitter()
  public showCode: boolean = false

  private outputJSCode = ""

  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {

  }

  @Input() set hidden(value: boolean) {
    this.elementRef.nativeElement.hidden = value;
    if (value) {
      this.showCode = true
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outputHTMLCode']) {
      //console.log("property change" + this.outputHTMLCode)
      this.outputContent = this.sanitizer.bypassSecurityTrustHtml(this.outputHTMLCode)
    }
    
    if (changes['outputScriptCode']) {
      //console.log("property change" + this.outputScriptCode)
      this.outputJSCode = transpile(this.outputScriptCode)
      const delayMilliseconds = 2000; // 2 seconds
      timer(delayMilliseconds).subscribe(() => {
        eval(this.outputJSCode)
      });
    }
  }

  public onRenderClicked() {
    this.showCode = false;
  }

  public onCodeClicked() {
    this.showCode = true;
  }

  public onBackClicked() {
    this.backPressed.emit()
  }

  public onCopyCodeClicked() {
    this.copyStringToClipboard(this.outputHTMLCode)
  }

  public onCopyScriptClicked() {
    this.copyStringToClipboard(this.outputScriptCode)
  }

  private copyStringToClipboard(data: string) {
    const { clipboard } = navigator;
    clipboard.writeText(data)
      .then(() => {
        console.log('Text copied to clipboard: ' + data);
      })
      .catch((err) => {
        console.error('Failed to copy text: ' + err);
      });
  }
}
