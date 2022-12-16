import Router from "next/router";
import NProgress from "nprogress";

let timer: NodeJS.Timeout;
let state: "LOADING" | "STOP" = "STOP";
let activeRequests = 0;
const delay = 250;

NProgress.configure({ showSpinner: false, parent: "#navbar-progressBar" });

function load() {
  if (state === "LOADING") {
    return;
  }

  state = "LOADING";

  timer = setTimeout(function () {
    NProgress.start();
  }, delay); // only show progress bar if it takes longer than the delay
}

function stop() {
  if (activeRequests > 0) {
    return;
  }

  state = "STOP";

  clearTimeout(timer);
  NProgress.done();
}

Router.events.on("routeChangeStart", load);
Router.events.on("routeChangeComplete", stop);
Router.events.on("routeChangeError", stop);

/**
 * A top loader that does not require any configuration
 *
 * @returns {JSX.Element}
 */
export const RouterProgressBar = (): JSX.Element => <></>;
