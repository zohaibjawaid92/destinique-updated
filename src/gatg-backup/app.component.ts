import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    _gtmQueue: any[];
    _gtmLoaded: boolean;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private readonly gtmId = 'G-122QQMGN2V';
  title = 'New Destinique';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return; // ONLY run in browser
    // Track the initial page view
    // this.trackPageView(window.location.pathname);

    // Set up router-based page tracking
    // Initial page view is already tracked by index.html
    this.setupPageTracking();
  }

  private setupPageTracking(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navigationEnd = event as NavigationEnd;
        this.trackPageView(navigationEnd.urlAfterRedirects);
      });
  }

  private trackPageView(path: string): void {
    // This will either execute immediately or get queued
    if (typeof window.gtag === 'function') {
      window.gtag('config', this.gtmId, {
        page_path: path,
        page_title: document.title
      });
      console.log('Page view tracked:', path);
    }
  }

  // Event tracking - works whether GTM is loaded or queued
  public trackEvent(eventName: string, eventParams?: any): void {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  }

  private injectGtmScript(): void {
    // Only load on allowed domains
    const hostname = window.location.hostname;
    const allowedDomains = ['destinique.com', 'localhost'];
    const isDev = hostname.includes('dev.');

    if (!allowedDomains.includes(hostname) && !isDev) {
      console.log('GTM script injection skipped for:', hostname);
      return;
    }

    // Create and inject script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gtmId}`;

    // Configure GTM AFTER script loads
    script.onload = () => {
      this.configureGtm();
    };

    // Fallback in case onload doesn't fire
    script.onerror = () => {
      console.error('Failed to load GTM script');
    };

    document.head.appendChild(script);
    console.log('GTM script injected for:', hostname);
  }

  private configureGtm(): void {
    const hostname = window.location.hostname;

    // Double-check gtag exists
    if (typeof window.gtag !== 'function') {
      console.warn('gtag still not defined after script load');
      // Retry once
      setTimeout(() => this.configureGtm(), 100);
      return;
    }

    // Set timestamp and config
    window.gtag('js', new Date());
    window.gtag('config', this.gtmId, {
      send_page_view: false, // We handle manually
      debug_mode: hostname !== 'destinique.com'
    });

    console.log('GA4 configured via Dynamic Injection for:', hostname);
  }

  loadAnalytics() {
    const gaScript = document.createElement('script');
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-122QQMGN2V';
    gaScript.async = true;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { window.dataLayer.push(args); }
    gtag('js', new Date());
    gtag('config', 'G-122QQMGN2V');
  }

  loadFacebookPixel() {
    (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        if (n.callMethod) {
          n.callMethod.apply(n, arguments);
        } else {
          n.queue.push(arguments);
        }
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', '1706147529981140');
    window.fbq('track', 'PageView');
  }
}
