import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
@Injectable()
export class ConstantProvider {
  BackstageUrl;
  constructor() {
    //this.BackstageUrl = 'http://192.168.1.25:8080/inquiry/';
    //this.BackstageUrl = 'http://192.168.1.53:8080/inquiry/';
    //this.BackstageUrl = 'http://192.168.1.173:19090/inquiry/';
    //this.BackstageUrl = 'http://192.168.1.168:50018/inquiry/';
    this.BackstageUrl = ENV.BACKEND_URL;
    //this.BackstageUrl ='https://bot.infisa.com.cn/inquiry/'
    //this.BackstageUrl = 'http://bottest.infisa.com.cn/inquiry-test/';
  }

}
