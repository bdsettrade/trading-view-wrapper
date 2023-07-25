import { Component, OnInit } from '@angular/core';
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from 'src/assets/trading_view/charting_library';
import { UDFCompatibleDatafeed } from 'src/assets/trading_view/datafeeds/udf/src/udf-compatible-datafeed';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private _tvWidget: IChartingLibraryWidget | null = null;
  private isNormalize = false;

  ngOnInit() {
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        this.initOnReady();
      },
      false
    );
  }

  initOnReady() {
    console.log('[TradingView] initOnReady called');
    this._tvWidget = this.initialChartOptions();
    this._tvWidget.onChartReady(() => {
      console.log('[TradingView] onChartReady called');
      this.subscribeOnSymbolChanged();
    });
  }

  initialChartOptions() {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: 'AAPL',
      datafeed: new UDFCompatibleDatafeed(
        'https://demo-feed-data.tradingview.com'
      ),
      interval: '1D' as ResolutionString,
      container: 'tv_chart_container',
      library_path: 'assets/trading_view/charting_library/',
      locale: 'en',
      disabled_features: [
        'symbol_info',
        'header_widget',
        'go_to_date',
        'timezone_menu',
        'border_around_the_chart',
        'display_market_status',
      ],
      enabled_features: [
        'hide_image_invalid_symbol',
        'adaptive_logo',
        'iframe_loading_compatibility_mode',
      ],
      fullscreen: true,
      autosize: true,
      debug: true,
      theme: 'Dark',
    };

    return new widget(widgetOptions);
  }

  subscribeOnSymbolChanged() {
    this._tvWidget
      ?.chart()
      .onSymbolChanged()
      .subscribe(
        () => {},
        () => {
          const newSymbol = this._tvWidget?.chart().symbol();

          if (!newSymbol) return;

          console.log(newSymbol);
        }
      );
  }
}
