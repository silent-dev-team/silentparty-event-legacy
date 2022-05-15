import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseHandlerService {

  UserStatsObserv:Observable<Userstats>
  UserStatsDJS:Observable<DJs>
  UserStatsInfos:Observable<Infos>
  
  constructor(private http: HttpClient) { 
    console.log("constructed");
    let eventSource = new EventSource("http://localhost:5000/stream");
    this.UserStatsObserv = new Observable((observer) => {
      eventSource.addEventListener("userstats",(e)=>observer.next(JSON.parse(e.data)));
    });
    this.UserStatsDJS = new Observable((observer) => {
      eventSource.addEventListener("djs",(e)=>observer.next(JSON.parse(e.data)));
    });
    this.UserStatsInfos = new Observable((observer) => {
      eventSource.addEventListener("infos",(e)=>observer.next(JSON.parse(e.data)));
    });
    setTimeout(()=>this.refreshAll(),400);
  }


  updateDJS(djs:DJs){
    	this.http.post("http://localhost:5000/djs",djs).subscribe();
  }

  refreshAll(){
    this.http.get("http://localhost:5000/refresh").subscribe();
  }


}

export interface Userstats{
  sells:number,
  checked:number,
  returned:number,
}
export interface Infos{
  rollbanner:string[],
  info:string,
  panic:string,
}
export interface DJ{
  music:string,
  name:string,
  instagram:string,
  color:string
}
export type DJs = DJ[];