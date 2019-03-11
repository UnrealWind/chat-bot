import { Component,Input} from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { ConstantProvider } from "../../providers/constant/constant"

@IonicPage()
@Component({
  selector: 'page-intelligent-search',
  templateUrl: 'intelligent-search.html',
})
export class IntelligentSearchPage {
  configurationId;
  treeData;
  trunkData;
  answerList;
  searchList;
  searchVal;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public Constant:ConstantProvider,
              public Http:HttpClient) {
    this.configurationId = this.navParams.data.configurationId;
    this.treeData = [];
    this.trunkData = [];
    this.searchList = [];
    this.searchVal = '';
    this.navParams.data.answerList?this.answerList = this.navParams.data.answerList
      :this.answerList = {};
  }

  ngOnInit(): void {
    this.getTree();
  }

  getTree = function () {
    var that = this;
    that.Http.get(this.Constant.BackstageUrl+'procedure/'+that.configurationId+'/tree',{})
      .subscribe((res)=>{
        if(!res.data){
          return;
        }
        that.treeData = JSON.parse(res.data);
        that.changeChunk(that.treeData[0]);
        that.treeData[0]['active'] = true;
      })
  }

  changeChunk = function (opt) {
    var that = this;
    this.treeData.forEach(function (n,i) {
      n['active'] = false;
    });
    opt['active'] = true;
    opt.childs.forEach(function (n,i) {
      n['active'] = false;
      for(var key in that.answerList){
        that.answerList[key].kid == n.kid ?n['active'] = true:'';
      }
    })
    this.trunkData = opt.childs
  }

  checkOptions = function (opt) {
    var that = this;
    opt.active?opt.active = !opt.active:opt.active = true;
    !opt.active?(function () {
      delete that.answerList[opt.value+opt.kid]
      ;
    })():that.answerList[opt.value+opt.kid] = opt;
  }

  back = function () {
    var that = this;
    sessionStorage.setItem('answerList','{}')
    this.navCtrl.pop();
  }

  confirm = function () {
    var that = this;
    sessionStorage.setItem('answerList',JSON.stringify(that.answerList))
    this.navCtrl.pop();
  }

  getSymptom = function (ev) {
    var that = this;
    that.searchVal = ev.target.value;
    that.Http.get(this.Constant.BackstageUrl+'procedure/'+that.configurationId+'/search?filter_LIKE_searchValue='+that.searchVal,{})
      .subscribe((res)=>{
        res.data = JSON.parse(res.data);
        res.data.forEach(function (n,i) {
          for(var key in that.answerList){
            that.answerList[key].kid == n.kid ?n['active'] = true:'';
          }
        })
        that.searchList= res.data;

      })
    that.searchVal == ''?that.changeChunk({childs:that.trunkData}):'';

  }

}
