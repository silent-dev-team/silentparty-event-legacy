import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {

  constructor() { }

  steps=[
    {number:1, name: "Bier" , price: 2.50},
    {number:1, name: "Pepsi" , price: 2.00},
    {number:1, name: "7Up" , price: 2.00},
    {number:1, name: "Bowle" , price: 3.50},
    {number:1, name: "Wein" , price: 3.00},
    {number:1, name: "Wasser" , price: 1.00},

  ]

  ngOnInit(): void {
  }

}
