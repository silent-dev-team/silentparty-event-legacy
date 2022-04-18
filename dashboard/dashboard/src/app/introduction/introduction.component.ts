import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  constructor() { }

  steps=[
    {number:1, text: "Guteschein Kaufen"},
    {number:2, text: "Rückseite Ausfüllen"},
    {number:3, text: "mit karte + 5€ Pfand Kopfhörer Abholen"},
  ]

  ngOnInit(): void {
  }

}
