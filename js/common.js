const getCookie = () => {

  let cookies = '';
  let cookieArray = new Array();
  let result = new Array();

  //Cookieを取得する
  cookies = document.cookie;

  //Cookieを配列に分割してJSONに変換する
  if (cookies) {
    cookieArray = cookies.split(';');

    cookieArray.forEach(data => {
      data = data.split('=');

      //data[0]: Cookieの名前（例では「user」）
      //data[1]: Cookieの値（例では「json」）

      result[data[0]] = JSON.parse(data[1]);
    });
  }
  return result;
}



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

const ID = 0;
const NAME = 1;
const BU = 2;
const DATE = 3;
const APPLY = 4;
const PRICE = 5;
const SET = 6;
const MEM = 7;


var cookie_data = getCookie();

for (let i = 0; i < csvArray.length; i++) {
  var row = csvArray[i];
  var block_div = document.createElement("div");
  block_div.setAttribute("id", "eve" + i);
  document.getElementById("content").appendChild(block_div);
  var eve_div = document.getElementById("eve" + i);

  // イベント名出力
  if (i == 0 || row[NAME] != csvArray[i - 1][NAME]) {
    var name_div = document.createElement("div");
    name_div.setAttribute("id", "name" + i);
    name_div.innerHTML = row[NAME];
    eve_div.appendChild(name_div);
  }

  // イベント日
  if (i == 0 || row[DATE] != csvArray[i - 1][DATE]) {
    var date_div = document.createElement("div");
    date_div.setAttribute("id", "date" + i);
    date_div.innerHTML = "＜" + row[DATE] + "＞";
    eve_div.appendChild(date_div);
  }

  // 部
  if (i == 0 || row[BU] != csvArray[i - 1][BU]) {
    var date_div = document.createElement("div");
    date_div.setAttribute("id", "bu" + i);
    date_div.innerHTML = row[BU];
    eve_div.appendChild(date_div);
  }

  // 応募期間
  if (i == 0 || row[APPLY] != csvArray[i - 1][APPLY]) {
    var apply_div = document.createElement("div");
    apply_div.setAttribute("id", "apply" + i);
    apply_div.innerHTML = row[APPLY];
    eve_div.appendChild(apply_div);
  }

  // メンバープルダウン
  // 動的に取得
  let memList = row.filter((elm, memIdx) => {
    return memIdx >= MEM;
  });

  var mem_div = document.createElement("div");
  mem_div.setAttribute("id", "mem" + i);

  //select要素を取得する
  var select_elm = document.createElement('select');
  var option_elm = document.createElement('option');
  option_elm.value = '';
  option_elm.textContent = 'メンバーを選択';
  select_elm.appendChild(option_elm);
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
  price_div.setAttribute("id", "price" + i);
  price_div.innerHTML = "￥" + row[PRICE];
  eve_div.appendChild(price_div);
  if (row[SET] != '') {
    var set_div = document.createElement("div");
    set_div.setAttribute("id", "set" + i);
    set_div.innerHTML = "※" + row[SET];
    price_div.appendChild(set_div);
  }

  // 個数
  var num_div = document.createElement("div");
  var num_down_elm = document.createElement("button");
  var num_input_elm = document.createElement("input");
  var num_up_elm = document.createElement("button");

  num_div.setAttribute("class", "count_num");
  num_down_elm.setAttribute("id", "down_bt" + i);
  num_down_elm.setAttribute("class", "count_btn");
  num_down_elm.innerHTML = "-";

  num_input_elm.setAttribute("id", "num_textbox" + i);
  num_input_elm.setAttribute("class", "num_textbox");
  num_input_elm.value = "0";
  num_up_elm.setAttribute("id", "up_bt" + i);
  num_up_elm.setAttribute("class", "count_btn");
  num_up_elm.innerHTML = "+";

  num_div.appendChild(num_down_elm);
  num_div.appendChild(num_input_elm);
  num_div.appendChild(num_up_elm);
  eve_div.appendChild(num_div);

  // イベントごとの合計出力
  var eve_total_div = document.createElement("div");
  var eve_total_span = document.createElement("span");
  eve_total_div.setAttribute("id", "eve_total" + i);
  eve_total_span.innerHTML = "合計 ￥0";
  eve_div.appendChild(eve_total_div);
  eve_total_div.appendChild(eve_total_span);

}

setCookieData(cookie_data);


(() => {
  //HTMLのid値を使って以下のDOM要素を取得
  var downbutton = document.querySelectorAll('.count_num');
  for (var i = 0; i < downbutton.length; i++) {
    downbutton[i].children[0].addEventListener('click', function () {
      if (this.parentElement.children[1].value >= 1) {
        this.parentElement.children[1].value--;
        makeTotalPrice();
      }
    }, false);
    downbutton[i].children[2].addEventListener('click', function () {
      this.parentElement.children[1].value++;
      makeTotalPrice();
    }, false);
    downbutton[i].children[1].addEventListener('change', function () {
      makeTotalPrice();
    }, false);
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
  dispTotal.innerHTML = "総合計 ￥" + total;

  save_array = [];
  var num_elm = document.getElementsByClassName('num_textbox');
  var pulldown_elm = document.querySelectorAll('select');

  var tmp_array = [];
  for (let index = 0; index < csvArray.length; index++) {
    tmp_array.push({ id: index, num: num_elm[index].value, member: pulldown_elm[index].value });
  }
  setCookie('jsondata', tmp_array);
}


function submit_tsv() {
  var output_array = [];
  var header = [
    'イベント名',
    '開催日',
    '部',
    '応募期間',
    '当落発表',
    '単価',
    'セット数',
    'メンバー',
    '枚数',
    '合計',
  ];
  output_array.push(header.join("\t"));
  var num_elm = document.getElementsByClassName('num_textbox');
  var pulldown_elm = document.querySelectorAll('select');

  for (let index = 0; index < csvArray.length; index++) {
    var tmp_array = [];
    tmp_array.push(csvArray[index][NAME]);
    tmp_array.push(csvArray[index][DATE]);
    tmp_array.push(csvArray[index][BU]);
    var oubo = csvArray[index][APPLY].substr(csvArray[index][APPLY].indexOf(':') + 1, csvArray[index][APPLY].indexOf('当落発表') - 5);
    tmp_array.push(oubo);
    var oubo = csvArray[index][APPLY].substr(csvArray[index][APPLY].lastIndexOf(':') + 1, csvArray[index][APPLY].lastIndexOf('当落発表') - 1);
    tmp_array.push(oubo);
    tmp_array.push(csvArray[index][PRICE]);
    tmp_array.push(csvArray[index][SET]);
    tmp_array.push(pulldown_elm[index].value);
    tmp_array.push(num_elm[index].value);
    // tmp_array.push(csvArray[index][PRICE] * num_elm[index].value); // todo
    tmp_array.push('=PRODUCT(INDIRECT("RC[-4]:RC[-1]",0))'); // todo
    var row_tsv = tmp_array.join("\t");

    output_array.push(row_tsv);
  }
  var tmp_array2 = [];
  for (let index = 0; index < header.length - 3; index++) {
    tmp_array2.push("");
  }
  tmp_array2.push("総合計");
  tmp_array2.push('=SUM(INDIRECT("R[-' + csvArray.length + ']C:R[-1]C",0))');
  tmp_array2.push('=SUM(INDIRECT("R[-' + csvArray.length + ']C:R[-1]C",0))');
  output_array.push(tmp_array2.join("\t"));

  output_textarea = output_array.join("\n");

  var textarea = document.querySelector('textarea[name="tsv_textarea"]');
  textarea.value = output_textarea;

}

// function scrollBottom() {
//   var trigger = document.getElementById('trigger');
//   var element = document.documentElement;
//   var bottom = element.scrollHeight - element.clientHeight;
//   window.scrollTo({ top: bottom, left: 0, behavior: 'smooth' });
// }

const setCookie = (name, json) => {


  let cookie = '';
  let expire = '';
  let period = '';

  //Cookieの保存名と値を指定
  cookies = name + '=' + JSON.stringify(json) + ';';

  //Cookieを保存するパスを指定
  cookies += 'path=/ ;';

  //Cookieを保存する期間を指定
  period = 7; //保存日数
  expire = new Date();
  expire.setTime(expire.getTime() + 1000 * 3600 * 24 * period);
  expire.toUTCString();
  cookies += 'expires=' + expire + ';';

  //Cookieを保存する
  document.cookie = cookies;
};

function setCookieData(cookie_data) {
  var num_elm = document.getElementsByClassName('num_textbox');
  var pulldown_elm = document.querySelectorAll('select');

  for (let index = 0; index < csvArray.length; index++) {
    if (cookie_data['jsondata'][index]['num'] != '') {
      num_elm[index].value = cookie_data['jsondata'][index]['num'];
    }
    if (cookie_data['jsondata'][index]['member']) {
      pulldown_elm[index].value = cookie_data['jsondata'][index]['member'];
    }
  }
}

