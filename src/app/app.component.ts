import { Component } from '@angular/core';

import { Observable } from 'rxjs';

// Constant
import { appPath } from './app-path.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * 給 Template 用的路由定義
   *
   * @memberof AppComponent
   */
  path = appPath;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.beginPath(); // 開始畫畫

  function draw(e){
    ctx.lineTo(e.clientX,e.clientY); // 移到滑鼠在的位置
    ctx.stroke(); // 畫畫
  }

  // 按下去滑鼠才開始偵測 mousemove 事件
  canvas.addEventListener('mousedown', function(e){
    ctx.moveTo(e.clientX, e.clientY); // 每次按下的時候必須要先把繪圖的點移到那邊，否則會受上次畫的位置影響
    canvas.addEventListener('mousemove', draw);
  });

  // 放開滑鼠就停止偵測
  canvas.addEventListener('mouseup', function(e){
    canvas.removeEventListener('mousemove', draw);
  });

  Observable.fromEvent(canvas, 'mousedown')
  .do(e => {
    ctx.moveTo(e.clientX, e.clientY)
  })
  .flatMap(e => Rx.Observable.fromEvent(canvas, 'mousemove')
      .takeUntil(Rx.Observable.fromEvent(canvas, 'mouseup'))
  )
  .subscribe(e => {
    draw(e);
  });

    function searchWikipedia (term) {
      return $.ajax({
          url: 'http://en.wikipedia.org/w/api.php',
          dataType: 'jsonp',
          data: {
              action: 'opensearch',
              format: 'json',
              search: term
          }
      }).promise();
  }

  function renderList (list) {
    $('.auto-complete__list').empty();
    $('.auto-complete__list').append(list.map(item => '<li>' + item + '</li>'))
  }

  Rx.Observable
  .fromEvent(document.querySelector('.auto-complete input'), 'input')
  .debounceTime(250)
  .map(e => e.target.value)
  .switchMap(value => {
    return Rx.Observable.from(searchWikipedia(value)).map(res => res[1])
  })
  .subscribe(value => {
    renderList(value);
  });
}
