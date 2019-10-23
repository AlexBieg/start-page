'use strict';

let events;

function buildCalendarEventDom(event, index) {
  const start = new Date(event.start.dateTime);
  const startTime = start.toLocaleDateString("en-US", {
    timeStyle: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
  const end = new Date(event.end.dateTime);
  const endTime = end.toLocaleDateString("en-US", {
    timeStyle: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
  const now = new Date();

  const started = now > start;
  const ended = now > end;

  const dateText = document.createTextNode(`${startTime} - ${endTime}`)
  const dateDom = document.createElement('div');
  dateDom.appendChild(dateText);
  dateDom.classList.add('event-time')

  const summaryText = document.createTextNode(event.summary);
  const summaryDom = document.createElement('div')
  summaryDom.appendChild(summaryText);

  const domEvent = document.createElement('div');
  domEvent.appendChild(summaryDom);
  domEvent.appendChild(dateDom);
  domEvent.classList.add('event');
  domEvent.id = `event-${index}`;

  if (ended) {
    domEvent.classList.add('ended');
  } else if (started) {
    domEvent.classList.add('started');
  }

  const link = document.createElement('a');
  link.href = 'https://calendar.google.com/calendar/b/1/r/week';
  link.appendChild(domEvent)

  return link;
}

function buildCalendarTimeline(event, eventTimeline, index) {
  const eventStart = new Date(event.start.dateTime);
  const eventEnd = new Date(event.end.dateTime);

  const timelineStart = new Date();
  timelineStart.setHours(8, 0, 0, 0);
  const timelineEnd = new Date();
  timelineEnd.setHours(18, 0, 0, 0);

  const pixelRange = eventTimeline.offsetHeight;
  const minuteRange = 600; // 10 hours (8am - 6pm)

  const startMinOffset = Math.floor(Math.abs(eventStart - timelineStart)/1000/60);
  const endMinOffset = Math.floor(Math.abs(eventEnd - timelineStart)/1000/60);

  const startPercent = startMinOffset / minuteRange;
  const endPercent = endMinOffset / minuteRange;

  const startPixel = Math.floor(startPercent * pixelRange);
  const endPixel = Math.floor(endPercent * pixelRange);

  const eventDiv = document.createElement('div');
  eventDiv.style.height = `${endPixel - startPixel}px`;
  eventDiv.style.top = `${startPixel}px`;
  eventDiv.classList.add('timeline-event');
  eventDiv.onmouseenter = ((i) => (event) => {
    document.getElementById(`event-${i}`).classList.add('selected');
  })(index);
  eventDiv.onmouseleave = ((i) => (event) => {
    document.getElementById(`event-${i}`).classList.remove('selected');
  })(index);

  eventTimeline.appendChild(eventDiv)
}

function getCalendarEvents() {
  const startDate = new Date();
  startDate.setHours(0, 0, 0 ,0);
  const startDateString = startDate.toISOString();
  const endDate = new Date();
  endDate.setHours(23,59,59,999);
  const endDateString = endDate.toISOString();

  gapi.client.request({
    path: `https://www.googleapis.com/calendar/v3/calendars/${'alex.bieg@4cinsights.com'}/events`,
    params: {
      timeMin: startDateString,
      timeMax: endDateString,
    }
  }).then(({ result }) => {
    events = result.items.sort(function(a,b){
      return new Date(a.start.dateTime) - new Date(b.start.dateTime);
    });;

    const eventList = document.getElementById('calendar-events');
    // Remove loading text
    eventList.innerHTML = '';
    // eventList.removeChild(eventList.firstChild);
    const eventTimeline = document.getElementById('busy-timeline');

    events.forEach((event, index) => {
      eventList.appendChild(buildCalendarEventDom(event, index));
    });

    events.forEach((event, index) => {
      buildCalendarTimeline(event, eventTimeline, index);
    });

    console.log(events);
  })
}
