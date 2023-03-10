import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {

    /*

const getDistrictUrls = async (zip) => {
  const districtUrls = await StudentVue.findDistricts(zip);
  console.log(districtUrls);
};

const getApproximateZip = async () => {
  const res = await fetch(`https://ipapi.co/json/`);
  const data = await res.json();
  console.log(data);
  getDistrictUrls(data.postal);
};
getApproximateZip();*/
const xmlToJSON = function () { this.version = "1.3.4"; var e = { mergeCDATA: !0, grokAttr: !0, grokText: !0, normalize: !0, xmlns: !0, namespaceKey: "_ns", textKey: "value", valueKey: "value", attrKey: "_attr", cdataKey: "_cdata", attrsAsObject: !0, stripAttrPrefix: !0, stripElemPrefix: !0, childrenAsArray: !0 }, t = new RegExp(/(?!xmlns)^.*:/), r = new RegExp(/^\s+|\s+$/g); return this.grokType = function (e) { return /^\s*$/.test(e) ? null : /^(?:true|false)$/i.test(e) ? "true" === e.toLowerCase() : isFinite(e) ? parseFloat(e) : e }, this.parseString = function (e, t) { return this.parseXML(this.stringToXML(e), t) }, this.parseXML = function (a, n) { for (var s in n) e[s] = n[s]; var l = {}, i = 0, o = ""; if (e.xmlns && a.namespaceURI && (l[e.namespaceKey] = a.namespaceURI), a.attributes && a.attributes.length > 0) { var c = {}; for (i; i < a.attributes.length; i++) { var u = a.attributes.item(i); m = {}; var p = ""; p = e.stripAttrPrefix ? u.name.replace(t, "") : u.name, e.grokAttr ? m[e.valueKey] = this.grokType(u.value.replace(r, "")) : m[e.valueKey] = u.value.replace(r, ""), e.xmlns && u.namespaceURI && (m[e.namespaceKey] = u.namespaceURI), e.attrsAsObject ? c[p] = m : l[e.attrKey + p] = m } e.attrsAsObject && (l[e.attrKey] = c) } if (a.hasChildNodes()) for (var y, d, m, h = 0; h < a.childNodes.length; h++)4 === (y = a.childNodes.item(h)).nodeType ? e.mergeCDATA ? o += y.nodeValue : l.hasOwnProperty(e.cdataKey) ? (l[e.cdataKey].constructor !== Array && (l[e.cdataKey] = [l[e.cdataKey]]), l[e.cdataKey].push(y.nodeValue)) : e.childrenAsArray ? (l[e.cdataKey] = [], l[e.cdataKey].push(y.nodeValue)) : l[e.cdataKey] = y.nodeValue : 3 === y.nodeType ? o += y.nodeValue : 1 === y.nodeType && (0 === i && (l = {}), d = e.stripElemPrefix ? y.nodeName.replace(t, "") : y.nodeName, m = xmlToJSON.parseXML(y), l.hasOwnProperty(d) ? (l[d].constructor !== Array && (l[d] = [l[d]]), l[d].push(m)) : (e.childrenAsArray ? (l[d] = [], l[d].push(m)) : l[d] = m, i++)); else o || (e.childrenAsArray ? (l[e.textKey] = [], l[e.textKey].push(null)) : l[e.textKey] = null); if (o) if (e.grokText) { var x = this.grokType(o.replace(r, "")); null !== x && void 0 !== x && (l[e.textKey] = x) } else e.normalize ? l[e.textKey] = o.replace(r, "").replace(/\s+/g, " ") : l[e.textKey] = o.replace(r, ""); return l }, this.xmlToString = function (e) { try { return e.xml ? e.xml : (new XMLSerializer).serializeToString(e) } catch (e) { return null } }, this.stringToXML = function (e) { try { var t = null; return window.DOMParser ? t = (new DOMParser).parseFromString(e, "text/xml") : (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = !1, t.loadXML(e), t) } catch (e) { return null } }, this }.call({}); "undefined" != typeof module && null !== module && module.exports ? module.exports = xmlToJSON : "function" == typeof define && define.amd && define(function () { return xmlToJSON });
global.xmlToJson = xmlToJSON;

class Api {
  constructor (client) {
      this.username = client?.username;
      this.password = client?.password;
  }

  checkCache(method) {
    let cachedData = localStorage.getItem(method);
    if (cachedData) {
      return [JSON.parse(cachedData), localStorage.getItem('last')]
    }
    return [null, localStorage.getItem('last')]
  }

  cacheResponse(method, data, storeLastTime) {
    localStorage.setItem(method, JSON.stringify(data));

    let lastTime = localStorage.getItem('last');

    if (method == 'login test' || !lastTime || storeLastTime) {
      lastTime = dayjs().unix();
      localStorage.setItem('last', lastTime);
    }

    return [data, lastTime];
  }

  async call (method) {
    console.log(`calling method: ${method} with `, {
      username: this.username,
      password: this.password
    })
      let raw = `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
              <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                  <userID>${this.username}</userID>
                  <password>${this.password}</password>
                  <validateErrors>true</validateErrors>
                  <skipLoginLog>0</skipLoginLog>
                  <parent>0</parent>
                  <webServiceHandleName>PXPWebServices</webServiceHandleName>
                  <paramStr>&lt;Parms&gt;&lt;childIntId&gt;0&lt;/childIntId&gt;&lt;/Parms&gt;</paramStr>
                  <methodName>${method}</methodName>
              </ProcessWebServiceRequest>
          </soap:Body>
      </soap:Envelope>
      `
      try {
          const res = await fetch("https://mn-mvps-psv.edupoint.com/Service/PXPCommunication.asmx?", {
              method: 'POST',
              body: raw,
              headers: {
                  'Content-Type': 'text/xml',
              }
          });
          const xml = await res.text();
  
          let xmlJSON = xmlToJSON.parseString(xml, {
            attrsAsObject: false,
            attrKey: '',
            textKey: 'value', 
            valueKey: 'value',
            childrenAsArray: false,
          });

  
          let xmlBody = xmlJSON.Envelope.Body.ProcessWebServiceRequestResponse.ProcessWebServiceRequestResult.value
          const info = xmlToJSON.parseString(xmlBody);

          return [info, null]; 
      } catch (error) {
          console.error(error);
          return [null, error];
      }
  }
}

const API = new Api();

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);


const populateSignInAsButton = (username, shouldStoreNewCacheTime) => {
  const signInAsButton = document.getElementById('signInAs');

  signInAsButton.classList.remove('hide');
  signInAsButton.innerHTML = `Sign in as ${username}`;

  signInAsButton.addEventListener('click', async (e) => {
    signInAsButton.classList.add('loading')
    signInAsButton.innerHTML = 'loading...'
    console.log('awaiting init via signInAsButton')
    let g = await initDashboard(shouldStoreNewCacheTime); 
  })
}

const checkExistingUser = async () => {
  let LCC = localStorage.getItem('lastCachedCredentials') ? JSON.parse(localStorage.getItem('lastCachedCredentials')) : null;
  let hoursSinceLastCache = dayjs().diff(dayjs(localStorage.getItem('last'), 'X'), 'hour');
  let minutesSinceLastCache = dayjs().diff(dayjs(localStorage.getItem('last'), 'X'), 'minute');
  
  if (LCC && !LCC.error && hoursSinceLastCache < 1) {
    console.log(LCC, hoursSinceLastCache);

    API.username = LCC.username;
    API.password = LCC.password;

    let shouldStoreNewCacheTime = false;
    if (minutesSinceLastCache > 1) {
      localStorage.removeItem('Gradebook');
      shouldStoreNewCacheTime = true;
    } 
    console.log({minutesSinceLastCache})

    populateSignInAsButton(API.username, shouldStoreNewCacheTime)
  }
}

const login = async () => {
  return API.call('login test');
};

const handleSignInResponse = (e, response) => {
  let email = document.getElementById('email');
  let password = document.getElementById('password');

  if (response["RT_ERROR"]["STACK_TRACE"].value.includes('login test is not a valid method')) {
    e.target.innerHTML = 'loading data...'
    initDashboard();

    localStorage.setItem('lastCachedCredentials', JSON.stringify({
      username: API.username,
      password: API.password,
    }))
  } else {
    e.target.classList.remove("loading");
    e.target.innerHTML = "Sign in";
    email.classList.add("error");
    password.classList.add("error");

    localStorage.setItem('lastCachedCredentials', JSON.stringify({
      username: API.username,
      password: API.password,
      error: true
    }))
  }
}

const signInHandler = async (e) => {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  if (email.value.length > 3 && password.value.length > 3) {
    e.target.classList.add("loading");
    e.target.innerHTML = "logging in...";

    API.username = email.value;
    API.password = password.value;

    let response;
    let [cachedResponse, dateOfCachedResponse] = API.checkCache('login test');
    if (cachedResponse) {
      let LCC = localStorage.getItem('lastCachedCredentials') ? JSON.parse(localStorage.getItem('lastCachedCredentials')) : null;
      if (LCC && LCC.username == API.username && LCC.password == API.password) {
        let minutesSinceLastCache = dayjs().diff(dayjs(dateOfCachedResponse, 'X'), 'minute');
        if (minutesSinceLastCache < 1) {
          console.log('cached login response:', [cachedResponse, dateOfCachedResponse]);
          response = cachedResponse;
          // IF CURRENT CREDS MATCH CACHED 
         // initDashboard();
  
          handleSignInResponse(e, response)
  
  
          return;
        } 
      }
    } 

    localStorage.clear();
    const [loginResponse, error] = await login();
    response = loginResponse;
    API.cacheResponse('login test', response);
    console.log('login response', response);

    handleSignInResponse(e, response)
  } else {
    console.warn("hyuh", email.value, password.value);
  }
};

document.getElementById("login").addEventListener("click", signInHandler);

const inputLoginHandler = (e) => {
  e.currentTarget.classList.remove("error");
};
document.getElementById("email").addEventListener("input", inputLoginHandler);
document
  .getElementById("password")
  .addEventListener("input", inputLoginHandler);

document.querySelector(".about").addEventListener("click", (e) => {
  document.querySelector(".why").scrollIntoView({
    behavior: "smooth"
  });
});


const initDashboard = async (storeCachedTime=false) => {
    let gradebook;
    let [cachedResponse, dateOfCachedResponse] = API.checkCache('Gradebook');
    if (cachedResponse) {
      gradebook = cachedResponse;
    } else {
      const [gradebookResponse, error2] = await API.call('Gradebook');
      gradebook = gradebookResponse.Gradebook;
      API.cacheResponse('Gradebook', gradebook, storeCachedTime);
    }

    console.log({gradebook});

    gradebook.Courses.Course.forEach(course => {
      addLittleCourseCard(course);
      addLargeCourseCard(course);
      addCourseSlider(course);
    });

    let initialDiff;
    if (window.innerWidth < 600) {
      initialDiff = dayjs().subtract(4, 'week');
    } else {
      initialDiff = dayjs().subtract(4, 'week');
    }

    cumulativeGradePointAverageGraph(gradebook.Courses.Course, initialDiff, 'day');

    document.getElementById("app").classList.add("hide");
    document.getElementById("dashboard").classList.remove("hide");

    let littleCourseCards = document.querySelectorAll('.little-course-card');
    littleCourseCards.forEach((c, i) => {
      setTimeout(() => {
        c.classList.remove('hide');
      }, (i * 100) + 50)
    });

    setTimeout(() => {
      document.querySelector(".main-card").classList.remove("hide");
      document.querySelector(".sub-card").classList.remove("hide");
    }, 300)


    return gradebook;
    //const [studentInfo, error1] = await API.call('StudentInfo');
    //console.log(studentInfo);
}

const precision = (a) => {
  var e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
}
  
const littleCourseCardHandler = (e) => {
  console.log(e.currentTarget);

  document.querySelector('.top-bar').value = 'grades';
  document.querySelector('.top-bar').dispatchEvent(new Event('input', {bubbles:true}));

  let selectedCourseId = e.currentTarget.dataset.name;
  let selectedCourseButton = document.querySelector(`.course-slider[id="${selectedCourseId}"]`);
  selectedCourseButton.dispatchEvent(new Event('click', {bubbles:true}));
  
  let sliderWrapper = document.querySelector(`.courses-slider-wrapper`)
  sliderWrapper.scrollLeft = 0;

  let buttonRect = selectedCourseButton.getBoundingClientRect();
  console.log(buttonRect);
  sliderWrapper.scrollLeft = buttonRect.left - 10;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const addLittleCourseCard = (course) => {
    let courseName = course.Title.value;
    let courseNameTrim = course.Title.value.match(/^[^(]*/)[0].trim();
    let coursePeriod = course.Period.value;
    let courseGrade = course.Marks.Mark.CalculatedScoreString.value;
    let courseGradeRaw = course.Marks.Mark.CalculatedScoreRaw.value;

    if (precision(courseGradeRaw) == 0) {
      courseGradeRaw = courseGradeRaw.toFixed(1);
    }

    const littleGrid = document.querySelector('.little-grid');
    const card = Object.assign(document.createElement('button'), {
        className: 'little-course-card strip-button-styles hide',
        innerHTML: `
            <div class="course-info"> 
              <div class="course-name">${courseNameTrim}</div>
              <div class="course-period">Period ${coursePeriod}</div>
            </div>
            <div class="grade">
                <span class="grade-value">${courseGrade}</span>
                <span class="grade-raw">${courseGradeRaw}</span>
            </div>
        `,
        tabIndex: 0
    });

    if (courseGrade == 'N/A') {
        card.classList.add('NA')
    }

    card.dataset.name = courseName;
    card.onclick = littleCourseCardHandler;

    littleGrid.appendChild(card);
}


const getBackgroundAndColorFromValue = (decOrPercent) => {
  let reverse;

  if (decOrPercent.length) {
    reverse = 100 - decOrPercent.replace('%', '');
  } else {
    reverse = 100 - (decOrPercent * 100);
  }

  let background = `hsl(177, 13%, ${reverse}%)`;
  let lighter = `hsl(177, 13%, ${reverse + 10 > 100 ? 100 : reverse + 10}%)`;
  let darker = `hsl(177, 13%, ${reverse - 10 < 0 ? 0 : reverse - 10}%)`;

  let color = 'black';

  if (reverse < 50) {
    color = 'white'
  }

  let border  = {
    suggested: false,
  };

  if (reverse + 10 >= 100) {
    border = {
      suggested: true,
      style: '1px solid #c3cdcd'
    }
  }
  if (reverse - 10 < 0) {
/*     border = {
      suggested: true,
      style: '1px solid #c3cdcd'
    } */
  }

  return [background, color, lighter, darker, border]
}

const addLargeCourseCard = (course) => {
  const parent = document.querySelector('.course-grades');
  let courseName = course.Title.value;
  let courseNameTrim = course.Title.value.match(/^[^(]*/)[0].trim();
  let coursePeriod = course.Period.value;
  let courseGrade = course.Marks.Mark.CalculatedScoreString.value;
  let courseGradeRaw = course.Marks.Mark.CalculatedScoreRaw.value;

  if (precision(courseGradeRaw) == 0) {
    courseGradeRaw = courseGradeRaw.toFixed(1);
  }

  const largeCourseCard = Object.assign(document.createElement('div'), {
    className: 'large-course-card',
    innerHTML: `
        <div class="course-info"> 
          <div class="course-name">${courseNameTrim}</div>
          <div class="course-period">Period ${coursePeriod}</div>
        </div>
        <div class="grade">
            <span class="grade-value">${courseGrade}</span>
            <span class="grade-raw">${courseGradeRaw}</span>
        </div>
        <div class="grade-calc">
            <div class="grade-calc-box">

            </div>
            <div class="breakdown">
              <div class="divisions"></div>
              <div class="total"></div>
            </div>
        </div>
        <div class="course-assignments"> 

        </div>
    `,
  }); 

  const gradeCategory = (label, weight) => Object.assign(document.createElement('div'), {
    className: 'grade-calc-category',
    innerHTML: `
        <div class="category-label">
          <div class="label">${label}</div>
          <div class="value">(${weight})</div>
        </div>
    `,
  }); 

  let categories = course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc || [{
    Type: {value: 'All grades'},
    Weight: {value: '100%'}
  }];

  
  let gridTemplateColumnsString = ``;
  
  categories.forEach(category => {
    let box = largeCourseCard.querySelector('.grade-calc-box');
    let el = gradeCategory(category.Type.value, category.Weight.value);
    let weight = category.Weight.value;
    
    let [bg, color] = getBackgroundAndColorFromValue(weight);
    el.style.background = bg
    el.style.color = color

    console.log({category})
    let weightDecimal = parseFloat(category.Weight.value) / 100.0; 

    //gridTemplateColumnsString += `${weightDecimal}fr `
    gridTemplateColumnsString += `1fr `;
    box.appendChild(el);
  })

  let box = largeCourseCard.querySelector('.grade-calc-box');
  box.style.gridTemplateColumns = gridTemplateColumnsString.trim();

  largeCourseCard.dataset.name = courseName

  if (!parent.children[1]?.classList?.contains('large-course-card')) {
    largeCourseCard.classList.add('active')
  }

  parent.appendChild(largeCourseCard);
}

const sliderHandler = (e) => {
  e.currentTarget.parentElement.querySelector('.active').classList.remove('active');
  e.currentTarget.classList.add('active');

  let selectedCourseId = e.currentTarget.id;
  let selectedCourse = document.querySelector(`.large-course-card[data-name="${selectedCourseId}"]`);
  console.log(selectedCourse.parentElement)
  let prev = selectedCourse.parentElement.querySelector('.large-course-card.active');
  if (prev) prev.classList.remove('active');
  selectedCourse.classList.add('active');
}
const addCourseSlider = (course) => {
  const parent = document.querySelector('.courses-slider');
  let courseName = course.Title.value;
  let courseNameTrim = course.Title.value.match(/^[^(]*/)[0].trim();

  const slider = Object.assign(document.createElement('button'), {
    className: 'course-slider strip-button-styles',
    innerHTML: `
          <div class="course-name">${courseNameTrim}</div>
    `,
    id: courseName,
    tabIndex: 0,
  }); 

  if (parent.style.gridTemplateColumns == '') slider.classList.add('active')

  parent.style.gridTemplateColumns += ' max-content';

  slider.onclick = sliderHandler;

  parent.appendChild(slider);
}

    /*!
 * swiped-events.js - v@version@
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
    (function (window, document) {

      'use strict';
      
      // patch CustomEvent to allow constructor creation (IE/Chrome)
      if (typeof window.CustomEvent !== 'function') {
      
          window.CustomEvent = function (event, params) {
      
              params = params || { bubbles: false, cancelable: false, detail: undefined };
      
              var evt = document.createEvent('CustomEvent');
              evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
              return evt;
          };
      
          window.CustomEvent.prototype = window.Event.prototype;
      }
      
      document.addEventListener('touchstart', handleTouchStart, false);
      document.addEventListener('touchmove', handleTouchMove, false);
      document.addEventListener('touchend', handleTouchEnd, false);
      
      var xDown = null;
      var yDown = null;
      var xDiff = null;
      var yDiff = null;
      var timeDown = null;
      var startEl = null;
      
      /**
       * Fires swiped event if swipe detected on touchend
       * @param {object} e - browser event object
       * @returns {void}
       */
      function handleTouchEnd(e) {
      
          // if the user released on a different target, cancel!
          if (startEl !== e.target) return;
      
          var swipeThreshold = parseInt(getNearestAttribute(startEl, 'data-swipe-threshold', '20'), 10); // default 20px
          var swipeTimeout = parseInt(getNearestAttribute(startEl, 'data-swipe-timeout', '500'), 10);    // default 500ms
          var timeDiff = Date.now() - timeDown;
          var eventType = '';
          var changedTouches = e.changedTouches || e.touches || [];
      
          if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
              if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                  if (xDiff > 0) {
                      eventType = 'swiped-left';
                  }
                  else {
                      eventType = 'swiped-right';
                  }
              }
          }
          else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
              if (yDiff > 0) {
                  eventType = 'swiped-up';
              }
              else {
                  eventType = 'swiped-down';
              }
          }
      
          if (eventType !== '') {
      
              var eventData = {
                  dir: eventType.replace(/swiped-/, ''),
                  touchType: (changedTouches[0] || {}).touchType || 'direct',
                  xStart: parseInt(xDown, 10),
                  xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
                  yStart: parseInt(yDown, 10),
                  yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10)
              };
      
              // fire `swiped` event event on the element that started the swipe
              startEl.dispatchEvent(new CustomEvent('swiped', { bubbles: true, cancelable: true, detail: eventData }));
      
              // fire `swiped-dir` event on the element that started the swipe
              startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true, detail: eventData }));
          }
      
          // reset values
          xDown = null;
          yDown = null;
          timeDown = null;
      }
      
      /**
       * Records current location on touchstart event
       * @param {object} e - browser event object
       * @returns {void}
       */
      function handleTouchStart(e) {
      
          // if the element has data-swipe-ignore="true" we stop listening for swipe events
          if (e.target.getAttribute('data-swipe-ignore') === 'true') return;
      
          startEl = e.target;
      
          timeDown = Date.now();
          xDown = e.touches[0].clientX;
          yDown = e.touches[0].clientY;
          xDiff = 0;
          yDiff = 0;
      }
      
      /**
       * Records location diff in px on touchmove event
       * @param {object} e - browser event object
       * @returns {void}
       */
      function handleTouchMove(e) {
      
          if (!xDown || !yDown) return;
      
          var xUp = e.touches[0].clientX;
          var yUp = e.touches[0].clientY;
      
          xDiff = xDown - xUp;
          yDiff = yDown - yUp;
      }
      
      /**
       * Gets attribute off HTML element or nearest parent
       * @param {object} el - HTML element to retrieve attribute from
       * @param {string} attributeName - name of the attribute
       * @param {any} defaultValue - default value to return if no match found
       * @returns {any} attribute value or defaultValue
       */
      function getNearestAttribute(el, attributeName, defaultValue) {
      
          // walk up the dom tree looking for attributeName
          while (el && el !== document.documentElement) {
      
              var attributeValue = el.getAttribute(attributeName);
      
              if (attributeValue) {
                  return attributeValue;
              }
      
              el = el.parentNode;
          }
      
          return defaultValue;
      }
      
      }(window, document));

const populatePopup = (a, srcElement) => {
  let popup = document.querySelector('.popper-cover');
  popup.querySelector('.title').innerHTML = a.Measure.value;
  popup.querySelector('.type .value').innerHTML = a.Type.value;
  let [bg, color] = getBackgroundAndColorFromValue(a.essential.weight)
  popup.querySelector('.type .value').style.background = bg
  popup.querySelector('.type .value').style.color = color


  popup.querySelector('.calcs > .points-box-wrapper').innerHTML = srcElement.querySelector('.score-box').outerHTML;

  let scoreBarWidth = (a.essential.score / a.essential.scorePossible).toFixed(2) * 100
  let calculatedScoreBox = `
  <div class="score-box">
    <div class="score-bar" style="width: ${scoreBarWidth}%"></div>
    <div class="score">${a.essential.score}</div>
    <div class="score-divide">/</div>
    <div class="potential-score">${a.essential.scorePossible}</div>
  </div>
  `

  if (!a.ungraded) {
    popup.querySelector('.calcs > .score-box-wrapper').innerHTML = calculatedScoreBox;
  }

  let notes = a.Notes.value
  let desc = a.MeasureDescription.value

  if (notes) {
    popup.querySelector('.notes-wrapper .value').innerHTML = notes;
    popup.querySelector('.notes-wrapper .value').classList.add('present')
  }
  if (desc) {
    popup.querySelector('.desc-wrapper .value').innerHTML = desc;
    popup.querySelector('.desc-wrapper .value').classList.add('present')
  }
}

function preventDefault(e) {
  e.preventDefault();
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

const disableScroll = (el) => {
  el.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  el.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  el.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
}
const enableScroll = (el) => {
  el.removeEventListener('DOMMouseScroll', preventDefault, false);
  el.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  el.removeEventListener('touchmove', preventDefault, wheelOpt); 
}

const assignmentHandler = (aData, ev) => {
  populatePopup(aData, ev.currentTarget);
  let popup = document.querySelector('.popper-cover');
  
  disableScroll(document.body);

  document.body.classList.add('noscroll')

  popup.classList.remove('noblock');
  setTimeout(() => {
    popup.classList.remove('hide')
  })
}
const exitPopup = (e) => {
  document.body.classList.remove('noscroll');
  enableScroll(document.body)

  
  document.querySelector('#popper').classList.remove('full-view');

  let popup = document.querySelector('.popper-cover');
  
  popup.querySelector('.notes-wrapper .value').classList.remove('present')
  popup.querySelector('.desc-wrapper .value').classList.remove('present')

  popup.classList.add('hide');
  setTimeout(() => {
    popup.classList.add('noblock')
  }, 501)
}
document.querySelector('#popper .exit').onclick = exitPopup;

document.querySelector('.popper-cover').onclick = (e) => {
  if (e.target == e.currentTarget && !e.target.classList.contains('hide')) {
    exitPopup();
  }
};


document.querySelector('#popper').addEventListener('swiped-up', function(e) {
  let parent = document.querySelector('#popper');
  if (!parent.classList.contains('full-view')) {
    disableScroll(document.body);
    parent.classList.add('full-view')
    parent.querySelector('.pop-content').scrollTop = 0;
  }
});
document.querySelector('.popper-cover').addEventListener('swiped-down', function(e) {
  exitPopup()
});


const latestAssignmentsList = (rawAssignments) => {
  const latestGrid = document.querySelector('.latest-grid');
  
  let count = 0;

  console.log({rawAssignments});


  Object.keys(rawAssignments).sort().reverse().forEach(date => {
    let assignments = rawAssignments[date];

    for (const a of assignments) {
      //console.log({date, a, count})

      let scoreBarWidth = (a.essential.points / a.essential.pointsPossible).toFixed(2) * 100

      if (a.essential.points == a.essential.pointsPossible || a.essential.points > a.essential.pointsPossible) {
        scoreBarWidth = 100;
      }

      if (a.ungraded == true) {
        a.essential.points = `${a.essential.points}pts possible`
      }

      const card = Object.assign(document.createElement('div'), {
        className: 'assignment',
        innerHTML: `
          <div class="as-info">
              <div class="as-title">${a.Measure.value}</div>
              <div class="as-due-date">${a.DueDate.value}</div>
          </div>
  
          <div class="score-box" ungraded=${a.ungraded}>
              <div class="score-bar" style="width: ${scoreBarWidth}%"></div>
              <div class="score">${a.essential.points}</div>
              <div class="score-divide">/</div>
              <div class="potential-score">${a.essential.pointsPossible}pts</div>
          </div>
          <div class="as-teacher">${a.teacher}</div>
      `
      });

      /* const card = Object.assign(document.createElement('div'), {
        className: 'assignment',
        innerHTML: `
          <div class="as-info">
              <div class="as-title">${a.Measure.value}</div>
              <div class="as-due-date">${a.DueDate.value}</div>
              <div class="as-category">${a.Type.value} (${a.essential.weight * 100}%)</div>
          </div>
  
          <div class="score-box" ungraded=${a.ungraded}>
              <div class="score-bar" style="width: ${scoreBarWidth}%"></div>
              <div class="score">${a.essential.points}</div>
              <div class="score-divide">/</div>
              <div class="potential-score">${a.essential.pointsPossible}pts</div>
          </div>
          <div class="as-teacher">${a.teacher}</div>
      `
      }); */

      if (a.essential.weight * 100 > 50) {
        card.classList.add('important')
      } else {
        card.classList.add('regular')
      }

      if (!a.ungraded) {
        let [bg, color, lighter, darker, border] = getBackgroundAndColorFromValue(a.essential.weight);
        card.querySelector('.score-bar').style.background = bg;
        card.querySelector('.score-box').style.color = color;
        card.querySelector('.score-box').style.background = lighter;
  
        if (border.suggested == true && scoreBarWidth != 100) {
          card.querySelector('.score-box').style.border = border.style;
        }
      }


      let courseName = a.essential.courseTitle;
      let largeCourseElement = document.querySelector(`.large-course-card[data-name="${courseName}"]`);
      let largeCourseAssignmentList = largeCourseElement.querySelector('.course-assignments');
      
      largeCourseAssignmentList.appendChild(card)
      card.addEventListener('click', (e) => {
        assignmentHandler(a, e)
      })

      if (a.ungraded == true) {
        continue;
      }
      if (count < 7) {
        latestGrid.appendChild(card);
      } 
      count++
    }
  });
}

const iGPA = (letter) => {
  let scale = {
    'A+': 4.0,
    'A': 4.0, 
    'A-': 3.7,
    'B': 3.3,
    'B': 3.0,
    'B': 2.7,
    'C': 2.3, 
    'C': 2.0,
    'C': 1.7,
    'D': 1.3, 
    'D': 1.0,
    'D': 0.7, 
    'F': 0
  };

  let points = scale[letter]
  if (points) {
    return points;
  }

  console.warn("letter doesn't match GPA scale")
  return
}

const gradePointAverageFromPercent = (percent) => {
    let GPA;

    if (percent < 0.60) GPA = 0.0;
    if (percent >= 0.60 && percent <= 0.66) GPA = 1.0;
    if (percent >= 0.67 && percent <= 0.69) GPA = 1.3;
    if (percent >= 0.70 && percent <= 0.72) GPA = 1.7;
    if (percent >= 0.73 && percent <= 0.76) GPA = 2.0;
    if (percent >= 0.77 && percent <= 0.79) GPA = 2.3;
    if (percent >= 0.80 && percent <= 0.82) GPA = 2.7;
    if (percent >= 0.83 && percent <= 0.86) GPA = 3.0;
    if (percent >= 0.87 && percent <= 0.89) GPA = 3.3;
    if (percent >= 0.90 && percent <= 0.92) GPA = 3.7;
    if (percent >= 0.93 && percent <= 1) GPA = 4.0;

    console.log({GPA})

    return GPA;
}
const letterGradeFromFourPointScale = (num, mastery=false) => {
    let letter = 'F';

    if (mastery) {
      if (num >= 1.6) letter = 'D';
      if (num >= 2.2) letter = 'C';
      if (num >= 2.8) letter = 'B';
      if (num >= 3.4) letter = 'A';
      return letter;
    } 

    if (num >= 1.0) letter = 'D';
    if (num >= 1.3) letter = 'D+';
    if (num >= 1.7) letter = 'C-';
    if (num >= 2) letter = 'C';
    if (num >= 2.3) letter = 'C+';
    if (num >= 2.7) letter = 'B-';
    if (num >= 3.0) letter = 'B';
    if (num >= 3.3) letter = 'B+';
    if (num >= 3.7) letter = 'A-';
    if (num >= 4) letter = 'A';

    return letter;
}
const letterGradeToFourPointScale = (letter) => {
    let num = 0.0;

    if (letter == 'D') num = 1.0;
    if (letter == 'D+') num = 1.3;
    if (letter == 'C-') num = 1.7;
    if (letter == 'C') num = 2;
    if (letter == 'C+') num = 2.3;
    if (letter == 'B-') num = 2.7;
    if (letter == 'B') num = 3.0;
    if (letter == 'B+') num = 3.3;
    if (letter == 'A-') num = 3.7;
    if (letter == 'A') num = 4;
    
    return num;
}

const cumulativeGradePointAverageGraph = async (courses, start, step) => {
  // {start} represents the leftmost side of the graph
  // {step} represents the size of which the graph increments 
  const allAssignments = {};
  const allAssignmentsRaw = {};
  const masterAssignments = {};

  let buckets = [];

  // Buckets are calculated as a function of {step} in the duration from {start} to now
  // In other words, how many {step}(s) are in a given duration

  let bucketCount = dayjs().diff(start, step);
  for(let i = 0; i < bucketCount; i++) {
    let currentDay = start.add(i, step).unix();

    buckets.push({ date: currentDay })
  }

  buckets.push({
    date: dayjs().unix()
  })

  // Loop over courses
  courses.forEach(c => {
    let assignments = c.Marks.Mark.Assignments.Assignment;
    let courseTitle = c.Title.value;

    // Simple guard clauses
    if (!assignments) {
      return console.log(courseTitle, ' has no assignments', c)
    } else if (Array.isArray(assignments) == false) {
      // Edge case in which {assignments} is a single property
      assignments = [assignments]
    }

    let categories = c.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc;

    // Loop over assignments
    assignments.forEach(a => {
      let [score, SoutOf, scorePossible] = a.Score.value.split(/( out of )/);
      let [points, PoutOf, pointsPossible] = a.Points.value.split(/( \/ )/);

      let type = a.Type;
      let weight;

      let matchedCategory = categories?.find(c => c.Type.value == type.value);
      if (matchedCategory) {
        weight = parseFloat(matchedCategory.Weight.value) / 100.0; 
      } else {
        weight = 1; 
      }

      let essential = {
        courseTitle,
        dueDate: a.DueDate.value,
        score: parseFloat(score),
        scorePossible: parseFloat(scorePossible),
        points: parseFloat(points),
        pointsPossible: parseFloat(pointsPossible),
        type,
        weight
      }

      let raw = structuredClone(a);
      raw.teacher = c.Staff.value;
      raw.essential = essential;
      
      let endOfDueDate = dayjs(essential.dueDate, "M/D/YYYY").endOf('day').unix();

      if (!scorePossible || !pointsPossible || a.Notes.value?.includes('Not For Grading')) {
        raw.ungraded = true;
        console.warn(raw)

        if (allAssignmentsRaw[endOfDueDate]) {
          allAssignmentsRaw[endOfDueDate].push(raw)
        } else {
          allAssignmentsRaw[endOfDueDate] = [raw];
        }
        
        return;
      };

      if (allAssignments[endOfDueDate]) {
        allAssignments[endOfDueDate].push(essential)
        allAssignmentsRaw[endOfDueDate].push(raw)
      } else {
        allAssignments[endOfDueDate] = [essential];
        allAssignmentsRaw[endOfDueDate] = [raw];
      }
    })
  })

  console.groupCollapsed('Assignments by due date')
  console.log({
    allAssignments,
    allAssignmentsRaw
  })
  console.groupEnd();

  let courseCumulativeGPAs = {}
  global.courseCumulativeGPAs = courseCumulativeGPAs;

  console.groupCollapsed('looping through all assignments by due date')

  Object.keys(allAssignments).forEach(date => {
    let assignments = allAssignments[date];

    assignments.forEach(a => {
      console.log(a)
      let points = a.points;

      if (a.points == 0 && a.pointsPossible == 0) {
        return;
      } 



      console.log(dayjs(date, 'X').format('MMMD'), `${points} / ${a.pointsPossible}`)
      if (courseCumulativeGPAs[a.courseTitle]) {

        if (courseCumulativeGPAs[a.courseTitle][date]) {
          if (courseCumulativeGPAs[a.courseTitle][date][a.weight]) {
            courseCumulativeGPAs[a.courseTitle][date][a.weight].points += points;
            courseCumulativeGPAs[a.courseTitle][date][a.weight].maxPoints += a.pointsPossible;
          } else {
            courseCumulativeGPAs[a.courseTitle][date][a.weight] = {
                points: points,
                maxPoints: a.pointsPossible
            }
          }
        } else {
          courseCumulativeGPAs[a.courseTitle][date] = {
            [a.weight]: {
                points: points,
                maxPoints: a.pointsPossible
            }
          }
        }

      } else {
        courseCumulativeGPAs[a.courseTitle] = {
          [date]: {
            [a.weight]: {
                points: points,
                maxPoints: a.pointsPossible
            }
          }
        } 
      }
    })

  })

  console.groupEnd()



  // LAST LOOP!! :)
  console.groupCollapsed('calculating tGPAs...')
  Object.keys(courseCumulativeGPAs).forEach(courseName => {
    // ONE MORE I PROMISE LAST ONE!!
    let dates = courseCumulativeGPAs[courseName];
    
    let datesLength = Object.keys(dates).length;
    Object.keys(dates).sort().forEach((date, index) => {
      console.log(courseName, 'DATE: ', date, {
        index,
        length: datesLength
      })

      let categories = dates[date];
      let weightedPoints;

      Object.keys(categories).forEach(weight => {
        let w = categories[weight]; 
        console.log({categories}) 
        
        // w.points & total

        let total = w.points;
        let maxTotal = w.maxPoints;

        if (courseCumulativeGPAs[courseName].prevTotal?.[weight]) {
          total += courseCumulativeGPAs[courseName].prevTotal[weight].pointsTotal;
          maxTotal += courseCumulativeGPAs[courseName].prevTotal[weight].maxPointsTotal;
        
          courseCumulativeGPAs[courseName].prevTotal[weight].pointsTotal = total;
          courseCumulativeGPAs[courseName].prevTotal[weight].maxPointsTotal = maxTotal;

          //console.log('setting new totals to ', {
          //  total, maxTotal
          //}, ' in category ', weight)
        } else {
          if (courseCumulativeGPAs[courseName].prevTotal) {
            courseCumulativeGPAs[courseName].prevTotal[weight] = {
                pointsTotal: total,
                maxPointsTotal: maxTotal
            }
          } else {
            courseCumulativeGPAs[courseName].prevTotal = {
              [weight]: {
                pointsTotal: total,
                maxPointsTotal: maxTotal
              }
            };
          }

          //console.log('setting inital total to ', total, ' in category ', weight)
        }

        w.points = total;
        w.maxPoints = maxTotal;

        let savedWeightsLength = Object.keys(courseCumulativeGPAs[courseName].prevTotal).length
        if (savedWeightsLength > 1) {
            if (Object.keys(categories).length != savedWeightsLength) {
              console.warn(Object.keys(categories).length, savedWeightsLength)
                let prevTotals = structuredClone(courseCumulativeGPAs[courseName].prevTotal);
                delete prevTotals[weight];
                let missingWeight = Object.keys(prevTotals)[0];
                console.warn('missing weight:', Object.keys(prevTotals)[0]);

                categories[missingWeight] = {
                  points: prevTotals[missingWeight].pointsTotal,
                  maxPoints: prevTotals[missingWeight].maxPointsTotal
                }
            }
        }

      })

      // (Temporary Grade Point Average)
      
      // Ex.
      // 0.8 * (15/15 points) => 0.8
      // 0.2 * (30/35 points) => 0.174
      // = 0.974 => THIS IS THE GPA

      let tGPA = 0;
      let weightsTotal = 0;
      let weightsLength = Object.keys(courseCumulativeGPAs[courseName][date]).length;
      //console.warn(weightsLength)
      let pointsPercentages = [];

      Object.keys(courseCumulativeGPAs[courseName][date]).forEach(weightKey => {
        let weight = courseCumulativeGPAs[courseName][date][weightKey];
        let pointsPercentage = weight.points / weight.maxPoints;

        let weightedPercentage = parseFloat(weightKey) * pointsPercentage;

        tGPA += weightedPercentage * 4;
        weightsTotal += parseFloat(weightKey);

        pointsPercentages.push(pointsPercentage)
      });

      weightsTotal = weightsTotal.toFixed(3);

      if (1 - weightsTotal != 0 && tGPA != 1) {
        if (weightsLength > 1) {
             let missingWeight = (1 - weightsTotal).toFixed(3);
             tGPA += (missingWeight * 4)
        } else {
            //console.warn(weightsLength)
            tGPA = 0;
            pointsPercentages.forEach(p => {
                tGPA += p * 4;
            })
        }
      }

      console.log({
        tGPA, weightsTotal
      })

      //  4 * 0.9850000000000001 HERE!!

      courseCumulativeGPAs[courseName][date].tGPA = tGPA
      if (index == datesLength - 1) {
        courseCumulativeGPAs[courseName].cGPA = tGPA;
      }
    })
    console.log(courseCumulativeGPAs)
  })

  console.groupEnd();

  // Ok I PROMISE THIS TIME, now we loop over each BUCKET
  // ...and grab the nearest day from each COURSE and get 
  // ...that day's GPA. Then you add all of them up and 
  // ...divide by number of courses


  console.groupCollapsed('Finding tGPAs nearest to a given bucket date')

  buckets.forEach(bucket => {
    let bucketDate = dayjs(bucket.date, 'X');
    bucket.readableDate = bucketDate.format('MMMD')
    let tGPAs = [];

    console.groupCollapsed('Nearests to: ' + bucket.readableDate)

    Object.keys(courseCumulativeGPAs).forEach(courseName => {
        let dates = courseCumulativeGPAs[courseName];
        let isSameDay = false;
        
        Object.keys(dates).sort().forEach((date, index) => {
            if (isNaN(date)) return;

            let currentDay = dayjs(parseInt(date), 'X');
            if (currentDay.isSame(bucketDate, 'day')) {
                tGPAs.push(courseCumulativeGPAs[courseName][date].tGPA);
                console.log(`For ${courseName}, there is a tGPA on this day (${courseCumulativeGPAs[courseName][date].tGPA})`)
                isSameDay = true;
            } 
        });

        if (isSameDay == false) {
            let goal = bucketDate.unix();

            let closest = Object.keys(dates).sort().reduce(function(prev, curr) {
                let currentUnix = parseInt(curr);
                return (Math.abs(currentUnix - goal) < Math.abs(prev - goal) ? currentUnix : prev);
            });

            tGPAs.push(courseCumulativeGPAs[courseName][closest].tGPA);
            console.log(`For ${courseName}, the closest tGPA to ${bucket.readableDate} was ${dayjs(closest, 'X').format('MMMD')}`)
        }
    })

    let adjustedTGPAs = tGPAs.map(gpa => {
        let regular = letterGradeFromFourPointScale(gpa);
        //let custom = letterGradeFromFourPointScale(gpa, true);
        return letterGradeToFourPointScale(regular);
    })

    let sumAdjusted = adjustedTGPAs.reduce((a,b) => (a+b)); 
    let sum = tGPAs.reduce((a,b) => (a+b));
    let average = sum / adjustedTGPAs.length;
    bucket.ctGPA = average.toFixed(2);

    console.groupEnd();

    console.log({
        bucket, tGPAs, adjustedTGPAs
    });

  });

  console.groupEnd();
  console.log('Courses with a tGPA by date:', courseCumulativeGPAs);

  let gpaSpan = document.querySelector('.gpa-value');
  gpaSpan.innerHTML = buckets[buckets.length - 1].ctGPA;

  let min = Math.min(...buckets.map(x => x.ctGPA)) - 1;
  if (min < 0) min = 0;

  const graphData = buckets.map(x => x.ctGPA);
  console.log({buckets, graphData});

  const graphElement = document.getElementById('gpa-graph');

  const chartjs = await import('chart.js/auto');
  const Chart = chartjs.default;
  
  Chart.defaults.font.family = 'Inter'
  const graph = new Chart(graphElement, {
    type: 'line',
    data: {
        labels: buckets.map(x => {
          return `${x.readableDate.slice(0, 3)} ${x.readableDate.slice(3)}`
        }),
        datasets: [{
          label: 'ctGPA',
          backgroundColor: '#000',
          borderColor: '#585858',
          data: graphData,
          tension: 0.2
        }],
    },
    options: {
        maintainAspectRatio: false,
        scales: {
          yAxis: {
            position: 'right',
            grid: {
              display: false
            },
            max: 4,
            min: min
          },
          xAxis: {
            ticks: {
              autoSkip: true,
              
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
    }
  });

  let viewSwitcherInput = document.getElementById('gpa-view');
  viewSwitcherInput.addEventListener('input', (e) => {
    updateGraphView(graph, e.currentTarget.value, buckets);
  });

  console.log(viewSwitcherInput)
  

  latestAssignmentsList(allAssignmentsRaw);
  populatePointStatistics(courseCumulativeGPAs)
}

const gradeCalcBoxHandler = (e) => {
  if (e.currentTarget.classList.contains('expand')) {
    e.currentTarget.classList.remove('expand');
  } else {
    e.currentTarget.classList.add('expand');
  }
}

const populatePointStatistics = (cGPAs) => {
  Object.keys(courseCumulativeGPAs).forEach(courseName => {
    let dates = courseCumulativeGPAs[courseName];
    let dateKeys = Object.keys(dates).sort();
    let lastDateKey = dateKeys[dateKeys.length - 3];
    
    console.log(dates)

    let selectedCourse = document.querySelector(`.large-course-card[data-name="${courseName}"]`);
    let gradeCalcBox = selectedCourse.querySelector('.grade-calc');

    let breakDown = gradeCalcBox.querySelector('.breakdown');
    let categories = gradeCalcBox.querySelectorAll('.grade-calc-category');
    let categoriesGrid = gradeCalcBox.querySelector('.grade-calc-box');

    let divisionsElement = breakDown.children[0];

    let totalElement = breakDown.children[1];
    let total = 0;
    let current = 0;

    const divisionCard = (weight) => Object.assign(document.createElement('div'), {
      className: 'division',
      innerHTML: `
        <div class="value">${weight.pointsTotal} / ${weight.maxPointsTotal}pts</div>
      `,
    }); 

    let gridTemplateColumnsString = ``;
    let currentDecimalTotal = 0;

    Object.keys(dates.prevTotal).forEach((weight, index) => {
      total += dates.prevTotal[weight].maxPointsTotal;
      current += dates.prevTotal[weight].pointsTotal;

      if (precision(dates.prevTotal[weight].pointsTotal) > 3) {
        dates.prevTotal[weight].pointsTotal = dates.prevTotal[weight].pointsTotal.toFixed(0)
      }

      divisionsElement.appendChild(divisionCard(dates.prevTotal[weight]))
      //gridTemplateColumnsString += `${weight}fr `;
      gridTemplateColumnsString += `1fr `;
      
      currentDecimalTotal += parseFloat(weight);

      if (index == Object.keys(dates.prevTotal).length - 1) {
          if (currentDecimalTotal < 1) {
            let missing = 1 - currentDecimalTotal;
            //gridTemplateColumnsString += `${missing}fr `;
            gridTemplateColumnsString += `1fr `;
          }
      }
    });

    console.log({gridTemplateColumnsString});
    divisionsElement.style.gridTemplateColumns = gridTemplateColumnsString.trim();

    let diffCategory = categories.length - Object.keys(dates.prevTotal).length;
    if (diffCategory > 0) {
      for (let i = 0; i < diffCategory; i++) {
        divisionsElement.appendChild(divisionCard({
          pointsTotal: 0,
          maxPointsTotal: 0
        }))
      }
    };


    categories.forEach((c, i) => {
      divisionsElement.children[i].style.background = c.style.background;
      divisionsElement.children[i].style.color = c.style.color;
    })

    if (precision(current) > 3) {
      current = current.toFixed(0)
    }
    totalElement.innerHTML = `<div class="total-value">${current} / ${total}pts</div>`
  });
}


checkExistingUser();

document.querySelector('#app > .studs').addEventListener('click', () => {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('skipLanding')

  window.location.search = searchParams.toString();
  return
});

document.querySelector('.main-grid > .studs').addEventListener('click', () => {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set('skipLanding', 'true')

  window.location.search = searchParams.toString();
  return
});
document.querySelector('button.try').addEventListener('click', (e) => {
  document.getElementById('landing').classList.add('hide')
  document.getElementById('app').classList.remove('hide')
})

const parseSearchParams = () => {
  let searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('skipLanding')) {
    if (searchParams.get('skipLanding') == 'true') {
      document.getElementById('landing').classList.add('hide')
      document.getElementById('app').classList.remove('hide')
    }
  }
}
parseSearchParams();

document.querySelector('.main-grid .top-bar').addEventListener('input', (e) => {
  document.querySelector('.main-grid').setAttribute('view', e.currentTarget.value);

  /* if (e.currentTarget.value == 'grades') {
    let gradeCalcs = document.querySelectorAll('.grade-calc');
    gradeCalcs.forEach(gc => {
      let categories = gc.querySelectorAll('.grade-calc-category');
      let divisons = gc.querySelectorAll('.division');

      if (categories.length == divisons.length) {
        let gcBox = gc.querySelector('.grade-calc-box');
        let divisonBox = gc.querySelector('.divisions');
        
        let columnsText = window.getComputedStyle(gcBox).getPropertyValue('grid-template-columns');
        
        let groups = columnsText.split('px');
        let frString = '';
        groups.forEach(column => {
          if (column.length > 0) {
            let fr = ((parseFloat(column) / gcBox.offsetWidth) * 10).toFixed(2) + 'fr';
            console.log(fr);
            frString += `${fr} `;
          }
        })

        divisonBox.style.gridTemplateColumns = frString;

      }
    })
  } */
});


const updateGraphView = (graph, view, bucketsData) => {
  console.log(graph)
  let buckets;

  if (view == 'all-time') {
    buckets = bucketsData.slice()
    console.warn('all-time')
  }

  if (view == 'six-month') {
    let sixMonthsAgo = dayjs().subtract(6, 'month');
    let daysDiff = dayjs().diff(sixMonthsAgo, 'day');

    buckets = bucketsData.slice(-daysDiff);
    console.warn('six-month')
  }

  if (view == 'month') {
    let monthAgo = dayjs().subtract(1, 'month');
    let daysDiff = dayjs().diff(monthAgo, 'day');

    buckets = bucketsData.slice(-daysDiff);
    console.warn('month', daysDiff, bucketsData)
  }

  if (view == 'week') {
    let weekAgo = dayjs().subtract(1, 'week');
    let daysDiff = dayjs().diff(weekAgo, 'day');

    buckets = bucketsData.slice(-daysDiff);
  }

  graph.data.datasets.data = buckets.map(x => x.ctGPA);
  graph.data.labels = buckets.map(x => {
    return `${x.readableDate.slice(0, 3)} ${x.readableDate.slice(3)}`
  });

  let min = Math.min(...buckets.map(x => x.ctGPA)) - 1;
  if (min < 0) min = 0;
  graph.options.scales['yAxis'].min = min;

  console.warn(graph.data)
  graph.update('none');
}

  })

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A blazing fast StudentVUE client." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='b' viewBox='0 0 97.605 131.739'%3E%3Cg id='c'%3E%3Cg%3E%3Cpolyline points='3 17.348 3 65.87 3 114.391' style='fill:none; stroke:%23000; stroke-miterlimit:10; stroke-width:6px;'/%3E%3Cpolyline points='3 90.13 73.668 90.13 73.668 65.87 23.937 65.87 23.937 41.609 94.605 41.609' style='fill:none; stroke:%23000; stroke-miterlimit:10; stroke-width:6px;'/%3E%3Cpolyline points='94.605 17.348 94.605 65.87 94.605 114.391' style='fill:none; stroke:%23000; stroke-miterlimit:10; stroke-width:6px;'/%3E%3Crect x='3' y='114.391' width='91.605' height='14.348' style='stroke:%23000; stroke-miterlimit:10; stroke-width:6px;'/%3E%3Crect x='3' y='3' width='91.605' height='14.348' style='stroke:%23000; stroke-miterlimit:10; stroke-width:6px;'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E" />
        {/* Primary Meta Tags */}
        <title>A fast, reliable, and beautiful client of StudentVUE.</title>
        <meta name="title" content="A fast, reliable, and beautiful client of StudentVUE." />
        <meta name="description" content="Studs - reimagine your StudentVUE experience." />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studsvue.netlify.app/" />
        <meta property="og:title" content="A fast, reliable, and beautiful client of StudentVUE." />
        <meta property="og:description" content="Studs - reimagine your StudentVUE experience." />
        <meta property="og:image" content="https://studsvue.netlify.app/metaimage.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://studsvue.netlify.app/" />
        <meta property="twitter:title" content="A fast, reliable, and beautiful client of StudentVUE." />
        <meta property="twitter:description" content="Studs - reimagine your StudentVUE experience." />
        <meta property="twitter:image" content="https://studsvue.netlify.app/metaimage.png" />
      </Head>
        <div id="landing" className="">
          <div className="studs">
            <div className="image">
              <img src="./side-logo.svg" alt="" />
            </div>
            <div className="label">Studs</div>
          </div>
          <div role="main" className="landing">
            <h1>
              Fast, insightful, beautiful, and safe.
              <span className="slow">The next-gen StudentVUE Client.</span>
            </h1>
            <p>Studs was built for students, by students. Elegantly designed from edge to edge, with practicality and efficiency as a central aspect.
            </p>
            <button className="try">Try it →</button>
          </div>
          <div className="tilt-mockup">
            <img src="./midnight2.png" alt="" />
          </div>
          <div className="tilt-mockup">
            <img src="./midnight.png" alt="" />
          </div>
          <div role="main" className="landing">
            <h1>
              Detailed breakdowns and 
              <span className="slow">color-coding</span>
            </h1>
            <p>A HSL color-coding algorithm adapts to significant impacts in grade weighing and calculation. The heavier the weight, the darker the color. 
            </p>
            <div className="snippet">
              <img src="./carbon-color.png" alt="" />
            </div>
          </div>
        </div>
        <div id="app" className="hide">
          <div className="studs">
            <div className="image">
              <img src="./side-logo.svg" alt="" />
            </div>
            <div className="label">Studs</div>
          </div>
          <div role="main" className="main">
            <h1>
              Welcome to <span className="slow">Studs</span>. Login to get started.
            </h1>
            <span>An enhanced experience of
              <a href="https://edupoint.com/Products/ParentVUE-StudentVUE" className="sv">
                StudentVUE </a>&nbsp;&nbsp;&nbsp; for
              <a href="https://www.moundsviewschools.org/moundsview">Mounds View High School</a>
              students.
            </span>
          </div>
          <div className="auth-form">
            <button id="signInAs" className="hide">Sign in as</button>
            <input aria-label="email" type="email" name="" id="email" placeholder="StudentVUE Email" />
            <input aria-label="password" type="password" name="" id="password" placeholder="StudentVUE Password" />
            <button id="login" className="">Sign in</button>
          </div>
          <div className="privacy-wrap">
            <p className="question">This website is safe to use</p>
            <p className="content">
              This website is open sourced <a href="https://github.com/itsisaac19/studs">on Github</a>.
              Your login info and StudentVUE data is <u><b>never</b></u> shared, saved, or sold. Period.
              <br />
            </p>
          </div>
          <div className="about" role="button" tabIndex={0}>about</div>
          <section className="why">
            <h2>The big question — how does it <span className="fancy">work</span>?</h2>
            <p className="explain">
              StudentVUE has created a database which developers are granted access to through an API (application programming interface). 
              <br /><br /> We can then take a user's login credentials, send them to StudentVUE, and if they match the credentials that they have stored, it grants the developer access to 
              the user's data. <br /> <br /> <b>At no point during this process are the user credentials exposed to the developer for extraction or exploitation.</b>
            </p>
            <h2 className="listen">Ok, but <span className="fancy2">why</span>?</h2>
            <p className="explain-3">
              We're tired of the laggy website and slow loading times. The buggy
              app that seems to break every once-in-a-while. We want a reliable, fast,
              and practical interface.
            </p>
            <p className="explain-2">
              With STUDS, reimagine your StudentVUE experience.
            </p>
            <ul className="e-list">
              <li>You <i>understand</i> what you're looking at.</li>
              <li>It doesn't take decades for you to navigate between courses.</li>
              <li>Better statistics</li>
            </ul>
            <h2 className="listen">We're <span className="fancy3">listening</span> to the parents and students</h2>
            <p className="explain-3 last">
              We're responding to the endless complaints. And that's not an
              exaggeration — there's currently over 10,000 one-star reviews on the
              app store.
            </p>
          </section>
        </div>
        <div id="dashboard" className="hide">
          <div className="main-grid" view="dashboard">
            <div className="studs">STUDS</div>
            <div className="top-bar-select-wrapper">
              <select className="top-bar">
                <option value="dashboard">Home</option>
                <option value="grades">Grades</option>
                {/*
                    <option class="messages">Messages</option>
                    <option class="attendance">Attendance</option>
                    */}
              </select>
            </div>
            <div className="dashboard main-content">
              <div className="little-grid">
              </div>
              <div className="main-card hide">
                <div className="gpa-header">
                  <div className="title">
                    CUMULATIVE GPA <span className="gpa-value" />
                  </div>
                  <div className="c-gpa-view-input">
                    <select name="" id="gpa-view">
                      <option value="all-time">All time</option>
                      <option value="six-month">6 Months</option>
                      <option value="month">Month</option>
                      <option value="week">Week</option>
                    </select>
                  </div>
                </div>
                <div className="graph-wrap">
                  <canvas id="gpa-graph" style={{maxWidth: '100%'}} />
                </div>
              </div>
              <div className="sub-card hide">
                <div className="latest-label">Latest Graded Assignments</div>
                <div className="latest-grid">
                </div>
              </div>
            </div>
            <div className="course-grades main-content hide">
              <div className="courses-slider-wrapper">
                <div className="courses-slider" />
              </div>
            </div>
            <div className="popper-cover hide noblock">
              <div id="popper">
                <div className="assignment-pop">
                  <div className="pop">
                    <div className="pop-bar-wrapper">
                      <div className="pop-bar" />
                    </div>
                    <div className="pop-content">
                      <div className="details">
                        <div className="type">
                          {/* <div class="label">Assignment Type</div> */}
                          <div className="value" />
                        </div>
                        <div className="title" />
                      </div>
                      <div className="calcs">
                        <div className="points-box-wrapper" />
                        <div className="score-box-wrapper" />
                      </div>
                      <div className="notes-wrapper">
                        <span className="notes-label">Teacher notes</span>
                        <div className="value" />
                      </div>
                      <div className="desc-wrapper">
                        <span className="desc-label">Description</span>
                        <div className="value" />
                      </div>
                    </div>
                    <div className="pop-fade" />
                    <div className="exit">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
