import { Component, OnInit } from '@angular/core';
import { SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-djs',
  templateUrl: './djs.component.html',
  styleUrls: ['./djs.component.css']
})
export class DjsComponent implements OnInit {

  constructor(private sse: SseHandlerService) { }
  djs = [{music:"charts",name:"jost",instagram:"jostmusic",color:"Grün"},{music:"techno",name:"ramon",instagram:"ramon",color:"Rot"},{music:"90s",name:"sina",instagram:"instasina",color:"Blau"}];
  ngOnInit(): void {
    this.sse.UserStatsDJS.subscribe((data)=>{
      this.djs = data;
    })
  }

}
