import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {

  constructor() { }

  steps=[
    {number:1, chip:true, name: "Bier" , price: 2.50},
    {number:1, chip:true, name: "Pepsi" , price: 2.00},
    {number:1, chip:true, name: "7Up" , price: 2.00},
    {number:1, chip:false, name: "Bowle" , price: 3.50},
    {number:1, chip:false, name: "Wein" , price: 3.00},
    {number:1, chip:true, name: "Wasser" , price: 1.00},

  ]

  ngOnInit(): void {
  }

}
