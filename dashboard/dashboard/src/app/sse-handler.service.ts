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
  Entry:Observable<boolean>
  rolltextObserv:Observable<string[]>
  constructor(private http: HttpClient) { 
    console.log("constructed");
    let eventSource = new EventSource("https://sp/stream");
    this.UserStatsObserv = new Observable((observer) => {
      eventSource.addEventListener("userstats",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.UserStatsDJS = new Observable((observer) => {
      eventSource.addEventListener("djs",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.UserStatsInfos = new Observable((observer) => {
      eventSource.addEventListener("infos",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.Entry = new Observable((observer) => {
      eventSource.addEventListener("entry",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    this.rolltextObserv = new Observable((observer) => {
      eventSource.addEventListener("rolltext",(e:any)=>observer.next(JSON.parse(e.data)));
    });
    setTimeout(()=>this.refreshAll(),400);
  }


  updateDJS(djs:DJs){
    	this.http.post("https://api.sp/djs",djs).subscribe();
  }
  updateBanner(banner:string[]){
    this.http.post("https://api.sp/rolltext",banner).subscribe();
}

  refreshAll(){
    this.http.get("https://api.sp/refresh").subscribe();
  }


}

export interface Userstats{
  sells:number,
  checked:number,
  returned:number,
  current:number
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