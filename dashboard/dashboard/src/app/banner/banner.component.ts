import { animate, animation, style, } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
declare var anime: any; 

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit,AfterViewInit {
  @ViewChild('current') test!: ElementRef<HTMLDivElement>;
  constructor() { }

  ngAfterViewInit() {
    this.animateScrollIn();
  }
  lastText = -1;
  count = 0;
  texts:Array<string> = ["Willkommen auf der Silentparty","Wir Freuen uns dass ihr da seit","An der Bar gibts grade Happy Hour","0004000400040004"];

  loggin(){
    console.log();
  }

  timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async animateScrollIn(){
    this.lastText = (this.lastText +1) % this.texts.length;
    let node = document.createElement("div");
    node.innerText = "// "+ this.texts[this.lastText];
    node.classList.add("rolltext");
    if(this.count++%2) node.classList.add("weight-normal");
    var target:any = this.test.nativeElement.appendChild(node);
    console.log(target.offsetWidth);
    setTimeout(this.animateScrollOut.bind(this),200+target.offsetWidth/0.2);

  }
  animateScrollOut(){
    var target:any = this.test.nativeElement.querySelector("div:last-child");
    anime({
      targets: target,
      translateX: ["-100vw","100vw"],
      duration: (document.body.offsetWidth*2)/0.2,
      easing:"linear",
      complete: ()=>target.remove()

    });
    this.animateScrollIn();
  }

  ngOnInit(): void {

  }

}
