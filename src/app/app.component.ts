import { Component, OnInit } from '@angular/core';
import { PusherService } from './pusher.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {NgForm} from '@angular/forms';
import { Observable,Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import * as $ from 'jquery'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Pusher Liker';
  name: string = ''
  birthdays: Observable<Object>[] = null
  birthdaysToday: Observable<Object>[] = null
  constructor(private pusherService: PusherService, private db: AngularFireDatabase, private http: HttpClient) {
  }
  onSubmit(f: NgForm) {
    console.log(f.value)
    this.pusherService.add(f.value);
    $('#modalClose').click()
    f.reset()
  }
  ngOnInit() {
    this.pusherService.channel.bind('new-like', data => {
      this.birthdays = data.birthdays
    });
    this.http.post('http://localhost:3120/update', {'likes': 0})
    .subscribe(data => {
      this.birthdays = data["data"]
    })
    this.http.post('http://localhost:3120/birthday', {'likes': 0})
    .subscribe(data => {
      this.birthdaysToday = data["data"]
    })

    $(document).ready(() => {
      $("#blah").on('click', () => {
        $('#avatar').trigger('click'); 
      })
      $("#avatar").change(function() {
        if (this.files && this.files[0]) {
          var reader = new FileReader();
      
          reader.onload = function(e: any) {
            $('#blah').css('background', 'url(' + e.target.result + ')');
            $('#blah').css('background-size', 'cover');
            $('#blah').css('background-position', 'center');
          }
      
          reader.readAsDataURL(this.files[0]);
        }
      });
    })
  }
  // add to the number of likes to the server
  liked() {
    //this.likes = parseInt(this.likes, 10) + 1;
  }
}
