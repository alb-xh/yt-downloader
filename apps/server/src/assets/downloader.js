// ==UserScript==
// @name         Youtube downloader
// @version      1
// @description  Download youtube videos
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

const SERVER_BASE_URL = 'https://yt-downloader.apps.albanoxhafaj.com/api'
const APP_NAME = 'YT Downloader';
const SLEEP_BEFORE_EXECUTION = 5000;;
const TOKEN_LOCAL_STORAGE_KEY = 'yt-downloader-token';
const APPEND_AFTER_SELECTOR = '#sort-menu';
const DOWNLOAD_BUTTON_TEXT = 'SHKARKO';
const YT_VIDEO_URL_ID_PARAM = 'v';
const OK_RES_CODE = 200;
const NOT_AUTHORIZED_RES_CODE = 401;

const downloadButtonStyles = {
  'border': 'none',
  'color': 'white',
  'padding': '15px 32px',
  'text-align': 'center',
  'text-decoration': 'none',
  'display': 'inline-block',
  'font-size': '16px',
  'margin': '4px 10px',
  'cursor': 'pointer',
  'background-color': '#4CAF50',
};

const downloadState = {
  loading: false,
};

const Popups = (appName) => {
  const formatMessage = (msg) => [appName, msg].join(': ');
  const showPopup = (popup) => (msg) => popup(formatMessage(msg));

  return {
    prompt: showPopup(prompt),
    alert: showPopup(alert),
  };
};

const Storage = (key) => ({
  get: () => localStorage.getItem(key),
  set: (item) => {
    localStorage.setItem(key, item);
  },
  clear: () => localStorage.removeItem(key),
});

const ApiClient = ({
  baseUrl,
  token,
}) => {
  const authorizationHeader = { 'Authorization': `Bearer ${token}` };

  const validateRes = (res, expectedCode) => {
    if (res.status !== expectedCode) {
      throw new Error(res.status);
    }
  }

  return {
    getInfo: async (id) => {
      const res = await fetch(`${baseUrl}/video/${id}/info`, {
        headers: { ...authorizationHeader },
      });

      validateRes(res, OK_RES_CODE);
      return res.json();
    },
    getVideo: async (id) => {
      const res = await fetch(`${baseUrl}/video/${id}/download`, {
        headers: { ...authorizationHeader },
      });

      validateRes(res, OK_RES_CODE);
      return res.body;
    },
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getVideoId = (url) => new URL(url).searchParams.get(YT_VIDEO_URL_ID_PARAM);

const objStylesToInline = (objStyles) => Object
  .entries(objStyles)
  .map((entry) => entry.join(':'))
  .join(';')

const download = async ({
  tokenStorage,
  apiClient,
  popups,
}) => {
  if (downloadState.loading) {
    popups.alert('Nje shkarkim po ndodh momentalisht, te lutem prit!');
    return;
  };

  try {
    downloadState.loading = true;

    const videoId = getVideoId(location.href);
    if (!videoId) {
      throw new Error('Video id is missing!');
    }

    const { fileName } = await apiClient.getInfo(videoId);
    const fileHandler = await window.showSaveFilePicker({ suggestedName: fileName });

    const downloadStream = await apiClient.getVideo(videoId);
    const fileStream = await fileHandler.createWritable();

    await downloadStream.pipeTo(fileStream);
    popups.alert('Video u shkarkua!');
  } catch (error) {
    if (error.message == NOT_AUTHORIZED_RES_CODE) {
      tokenStorage.clear();
      popups.alert('Fjala sekrete nuk eshte e sakte, rifreshko faqen dhe vendos fjalen e sakte');
    } else {
      popups.alert('Patem nje problem, shkarkimi nuk eshte i mundur');
      throw error;
    }
  } finally {
    downloadState.loading = false;
  }
};

const addDownloadButton = ({
  tokenStorage,
  apiClient,
  popups,
  selector,
}) => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Wrong selector ${selector}`);

  const buttonElement = document.createElement('button');
  buttonElement.textContent = DOWNLOAD_BUTTON_TEXT;
  buttonElement.style.cssText = objStylesToInline(downloadButtonStyles);
  buttonElement.onclick = () => download({
    tokenStorage,
    apiClient,
    popups,
  });

  element.insertAdjacentElement('afterend', buttonElement);
}

const run = async () => {
  await sleep(SLEEP_BEFORE_EXECUTION);

  const popups = Popups(APP_NAME);
  const tokenStorage = Storage(TOKEN_LOCAL_STORAGE_KEY);

  let token = tokenStorage.get();
  if (!token) {
    token = popups.prompt("Fute fjalen sekrete");
    if (!token) {
      popups.alert('Nuk percaktove fjalen sekrete!');
      throw new Error('Token was not provided!');
    }

    tokenStorage.set(token);
  }

  const apiClient = ApiClient({
    baseUrl: SERVER_BASE_URL,
    token,
  });

  addDownloadButton({
    selector: APPEND_AFTER_SELECTOR,
    tokenStorage,
    apiClient,
    popups,
  });
}

(function() {
  'use strict';
  run();
})();