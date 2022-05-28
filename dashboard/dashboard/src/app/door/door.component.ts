import { Component, OnInit } from '@angular/core';
import { SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-door',
  templateUrl: './door.component.html',
  styleUrls: ['./door.component.css']
})
export class DoorComponent implements OnInit {
  open = true;

  constructor(private data: SseHandlerService) { }
  ngOnInit(): void {
    this.data.Entry.subscribe((data:boolean)=>{
      console.log(data);
      this.open = data;
    })
  }

}
