import { Component, OnInit } from '@angular/core';
import { PusherService } from '../pusher.service';
import { ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import { DomSanitizer  } from '@angular/platform-browser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  selectedAvatar: string = '001-man-13'
  maxDate: Date = new Date()
  yesterday = new Date(this.maxDate.getFullYear(),this.maxDate.getMonth(), this.maxDate.getDate() - 1)
  canSend: boolean = true
  editingPerson: Object = null
  icons = [
    '001-man-13',
    '002-woman-14',
    '003-woman-13',
    '004-woman-12',
    '005-woman-11',
    '006-woman-10',
    '007-woman-9',
    '008-woman-8',
    '009-woman-7',
    '010-woman-6',
    '011-woman-5',
    '012-woman-4',
    '013-woman-3',
    '014-man-12',
    '015-man-11',
    '016-man-10',
    '017-man-9',
    '018-man-8',
    '019-man-7',
    '020-man-6',
    '021-man-5',
    '022-man-4',
    '023-man-3',
    '024-man-2',
    '025-man-1',
    '026-man',
    '027-boy-6',
    '028-boy-5',
    '029-boy-4',
    '030-boy-3',
    '031-boy-2',
    '033-boy',
    '034-woman-2',
    '035-woman-1',
    '036-woman'
  ]
  
  constructor(private http: HttpClient, private pusherService: PusherService, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }
  getPersonInfo(id) {
    this.http.get('http://localhost:3120/getPersonById/' + id)
      .subscribe(data => {
        this.editingPerson = data["data"]
        this.selectedAvatar = data["data"].image
      })
  }
  ngOnInit() {
    let id = this.route.snapshot.params.id
    this.getPersonInfo(id)  
  }
  select(icon) {
    this.selectedAvatar = icon
  }
  getBackgroundColor(txt) {
    let style = {'background-color': '', 'cursor': 'pointer'}
    if(txt === this.selectedAvatar) {
      style["background-color"] = 'lightgray'
    } else {
      style["background-color"] = 'white'
    }
    return style
  }
  validate(form) {
    if (form.name == "") return false;
    if (form.birthdate == "") return false;
    return true
  }
  onSubmit(f: NgForm) {
    console.log(f.value) /*
    $("button").attr("disabled", "disabled");
    let obj = { name: '', birthdate: null, address: '', image: '' }
    let filePath = ''
    let filePathClean = ''
    if (this.validate(f.value) && this.canSend) {
      this.canSend = false
      obj.name = f.value.name
      obj.birthdate = f.value.birthdate
      obj.address = f.value.address
      obj.image = this.selectedAvatar
      
      setTimeout(() => {
        console.log('Acabo de enviar el request')
        this.pusherService.add(obj);
        f.reset()
        $("button").removeAttr("disabled");
        this.canSend = true
        $('#goHome').click()
      }, 3000)
      //
    } else {
      $("button").removeAttr("disabled");
      this.canSend = true
    }
    /**/
  }
}
