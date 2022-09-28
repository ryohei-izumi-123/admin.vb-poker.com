// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: true,
  locale: {
    default: 'ja',
    fallback: 'ja',
  },
  sentry: {
    dsn:
      'https://2dc34537c5fc4309b47769c14074ca64@o919154.ingest.sentry.io/5998846',
    tracingOrigins: ['localhost'],
    debug: true,
    enabled: true,
    showDialog: true,
    logErrors: true,
    tracesSampleRate: 1.0,
  },
  line: { liffId: '1657199351-0Nnpk4xY', withLoginOnExternalBrowser: true },
  facebook: {
    appId: '449872630193838',
    cookie: true,
    xfbml: true,
    autoLogAppEvents: true,
    version: 'v10.0',
    locale: 'en_US',
  },
  google: {
    gapi: {
      clientId:
        '402738674166-ce723eaga3o267vcus2o6n02me1j6n52.apps.googleusercontent.com',
      scope: 'email',
      plugin_name: 'Vorpal Bunny',
    },
    map: {
      apiKey: 'AIzaSyApMOTPTt1h9GOYDDFXh3OUuvSl9Ldx_S4',
    },
    recaptcha: {
      script:
        '//www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit',
      siteKey: '6LfsmHYgAAAAAJltKvJi7SCTgoWQ9exstfzp7yAx',
      secret: '6LfsmHYgAAAAAPqUfRSVUa0r4oiY8_M7L47ALHMY',
      useGlobalDomain: false,
    },
    chart: {
      url: `//chart.apis.google.com/chart`,
    },
    storage: '',
  },
  contentful: {
    space: 'g42e3k09pe3b',
    accessToken: 'IuFPDkl8jF6vzpwuMdtsUnZSfV43bdO1hGVw9rWs3a0',
    timeout: 1500,
    retryOnError: false,
    retryLimit: 1,
  },
  hmr: false,
  version: '0.0.0',
  name: 'admin.vb-poker.com',
  api: {
    url: '',
    endpoint: {
      api: 'api',
      socket: 'socket',
      assets: 'assets',
    },
  },
  threshold: {
    requestTimeout: 15000,
    fileMaxSize: 100000000,
  },
  base_href: '/',
};
