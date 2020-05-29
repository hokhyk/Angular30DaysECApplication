import { Config } from './../../node_modules/codelyzer/angular/config.d';
import { Component, NgZone, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';

// Constant
import { appPath } from './app-path.const';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  /**
   * 給 Template 用的路由定義
   *
   * @memberof AppComponent
   */
  path = appPath;
  index = 0;
  constructor(
    private configService: ConfigService,
    @Inject(CONFIG_TOKEN) private config: Config,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
    ) {
    console.log(this.configService.config);
  }

  ngOnInit() {
    this.zone.onUnstable.subscribe(() => { console.log('有事件發生了') });
    this.zone.onStable.subscribe(() => { console.log('事件結束了') });

    this.zone.runOutsideAngular(() => {
      // 進行跟 UI 無關的複雜運算: 另外一個常用的是 runOutsideAngular() 方法，當我們在會觸發變更偵測的狀態下想要執行一些跟畫面無關的程式時(例如某個數字加一、複雜的運算、或是呼叫一個 API 等等，但不會影響畫面)，可以把程式放在 runOutsideAngular()，來避免發生變更偵測造成的效能耗損
    });

    this.zone.run(() => {
      this.index++;
      //跟 runOutsideAngular 相反，如果在程式中「不小心」脫離了 Angular 變更偵測的範圍，像是使用 jQuery 或其他第三方與 DOM 操作有關的套件時，很容易不小心就脫離變更偵測了，這時候可以用 run() 方法來讓程式回到 Angular 變更偵測內。
    });

    this.changeDetectorRef.markForCheck();
  }

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
