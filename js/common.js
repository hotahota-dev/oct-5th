// CSVファイルを取得
let csv = new XMLHttpRequest();
 
// CSVファイルへのパス
csv.open("GET", "eventData.csv", false);
 
// csvファイル読み込み失敗時のエラー対応
try {
  csv.send(null);
} catch (err) {
  console.log(err);
}
 
// 配列を定義
let csvArray = [];
 
// 改行ごとに配列化
let lines = csv.responseText.split(/\r\n|\n/);
 
// 1行ごとに処理
for (let i = 0; i < lines.length; ++i) {
  let cells = lines[i].split(",");
  if (cells.length != 1) {
    csvArray.push(cells);
  }
}
 
// コンソールに配列を出力
console.log(csvArray);

const ID = 0;
const NAME = 1;
const BU = 2;
const DATE = 3;
const APPLY = 4;
const PRICE = 5;
const SET = 6;
const MEM = 7;


for (let i = 0; i < csvArray.length; i++) {
  var row = csvArray[i];
  var block_div = document.createElement("div");
  block_div.setAttribute("id", "eve" + i);
  document.getElementById("content").appendChild(block_div);
  var eve_div = document.getElementById("eve"+i);

  // イベント名出力
  if (i==0 || row[ID] != csvArray[i-1][ID]) {
    var name_div = document.createElement("div");
    name_div.setAttribute("id", "name" + i);
    name_div.innerHTML = "<h1>"+row[NAME]+"<h1>";
    eve_div.appendChild(name_div);
  }
  
  // イベント日
  if (i==0 || row[DATE] != csvArray[i-1][DATE]) {
  var date_div = document.createElement("div");
  date_div.setAttribute("id", "date" + i);
  date_div.innerHTML = "<h2>"+row[DATE]+"<h2>";
  eve_div.appendChild(date_div);
  }
  
  // 部
  if (i==0 || row[BU] != csvArray[i-1][BU]) {
  var date_div = document.createElement("div");
  date_div.setAttribute("id", "bu" + i);
  date_div.innerHTML = "<h3>"+row[BU]+"<h3>";
  eve_div.appendChild(date_div);
  }

  // 応募期間
  var apply_div = document.createElement("div");
  apply_div.setAttribute("id", "apply" + i);
  apply_div.innerHTML = row[APPLY];
  eve_div.appendChild(apply_div);

  // メンバープルダウン
  // 動的に取得
  let memList = row.filter((elm, memIdx) => {
    return memIdx >= MEM;
  });

  var mem_div = document.createElement("div");
  mem_div.setAttribute("id", "mem" + i);

  //select要素を取得する
  var select_elm = document.createElement('select');
  memList.forEach(mem => {
    //option要素を新しく作る
    var option_elm = document.createElement('option');

    //option要素にvalueと表示名を設定
    option_elm.value = mem;
    option_elm.textContent = mem;

    //select要素にoption要素を追加する
    select_elm.appendChild(option_elm);
  });
  eve_div.appendChild(select_elm);

  // 値段
  var price_div = document.createElement("div");
  price_div.setAttribute("id", "name" + i);
  price_div.innerHTML = "￥" + row[PRICE];
  eve_div.appendChild(price_div);
  
  // 個数
  var num_div = document.createElement("div");
  var num_down_elm = document.createElement("button");
  var num_input_elm = document.createElement("input");
  var num_up_elm = document.createElement("button");
  
  num_div.setAttribute("class", "count_num");
  num_down_elm.setAttribute("id", "down_bt" + i);
  num_down_elm.setAttribute("class", "down_bt");
  num_down_elm.innerHTML = "-";

  num_input_elm.setAttribute("id", "num_textbox" + i);
  num_input_elm.value = "0";
  num_up_elm.setAttribute("id", "up_bt" + i);
  num_up_elm.setAttribute("class", "up_bt");
  num_up_elm.innerHTML = "+";
  
  num_div.appendChild(num_down_elm);
  num_div.appendChild(num_input_elm);
  num_div.appendChild(num_up_elm);
  eve_div.appendChild(num_div);

  // イベントごとの合計出力
  var eve_total_elm = document.createElement("div");
  eve_total_elm.setAttribute("id", "eve_total" + i);
  eve_div.appendChild(eve_total_elm);
}



(() => {
    //HTMLのid値を使って以下のDOM要素を取得
    var downbutton = document.querySelectorAll('.count_num');
    for(var i = 0; i < downbutton.length; i++){
      downbutton[i].children[0].addEventListener('click',function(){
        if(this.parentElement.children[1].value >= 1) {
          this.parentElement.children[1].value--;
          makeTotalPrice();
        }
      },false);
      downbutton[i].children[2].addEventListener('click',function(){
          this.parentElement.children[1].value++;
          makeTotalPrice();
      },false);
  }
 
  })();

function funcLoad() {
  // makePull();
  // makeTotalPrice();
}

function makeTotalPrice() {
  total = 0;
  for (let i = 0; i < csvArray.length; i++) {
    tmp_total = 0;
    var num = document.getElementById('num_textbox' + i);
    tmp_total = csvArray[i][PRICE] * num.value;
    document.getElementById('eve_total' + i).innerHTML = "合計 ￥" + tmp_total;
    
    total = total + tmp_total;
  }

  var dispTotal = document.getElementById('total_price');
  dispTotal.innerHTML = total;
}

  function makePull() {
    //select要素を取得する
    // var selectFoodName = document.getElementById('food-name');
    
    // memberArr.forEach(mem => {

    //   //option要素を新しく作る
    //   var option1 = document.createElement('option');

    //   //option要素にvalueと表示名を設定
    //   option1.value = mem;
    //   option1.textContent = mem;

    //   //select要素にoption要素を追加する
    //   selectFoodName.appendChild(option1);
    // });
  }