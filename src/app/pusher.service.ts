import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http'; 
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;
  constructor(private http: HttpClient) {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true
    });
    this.channel = this.pusher.subscribe('events-channel');
  }
  get() {
    return this.http.get('http://localhost:3120/getBirthdays')
    .subscribe(data => {});
  }
  like( num_likes ) {
    this.http.post('http://localhost:3120/update', {'likes': num_likes})
    .subscribe(data => {});
  }
  add( obj ) {
    this.http.post('http://localhost:3120/add', {'name' : obj.name, 'birthdate': obj.birthdate, 'address': obj.address})
    .subscribe(data => {});
  }
}