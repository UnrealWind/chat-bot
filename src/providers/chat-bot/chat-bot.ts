import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantProvider } from "../../providers/constant/constant"

@Injectable()
export class ChatBotProvider {

  constructor(public Http: HttpClient,
              public Constant:ConstantProvider) {

  }

  checkRadio = function (opt,quest) {
    quest.options.forEach(function (n,i) {
      !quest['answer']?quest['answer'] = {}:'';
      quest['answer'][n.value] = false;
    });
    quest['answer'][opt.value] = opt;
  }

  checkCheckbox = function (opt,quest) {
    quest['answer'][opt.value]?quest['answer'][opt.value] = false:quest['answer'][opt.value] = opt;
  }

  setInitData = function (res,params) {
    var that = this;
    res.data.data.forEach(function (n,i) {
      n.relatedSymptomValues && n.relatedSymptomValues.length>0?n['options']=n.relatedSymptomValues:'';
      if(n.type == 'radio'){
        n['answer'] = {};
        n.options.forEach(function (ni,ii) {
          n.answer[ni.value] = false;
          ni.label = n.label;
        });
      }else if(n.type == 'smallText'){
        n['answer'] = {};
        n.options?n.options[0].label = n.label||'':'';
      }else if(n.type == 'checkbox'){
        n['answer'] = {};

        n.options.forEach(function (ni,ii) {
          n.answer[ni.value] = false;
          ni.label = n.label;
        });
      }
    });

    res.data.nodeType == 'basic' && res.data.resultUnits && params?(function () {
      let sex = that.getQueryString(params,'gender');
      let age = that.getQueryString(params,'age');
      res.data.data[0].options.forEach(function (n,i) {
        n.id == sex?res.data.data[0].answer[n.value] = n:'';
      });
      res.data.data[1].options[0].value = age;
    })():'';
    return res
  }

  getBasicAnswer = function (question) {
    let tarAnswer =[];
    question.data.forEach(function (n,i) {
      if(n.type == 'radio' || n.type == 'checkbox'){
        for(let i in n.answer){
          n.answer[i]?tarAnswer.push(n.answer[i]):'';
        }
      }else if(n.type == 'smallText'){
        n.options[0].value?tarAnswer.push(n.options[0]):'';
      }
    });
    return tarAnswer;
  }

  getListAnswer = function (question) {
    let tagAnswer = [];
    for(var key in question.answerList){
      tagAnswer.push(question.answerList[key]);
    };
    return tagAnswer;
  }

  answer = function () {

  }

   getQueryString = function(url,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if(url != null ){
      var r = url.substr(0).match(reg);
      if (r != null) {
          return decodeURI(r[2]);
        } 
      }
    return null;
  }
}
