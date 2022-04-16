import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-djs',
  templateUrl: './djs.component.html',
  styleUrls: ['./djs.component.css']
})
export class DjsComponent implements OnInit {

  constructor() { }
  djs = [{music:"charts",name:"jost",instagram:"jostmusic",color:"Grün"},{music:"techno",name:"ramon",instagram:"ramon",color:"Rot"},{music:"90s",name:"sina",instagram:"instasina",color:"Blau"}];
  ngOnInit(): void {
  }

}
