//判断2个日期是否相隔超过一年.true超过一年，false没有
let judgeYear = function(beginDate, endDate) {
  let year = beginDate.getFullYear()
  let month = beginDate.getMonth()+1
  let day = beginDate.getDate()
  let year1 = endDate.getFullYear()
  let month1 = endDate.getMonth()+1
  let day1 = endDate.getDate()
  //先比较年份
  let yearDiffer = year1-year
  if(yearDiffer==0){ //相同年份
    return false
  }else if(yearDiffer>0){
    if(yearDiffer==1){
      //先比较月份
      let monthDiffer = month1-month
      if(monthDiffer==0){
        //比较日期
        let dayDiffer = day1-day
        if(dayDiffer>0){
          return true
        }else{
          return false
        }
      }else if(monthDiffer<0){
        return false
      }else{
        return true
      }
    }else{
      return true
    }
  }else{ //特殊情况，传错了参数
    return false
  }
};
let myFormatDate = function(date) {
  let tempDate = new Date(date.getTime());
  tempDate.setHours(tempDate.getHours()-8);
  let seperator1 = "-";
  let year = tempDate.getFullYear();
  let month = tempDate.getMonth() + 1;
  let strDate = tempDate.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
};

let simpleDateFormat = function (date, fmt) {
        let o = {
            "M+" : date.getMonth() + 1, //月份
            "d+" : date.getDate(), //日
            "h+" : date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
            "H+" : date.getHours(), //小时
            "m+" : date.getMinutes(), //分
            "s+" : date.getSeconds(), //秒
            "q+" : Math.floor((date.getMonth() + 3) / 3), //季度
            "S" : date.getMilliseconds() //毫秒
        };
        let week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
export { myFormatDate, simpleDateFormat }
