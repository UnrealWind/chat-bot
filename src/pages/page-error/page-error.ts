import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PageErrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-error',
  templateUrl: 'page-error.html',
})
export class PageErrorPage {
  msg;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.msg =navParams.get("msg");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageErrorPage');
  }

}
