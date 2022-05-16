import { Component, OnInit } from '@angular/core';
import { SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-bannerform',
  templateUrl: './bannerform.component.html',
  styleUrls: ['./bannerform.component.css']
})
export class BannerformComponent implements OnInit {

  constructor(private sse:SseHandlerService) { }

  texts:Array<string> = ["Silent Party Hannover"];
  add:string="";
  ngOnInit(): void {
    this.sse.rolltextObserv.subscribe((data)=>{
      this.texts = data;
    });
  }
  remove(index:number){
    this.texts.splice(index, 1);
    this.sse.updateBanner(this.texts);
  }

  submit(){
    this.texts.push(this.add);
    this.add = "";

    this.sse.updateBanner(this.texts);
  }

}
