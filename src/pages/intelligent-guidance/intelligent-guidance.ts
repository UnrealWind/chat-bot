import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,ToastController} from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { ConstantProvider } from "../../providers/constant/constant"
import {ChatBotProvider} from "../../providers/chat-bot/chat-bot";
import { IntelligentSearchPage} from "../intelligent-search/intelligent-search";
import * as $ from 'jquery';
import * as wx from 'jweixin-npm';
import set = Reflect.set;

@IonicPage({
  segment:"intelligent-guidance/:id",
})

@Component({
  selector: 'page-intelligent-guidance',
  templateUrl: 'intelligent-guidance.html',
})
export class IntelligentGuidancePage {
  //此次问答的id
  configurationId;
  //问题列表
  questionList;
  parameter;

  //别人传递过来的数据
  params;

  //在type为6的情况下的，控制疾病和检查收缩展开的参数
  diseaseShow;
  checkShow;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public Constant:ConstantProvider,
              public Http:HttpClient,
              private ChatBot:ChatBotProvider,
              public toastCtrl: ToastController) {

    //初始化一下
    this.questionList = [];
    this.parameter = {
      "id":"1",
      "params":''
    };

    this.diseaseShow = true;
    this.checkShow = true;

    //目前采取IonicPage segment获取的id必须是前一个页面push进来的object对象，这里先放着，等后台变化后再进行更改
    navParams.get("id")?this.parameter.id = navParams.get("id"):'';

    //在这个地方强行从url中截取对应的id
    this.parameter.id = window.location.href.indexOf('?')>0?
       window.location.href.split('?')[0].split('/')[window.location.href.split('?')[0].split('/').length-1]:window.location.href.split('/')[window.location.href.split('/').length-1];

    console.log(navParams.get("id"))
    if(window.location.href.indexOf('?')>0){
      var href = window.location.href.split('?')[1];
      href = href.replace(new RegExp("&",'g'),"&weiyi_");
      href ="weyi_"+href;
    }
    window.location.href.indexOf('?')>0?
      sessionStorage.setItem('params',window.location.href.split('?')[1]):'';

    this.parameter.params = sessionStorage.getItem("params");
    this.getConfigurationId();


  };

  //更多搜索回退回来获取session
  ionViewDidEnter(){
    var that = this;
    let answerList = JSON.parse(sessionStorage.getItem('answerList'));
    let targetQuestion=that.questionList[that.questionList.length-1];
    answerList && JSON.stringify(answerList)!="{}"&& targetQuestion?(function () {
      targetQuestion.answerList = answerList;
      targetQuestion.data.forEach(function (n,i) {
        targetQuestion['answerList'][n.value+n.kid]?(n.active = true,targetQuestion['answerList'][n.value+n.kid]=n):n.active = false;
      })
      targetQuestion.answerListKeys =Object.keys(targetQuestion['answerList']).reverse();
    })():'';
  }

  //获取整个问答的流程id
  getConfigurationId = function () {
    var that = this;
    let url = '';
    !that.parameter.params?url = this.Constant.BackstageUrl+'procedure/'+that.parameter.id:url = this.Constant.BackstageUrl+'procedure/'+that.parameter.id+'?'+that.parameter.params;
    that.Http.post(url,{})
      .subscribe((res)=>{
        res.data?($('title').text(res.data.title),that.configurationId = res.data.id,that.getQuestion(1,[])):'';
      })
  };

  //初始化
  ngOnInit(): void {

  };

  //获取下个问题，全部调这个。
  getQuestion = function (expect,data) {
    data.forEach(function (n,i) {
      delete n.id;
    });
    var that = this;
    that.Http.put(this.Constant.BackstageUrl+'procedure/'+that.configurationId+'/expect/'+expect+'/next',data)
      .subscribe((res)=>{

        res.data.data = JSON.parse(res.data.data);

        function jump() {
          let consultKey = null;
          consultKey = that.ChatBot.getQueryString(that.parameter.params,'consultKey');
          sessionStorage.setItem('params','');
          wx.miniProgram.navigateTo({url: '/pages/im/im?key='+consultKey});
          return false;
        }

        if(res.data.nodeType == 'weiyiSubmit' && res.data.data.code!=0){
          let toast = that.toastCtrl.create({
            message: res.data.data.message,
            duration: 2000,
            position: 'middle'
            /*showCloseButton: true,*/
          });
          toast.onDidDismiss(() => {
            jump();
          });
          toast.present();
        }else if (res.data.nodeType == 'weiyiSubmit' && res.data.data.code == 0){
          jump();
        }

        //第一个问题或许需要赋默认值
        res.data.nodeType =='attribute'||res.data.nodeType =='basic'||res.data.nodeType =='history'
        ||res.data.nodeType =='exam'||res.data.nodeType =='test'||res.data.nodeType =='allergy'?
          this.ChatBot.setInitData(res,that.parameter.params):'';
        that.questionList.push(res.data);

        console.log(that.questionList)
      })
  }

  //方便数据使用单独写了自己的方法
  checkRadio = function (opt,quest) {
    this.ChatBot.checkRadio(opt,quest);
  }

  checkCheckbox = function (opt,quest) {
    this.ChatBot.checkCheckbox(opt,quest);
  }

  //回答问题全部调用这个
  answer = function (question,index) {
    let that = this;
    let answer;
    switch (question.nodeType){
      case 'basic':
      case 'attribute':
      case 'exam':
      case 'test':
      case 'history':
      case 'allergy':
        answer = this.ChatBot.getBasicAnswer(question);
        question.answer = answer;
        that.getQuestion(question.nextHead,answer);
        break;
      case 'symptom':
      case 'related':
        answer = this.ChatBot.getListAnswer(question);
        question.answer = answer;
        that.getQuestion(question.nextHead,answer);
        break;
    }
  };

  //选择症状的时候增加active状态等等
  changeSymptom = function (options,question) {
    if(options.kid == '-1'){
      question['answerList'] = {};question['answerListKeys'] = {};
      question['answerList'][options.value+options.kid] = options
      this.answer(question,this.questionList.length-1);
      return;
    }

    !question['answerList']?question['answerList'] = {}:'';
    options.active?(delete question['answerList'][options.value+options.kid],options['active'] = false):
      (question['answerList'][options.value+options.kid] = options,options['active'] = true);
    question.answerListKeys =Object.keys(question['answerList']).reverse();

  };

  //搜索症状
  getSymptom = function (ev,index) {
    var that = this;
    let val;
    ev?val = ev.target.value ||'':val = '';
    that.Http.get(this.Constant.BackstageUrl+'procedure/'+that.configurationId+'/search?filter_LIKE_searchValue='+val,{})
      .subscribe((res)=>{
        if(!res.data){
          return;
        }
        res.data = JSON.parse(res.data);
        that.questionList[index].answerListKeys?res.data.forEach(function (n,i) {
          that.questionList[index].answerListKeys.forEach(function (ni,ii) {
            that.questionList[index].answerList[ni].kid == n.kid?(n['active']=true,that.questionList[index].answerList[ni]=n):'';
          });
        }):'';
        that.questionList[index].data = res.data;
        that.scrollKeyBoard();
      })
  }

  //键盘打开的时候强制滚动
  scrollKeyBoard = function ($event) {
    let scroll = $('page-intelligent-guidance .question-symptom:last').offset().top
      -$('page-intelligent-guidance .scroll-content').offset().top +$('page-intelligent-guidance .scroll-content').scrollTop();
      $('page-intelligent-guidance .scroll-content').animate({
        scrollTop:scroll
      }, 500);
  }

  //轻点编辑回到任意步骤
  back = function (index,question) {
    var that = this;
    this.Http.put(this.Constant.BackstageUrl+'procedure/'+this.configurationId+'/expect/'+question.head+'/next',[])
      .subscribe((res)=>{
        var length  = this.questionList.length - index-1;
        for (let i = 0;i<length;i++){
          this.questionList.pop();
        }
        this.questionList[this.questionList.length-1].answer = null;

        this.questionList[this.questionList.length-1].nodeType == 'symptom'?that.getSymptom(null,index):'';
      });
  }

  moreSymptom = function (index) {
    var that = this;
    this.navCtrl.push(IntelligentSearchPage,{
      configurationId:that.configurationId,
      answerList:that.questionList[index].answerList
    });
  }

  jump = function (opt) {
    opt.url?window.open(opt.url):'';
  }

  backWx = function (question) {
    var that = this;
    that.getQuestion(question.nextHead,[]);

  }

  showDesc = function (opt) {
    !opt['shown'] ? opt['shown'] = true : opt['shown'] = false;
  }

  showRemoteillDetail =function (mark) {
    this[mark+'Show'] = !this[mark+'Show'];
  }

}
