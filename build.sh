#!/bin/bash

##先执行这个命令添加到platform中
ionic platform add browser/android/ios

## 后续更新的话需要重新build，执行该脚本即可
ionic build --prod --aot --minifyjs --minifycss --optimizejs

