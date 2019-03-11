/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')

var router = express.Router()

router.put('/procedure/:configurationId', function(req, res, next) {
  configurationId = req.query.configurationId
  /*patiId = req.body.patiId*/

  var data = mockjs.mock({
    "data": {
      "id": 2,
      "executables": [
        {
          "no": "1"
        },
        {
          "no": "2"
        },
        {
          "no": "3"
        },
        {
          "no": "4"
        }
      ],
      "currentExecuter": {
        "no": "2"
      },
      "head": 1,
      "maxHead": 4,
      "forceExitNumber": 10,
      "procedureNodeResultId": null,
      "questionGroupId": 1,
      "remoteUrl": ""
    },
    "status": "ok",
    "description": "数据请求成功"
  });
  res.json(data)
});

router.get('/procedure/:procedureId/info', function(req, res, next) {
  procedureId = req.query.procedureId
  /*patiId = req.body.patiId*/

  var data = mockjs.mock({
    "data": [{
      "id": 1,
      "name": "sex",
      "label": "请选择您的性别",
      "options": [{
        "id": 1,
        "label": "男",
        "questionId": 1
      }, {
        "id": 2,
        "label": "女",
        "questionId": 1
      }],
      "type": "单选"
    }, {
      "id": 2,
      "name": "age",
      "label": "请选择您的年龄",
      "options": [{
        "id": 3,
        "label": "0-6岁",
        "questionId": 2
      }, {
        "id": 4,
        "label": "7-15岁",
        "questionId": 2
      }, {
        "id": 5,
        "label": "16-35岁",
        "questionId": 2
      }, {
        "id": 6,
        "label": "36-60岁",
        "questionId": 2
      }, {
        "id": 7,
        "label": "60岁以上",
        "questionId": 2
      }],
      "type": "单选"
    }],
    "status": "ok",
    "description": "数据请求成功"
  });
  res.json(data)
})

module.exports =  router
