import "../styles/globals.css";
import { init } from '@amplitude/analytics-browser';
import Cookies from 'js-cookie';

export function reportWebVitals(metric) {
  Cookies.set(metric.name, metric.value);
}

function MyApp({ Component, pageProps }) {
  init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY);
  return <Component {...pageProps} />;
}

export default MyApp;
