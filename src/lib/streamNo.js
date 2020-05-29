import Vue from 'vue'

function mathRandom () {
  var num = '';
  for (var i = 0; i < 6; i++) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

function streamNo () {
  var myDate = new Date();
  var myYear = myDate.getFullYear();
  var myMonth = myDate.getMonth() + 1;
  var myDay = myDate.getDate();
  var myHour = myDate.getHours();
  var myMinute = myDate.getMinutes();
  var mySecond = myDate.getSeconds();
  if (myMonth < 10) {
    myMonth = '0' + myMonth
  } else if (myDay < 10) {
    myDay = '0' + myDay
  } else if (myHour < 10) {
    myHour = '0' + myHour
  } else if (myMinute < 10) {
    myMinute = '0' + myMinute
  } else if (mySecond < 10) {
    mySecond = '0' + mySecond
  }
  var streamcombo = 'PAAS' + myYear + myMonth + myDay + myHour + myMinute + mySecond + mathRandom();
  return streamcombo
}

Vue.prototype.$streamNo = streamNo;
