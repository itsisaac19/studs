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

    document.getElementById('signInAs').classList.remove('hide');
    document.getElementById('signInAs').innerHTML = `Sign in as ${API.username}`

    document.getElementById('signInAs').addEventListener('click', async (e) => {
      e.currentTarget.classList.add('loading')
      e.currentTarget.innerHTML = 'loading...'
      console.log('awaiting init')
      let g = await initDashboard(shouldStoreNewCacheTime); 
  
      document.getElementById("app").classList.add("hide");
      document.getElementById("dashboard").classList.remove("hide");
    })
  }
}

const login = async () => {
  return API.call('login test');
};

const handleSignInResponse = (e, response) => {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (response["RT_ERROR"]["STACK_TRACE"].value.includes('login test is not a valid method')) {
    document.getElementById("app").classList.add("hide");
    document.getElementById("dashboard").classList.remove("hide");
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
    e.target.innerHTML = "loading...";

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
      console.log('cached gradebook response:', cachedResponse);
      gradebook = cachedResponse;
    } else {
      const [gradebookResponse, error2] = await API.call('Gradebook');
      gradebook = gradebookResponse.Gradebook;
      API.cacheResponse('Gradebook', gradebook, storeCachedTime);
    }

    console.log(gradebook);

    gradebook.Courses.Course.forEach(course => {
        addLittleCourseCard(course);
    });

    let initialDiff;
    if (window.innerWidth < 600) {
      initialDiff = dayjs().subtract(4, 'week');
    } else {
      initialDiff = dayjs().subtract(4, 'week');
    }

    cumulativeGradePointAverageGraph(gradebook.Courses.Course, initialDiff, 'day');


    return gradebook;
    //const [studentInfo, error1] = await API.call('StudentInfo');
    //console.log(studentInfo);
}

const precision = (a) => {
  var e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
}

const addLittleCourseCard = (course) => {
    let courseName = course.Title.value.match(/^[^(]*/)[0].trim();
    let coursePeriod = course.Period.value;
    let courseGrade = course.Marks.Mark.CalculatedScoreString.value;
    let courseGradeRaw = course.Marks.Mark.CalculatedScoreRaw.value;

    if (precision(courseGradeRaw) == 0) {
      courseGradeRaw = courseGradeRaw.toFixed(1);
    }

    const littleGrid = document.querySelector('.little-grid');
    const card = Object.assign(document.createElement('button'), {
        className: 'little-course-card strip-button-styles',
        innerHTML: `
            <div class="course-info"> 
              <div class="course-name">${courseName}</div>
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

    littleGrid.appendChild(card);
}

const populateCourseAssignments = (rawAssignments) => {
  document.querySelector('large-course-card');

  const card = Object.assign(document.createElement('div'), {
    className: 'large',
    innerHTML: `
        <div class="course-info"> 
          <div class="course-name">${courseName}</div>
          <div class="course-period">Period ${coursePeriod}</div>
        </div>
        <div class="grade">
            <span class="grade-value">${courseGrade}</span>
            <span class="grade-raw">${courseGradeRaw}</span>
        </div>
    `,
    tabIndex: 0
  });

// etc...
}

const latestAssignmentsList = (rawAssignments) => {
  const latestGrid = document.querySelector('.latest-grid');
  
  let count = 0;

  console.log({rawAssignments})

  Object.keys(rawAssignments).sort().reverse().forEach(date => {
    if (count > 6) return;

    let assignments = rawAssignments[date];

    console.log({
      assignments
    })

    for (const a of assignments) {
      if (count > 6) break;

      console.log({date, a, count})

      let scoreBarWidth = (a.essential.points / a.essential.pointsPossible).toFixed(2) * 100

      if (a.essential.points == a.essential.pointsPossible) {
        scoreBarWidth = 100;
      }

      const card = Object.assign(document.createElement('div'), {
        className: 'latest-assignment',
        innerHTML: `
          <div class="as-info">
              <div class="as-title">${a.Measure.value}</div>
              <div class="as-due-date">${a.DueDate.value}</div>
          </div>
  
          <div class="score-box">
              <div class="score-bar" style="width: ${scoreBarWidth}%"></div>
              <div class="score">${a.essential.points}</div>
              <div class="score-divide">/</div>
              <div class="potential-score">${a.essential.pointsPossible}pts</div>
          </div>
          <div class="as-teacher">${a.teacher}</div>
      `
      })
  
      latestGrid.appendChild(card);
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
      if (!scorePossible || !pointsPossible) return;
      if (a.Notes.value?.includes('Not For Grading')) return;

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
            courseCumulativeGPAs[a.courseTitle][date][a.weight].maxPoints += points;
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
            if (categories.length != savedWeightsLength) {
                let prevTotals = structuredClone(courseCumulativeGPAs[courseName].prevTotal);
                delete prevTotals[weight];
                let missingWeight = Object.keys(prevTotals)[0];
                console.warn('missing weight:', Object.keys(prevTotals)[0]);
                categories[missingWeight] = {
                    points: prevTotals[missingWeight].pointsTotal,
                    maxPoints: prevTotals[missingWeight].maxPointsTotal
                }
                console.log(categories)
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

  const min = Math.min(...buckets.map(x => x.ctGPA)) - 1;
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
}


checkExistingUser();

document.querySelector('.top-bar > .studs').addEventListener('click', () => {
  window.location.reload();
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

  const min = Math.min(...buckets.map(x => x.ctGPA)) - 1;
  if (min < 0) min = 0;
  graph.options.scales['yAxis'].min = min;

  console.warn(graph.data)
  graph.update();
}