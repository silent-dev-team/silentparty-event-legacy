import { animate, animation, style, } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { SseHandlerService } from '../sse-handler.service';
declare var anime: any;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit,AfterViewInit {
  @ViewChild('current') test!: ElementRef<HTMLDivElement>;
  constructor(private sse:SseHandlerService) {

    this.sse.rolltextObserv.subscribe((data)=>{
      this.texts = data;
    });
   }

  ngAfterViewInit() {
    this.animateScrollIn();
  }
  lastText = -1;
  count = 0;
  texts:Array<string> = ["SP"];

  loggin(){
    console.log();
  }

  timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  lastOffset  = 0;
  async animateScrollIn(){
    let texts = this.texts;
    let wrapper = document.createElement("div");
    wrapper.classList.add("rolltextwrapper");
    for(let textIndex in texts){
      let node = document.createElement("div");
      node.innerText = "// "+ texts[textIndex];
      node.classList.add("rolltext");
      if(this.count++%2) node.classList.add("weight-normal");
      wrapper.appendChild(node);
    }
    var target:any = this.test.nativeElement.appendChild(wrapper);
    wrapper.style.transform ="translateX("+ (document.body.offsetWidth+wrapper.offsetWidth) +"px)";


    setTimeout(this.animateScrollOut.bind(this),this.lastOffset/0.1);
    this.lastOffset = wrapper.clientWidth;
  }
  animateScrollOut(){
    var all = this.test.nativeElement.querySelectorAll(".rolltextwrapper");
    var target:any = all[all.length-1];
    var duration = (target.offsetWidth*2 + document.body.offsetWidth)/0.1;
    console.log(duration);
    target.style.transition = "all linear "+duration+"ms";

    target.style.transform ="translateX(-"+(target.offsetWidth)+"px)";
    target.addEventListener("transitionend",function(e:any){e.target.remove()});
    this.animateScrollIn();
  }

  ngOnInit(): void {

  }

}
