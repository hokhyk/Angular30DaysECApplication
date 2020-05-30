import { MapOperator } from './../../node_modules/@angular-devkit/schematics/node_modules/rxjs/src/internal/operators/map';
import { Config } from './../../node_modules/codelyzer/angular/config.d';
import { Component, NgZone, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Observable, pipe, switchMap, map, combineLatest, exhaustMap, startWith } from 'rxjs';

// Constant
import { appPath } from './app-path.const';
import { ConfigService } from './config.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute, private httpClient: HttpClient,
    ) {
    console.log(this.configService.config);
  }

  postData$: Observable<any>;
  data$: Observable<any>;
  products$ : Observable<any>;
  filterChange$ : Observable<any>;
  sortChange$ : Observable<any>;
  pageChange$ : Observable<any>;

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

    this.postData$ = this.route.params.pipe(
      switchMap(params => this.httpClient
        .get(`.../post/${params['id']}`).pipe(
          map(post => ({ id: params['id'], post: post }))
      )),
      switchMap(post => this.httpClient
        .get(`.../comments/${post.id}`).pipe(
          map(comments => Object.assign(post, { comments: comments }))
      ))
    );

    const posts$ = this.httpClient.get('.../posts');
    const tags$ = this.httpClient.get('.../tags');

    this.data$ = combineLatest(posts$, tags$).pipe(
      map(([posts, tags]) => ({posts: posts, tags: tags}))
    );

    this.products$ = combineLatest(
      this.filterChange$.pipe(startWith('')),
      this.sortChange$.pipe(startWith({})),
      this.pageChange$.pipe(startWith({}))
    )
    .pipe(
      exhaustMap(([keyword, sort, page]) =>
        this.httpClient
          // .get(`.../products/?keyword=${keyword}&sort=${sort}&page=${page}`)
          .post(`.../products`, { keyword: keyword, sort: sort, page: page}))
      )
    );

    data$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), // 當 300 毫秒沒有新資料時，才進行搜尋
      distinctUntilChanged(), // 當「內容真正有變更」時，才進行搜尋
      filter(keyword => keyword.length >= 3), // 當關鍵字大於 3 個字時，才搜尋
      switchMap(keyword => this.httpClient.get(`.../?q=${keyword}`))
    );

    this.httpClient.get(`.../posts`).pipe(
      tap(data => {
        if(data.length === 0) {
          // 主動丟出錯誤
          throwError('no data')
        }
      }),
      catchError(error => {
        console.log(error);
        return of([]);
      })
    );

    this.isLoading = true; // 進入讀取中狀態
    this.httpClient.get(`.../posts`).pipe(
      finalize(() => {
        // 不管中間程式遇到任何錯誤，一定會進入 finalize 裡面
      this.isLoading = false;
      });
)


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
