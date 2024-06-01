fetchData();
setInterval(fetchData, 3000); //三秒刷新一次

function fetchData() {
  var myHeaders = new Headers();
  myHeaders.append("Host", "api.jdjygold.com");
  myHeaders.append("Accept", "application/json, text/plain, */*");
  myHeaders.append("Sec-Fetch-Site", "same-site");
  myHeaders.append("Accept-Language", "zh-CN,zh-Hans;q=0.9");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  myHeaders.append("Origin", "https://m.jdjygold.com");
  myHeaders.append("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)");
  myHeaders.append("Referer", "https://m.jdjygold.com/");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Sec-Fetch-Dest", "empty");
  
  var formdata = new FormData();
  formdata.append("reqData", "{}");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  fetch("https://api.jdjygold.com/gw/generic/hj/h5/m/latestPrice", requestOptions).then(response => response.json()).then(result => {
    if (result.success) {
      //今日开盘价
      document.getElementById('yesterdayPrice').innerText = result.resultData.datas.yesterdayPrice;
      //数据更新时间
      document.getElementById('time').innerText = transformTime(result.resultData.datas.time);

      var upAndDownAmt = result.resultData.datas.upAndDownAmt;  //今日跌幅金额
      var upAndDownAmtElement = document.getElementById('upAndDownAmt');  //今日跌幅金额
      var upAndDownRateElement = document.getElementById('upAndDownRate');  //今日跌幅比例
      var priceElement = document.getElementById('price');  //实时价格

      // 移除之前可能存在的类  
      upAndDownAmtElement.classList.remove('price-up', 'price-down');  
      upAndDownRateElement.classList.remove('price-up', 'price-down');  
      priceElement.classList.remove('price-up', 'price-down'); 
      
      // 根据upAndDownAmt的值添加相应的类  
      if (upAndDownAmt > 0) {  
        upAndDownAmtElement.classList.add('price-up');  
        upAndDownRateElement.classList.add('price-up');  
        priceElement.classList.add('price-up');  
      } else if (upAndDownAmt < 0) {  
        upAndDownAmtElement.classList.add('price-down');  
        upAndDownRateElement.classList.add('price-down');  
        priceElement.classList.add('price-down');  
      }
      upAndDownAmtElement.innerText = upAndDownAmt;  
      upAndDownRateElement.innerText = result.resultData.datas.upAndDownRate;
      priceElement.innerText = result.resultData.datas.price;
    } else {
        console.error('获取数据失败');
    }}).catch(error => console.log('error', error));
}

function transformTime(timestampString) {
  // 将字符串转换为数字  
  var timestamp = parseInt(timestampString, 10); // 使用基数10来确保正确解析  
  // 检查时间戳是否有效（非NaN）
  if (!isNaN(timestamp)) {  
    // 创建一个新的Date对象  
    var date = new Date(timestamp);  
    // 使用Date对象的方法来格式化日期和时间  
    var formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' +  ('0' + date.getMinutes()).slice(-2) + ':' +  ('0' + date.getSeconds()).slice(-2);  
    return formattedDate;  
  } else { 
    return '错误：' + timestampString;  
  }
}