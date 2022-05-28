import { Component, OnInit } from '@angular/core';
import { SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private data: SseHandlerService) { }
  current=0;
  sum = 0;
  ngOnInit(): void {
    this.data.UserStatsObserv.subscribe((data)=>{
      console.log(data);
      this.current = data.current;
      this.sum = data.checked;
    })
  }

}
