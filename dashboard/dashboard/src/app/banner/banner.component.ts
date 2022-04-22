import { animate, animation, style, } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { min } from 'rxjs';
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
  texts:Array<string> = ["AAAA","BBBBBBBBB"];

  loggin(){
    console.log();
  }

  timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  lastOffset  = 0;
  async animateScrollIn(){
    let wrapper = document.createElement("div");
    wrapper.classList.add("rolltextwrapper");
    for(let textIndex in this.texts){
      let node = document.createElement("div");
      node.innerText = "// "+ this.texts[textIndex];
      node.classList.add("rolltext");
      if(this.count++%2) node.classList.add("weight-normal");
      wrapper.appendChild(node);
    }
    var target:any = this.test.nativeElement.appendChild(wrapper);
    wrapper.style.transform ="translateX(-"+wrapper.offsetWidth+"px)";

    
    setTimeout(this.animateScrollOut.bind(this),this.lastOffset/0.04);
    this.lastOffset = target.clientWidth;
  }
  animateScrollOut(){
    var all = this.test.nativeElement.querySelectorAll(".rolltextwrapper");
    var target:any = all[all.length-1];
    var duration = (target.offsetWidth*2 + document.body.offsetWidth)/0.04;
    console.log(duration);
    target.style.transition = "all linear "+duration+"ms";
   
    target.style.transform ="translateX("+(target.offsetWidth + document.body.offsetWidth)+"px)";
    target.addEventListener("transitionend",function(e:any){e.target.remove()});
    this.animateScrollIn();
  }

  ngOnInit(): void {

  }

}
