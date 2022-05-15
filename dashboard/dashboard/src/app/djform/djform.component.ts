import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DJ, DJs, SseHandlerService } from '../sse-handler.service';

@Component({
  selector: 'app-djform',
  templateUrl: './djform.component.html',
  styleUrls: ['./djform.component.css']
})
export class DjformComponent implements OnInit {

  form = new FormGroup({
      blau: new FormGroup({
        name: new FormControl("", Validators.required),
        instagram: new FormControl("", Validators.required),
        music: new FormControl("", Validators.required)
      }),
      grun: new FormGroup({
        name: new FormControl( "", Validators.required),
        instagram: new FormControl( "", Validators.required),
        music: new FormControl("", Validators.required)
      }),
      rot: new FormGroup({
        name: new FormControl("", Validators.required),
        instagram: new FormControl("", Validators.required),
        music: new FormControl("", Validators.required)
      })

  });

  constructor(private sse:SseHandlerService) { }
  reset(){
    this.sse.UserStatsDJS.subscribe((data:DJs)=>{
      let patchData:any = {};
      console.log(data);
      for(let i=0;i<Math.min(3,data.length);i++){
        patchData[data[i].color.replace("ü","u").toLowerCase()] = data[i];
      }
      this.form.patchValue(patchData);
    });
  }
  ngOnInit(): void {
    this.reset();
  }
  error = false;
  onSubmit(){
    if(!this.form.valid){
      this.error = true;
      return;
    }
    this.error = false;
    let rot:DJ = this.form.value["rot"];
    rot.color = "Rot";
    let grun:DJ = this.form.value["grun"];
    grun.color = "Grün";
    let blau:DJ = this.form.value["blau"];
    blau.color = "Blau";
    this.sse.updateDJS([rot,grun,blau]);    

  }

}
