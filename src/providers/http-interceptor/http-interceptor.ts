import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpRequest,HttpHandler,HttpSentEvent,HttpHeaderResponse,
  HttpProgressEvent,HttpResponse,HttpUserEvent } from '@angular/common/http';

import { NavController, App,LoadingController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PageErrorPage} from "../../pages/page-error/page-error";

import { Observable } from "rxjs/Observable";
// import { NotifyService } from 'ngx-notify';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'

@Injectable()
export class Interceptor implements HttpInterceptor {
  loading;
  constructor(public alertCtrl:AlertController,
              public appCtrl : App,
              public loadingCtrl:LoadingController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    var that = this;
    const Req = req.clone({

      //以后可能会将eu,ep放在header里,
      /*headers: req.headers.set('token', 'asdf'),*/
      /*params:req.params.set('eu','c4843ad54897b3f8a45de8807a89bc76')
        .set('ep','c4843ad54897b3f8a45de8807a89bc76')*/
    });

    this.loading = that.loadingCtrl.create({
      spinner: 'crescent',
      content: '加载中……'
    });

    //由于angular 预加载loading时虽然js已加载但是图片并未加载完毕导致初始页面存在未加载的图片，所以在这里默认加载
    //json文件的话就不再进行loading的提示了
    Req.url.indexOf("json")== -1?(function () {
      //that.loading.present();
    })():undefined;

    return next
      .handle(Req)
      .mergeMap((event: any) => {

        //这里可以通过各种情况抛出异常
        if (event instanceof HttpResponse && event.status !== 200) {
          this.loading._state == 1 ? this.loading.dismiss() : undefined;
          return Observable.create(observer => observer.error(event));
        }else if(event instanceof HttpResponse && event.status == 200){
          event.body.status == 'error' || event.body.success == 'error'|| event.body.sucess == 'error'?this.showError(500,event.body):'';
          Observable.throw('error');
        }

        //正常操作,
        this.loading._state == 1 ? this.loading.dismiss() : undefined;
        return Observable.create(observer => observer.next(event));
      })
      .catch((res: HttpResponse<any>) => {  //只有链接报错才会触发,进行其他操作
        this.loading._state == 1 ? this.loading.dismiss() : undefined;
        switch (res.status) {
          case 400:
            this.showError(400,null);
            break;
          case 401:
            // 权限处理
            location.href = ''; // 重新登录
            break;
          case 404:
            this.showError(404,null);
            break;
          case 500:
            this.showError(500,null);
            break;
        }
        // 以错误的形式结束本次请求
        return Observable.throw(res);
        // return Observable.create(observer => observer.error(res));
      })
  }

  showError(status:number,evt){
    !evt || !evt.message?evt= {
      'message':'哎呀,服务器出错了!!!'
    }:'';
    let activeNav: NavController = this.appCtrl.getActiveNav(),
      message = '哎呀,页面找不到了!!!',
      canGoBack = activeNav.canGoBack();

    if(status == 500){
      message = evt.message;
    }else{

    }
    if(canGoBack){
      let confirm = this.alertCtrl.create({
        title: '错误提示',
        message: message,
        buttons: [
          // {
          //   text: "刷新",
          //   handler: () => {
          //
          //   }
          // },
          {
            text: "返回",
            handler: () => {
              activeNav.pop();
            }
          }

        ]
      });
      confirm.present();
    }else{

      activeNav.push(PageErrorPage,{
        msg:evt.message
      });
    }
  }
}
