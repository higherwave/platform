// Sample data for Platform Insights.dc.html. Replace with API/database reads.
window.SFData = window.SFData || {};
window.SFData.platformInsights = {
  C: [
    { title: 'Rebuilding provider search around availability', summary: 'Search results now lead with each provider’s next open time. Participants stopped opening profiles one by one to find a slot.', outcome: 'Booking completion rose from 61% to 78%', bg: '#f5e9d4', owner: 'Booking team', date: 'Sep 2026', th: [0] },
    { title: 'Showing coverage before booking', summary: 'A coverage badge on each listing tells people whether their plan is accepted before they pick a provider.', outcome: 'Coverage-related support calls fell 23%', bg: '#a8d8c4', owner: 'Pricing team', date: 'Aug 2026', th: [1, 4] },
    { title: 'Self-serve reschedule pilot', summary: 'Reschedule and cancel moved onto the appointment card for a pilot group of clinics.', outcome: '41% of reschedules completed in the app', bg: '#d9d2f2', owner: 'Booking team', date: 'Jul 2026', th: [2] },
    { title: 'Visit prep checklist rollout', summary: 'A checklist and directions message now follows every confirmed booking.', outcome: 'No-shows fell 9% for pilot clinics', bg: '#c9e4f5', owner: 'Notifications team', date: 'Jun 2026', th: [3] },
  ],
  P: [
    { name: 'Clinic booking, round 1', short: 'Round 1', bg: '#f5e9d4', n: 3, sub: '3 participants' },
    { name: 'Clinic booking, round 2', short: 'Round 2', bg: '#a8d8c4', n: 4, sub: '4 participants' },
    { name: 'Check-in diary study', short: 'Diary study', bg: '#d9d2f2', n: 6, sub: '6 participants' },
  ],
  CAT: { 'Pain point': ['#f6d3c4', '#7a1f00'], 'Need': ['#f5e9d4', '#5a3d00'], 'Expectation': ['#a8d8c4', '#0a2e0e'], 'Delight': ['#f4d35e', '#181d26'] },
  T: [
    { title: 'Provider availability is hard to see', cat: 'Pain point', src: [
      { p: 0, n: 3, q: [{ w: 'P1', s: 'Session 1', t: '08:12', x: 'I had to open every doctor one by one just to find an opening.' }] },
      { p: 1, n: 3, q: [{ w: 'P6', s: 'Session 2', t: '14:32', x: 'I can’t tell who is free this week without clicking through.' }] },
      { p: 2, n: 5, q: [{ w: 'P9', s: 'Day 3 entry', t: '', x: 'Gave up and called the clinic because the calendar never loaded.' }] }] },
    { title: 'Insurance coverage is unclear up front', cat: 'Pain point', src: [
      { p: 0, n: 2, q: [{ w: 'P2', s: 'Session 2', t: '21:05', x: 'I picked a doctor and only then found out they don’t take my plan.' }] },
      { p: 1, n: 3, q: [{ w: 'P5', s: 'Session 1', t: '11:48', x: 'Show me what’s covered before I start booking.' }, { w: 'P7', s: 'Session 3', t: '05:20', x: 'I wasn’t sure if “in network” meant I’d pay nothing.' }] }] },
    { title: 'People expect to reschedule without calling', cat: 'Expectation', src: [
      { p: 0, n: 2, q: [{ w: 'P3', s: 'Session 3', t: '17:40', x: 'There should be a button right on the appointment.' }] },
      { p: 1, n: 4, q: [{ w: 'P4', s: 'Session 2', t: '09:15', x: 'Every other service lets me move a booking in two taps.' }] },
      { p: 2, n: 3, q: [{ w: 'P11', s: 'Day 5 entry', t: '', x: 'Had a conflict at work and had no way to shift it in the app.' }] }] },
    { title: 'A prep checklist before the visit is valued', cat: 'Delight', src: [
      { p: 1, n: 3, q: [{ w: 'P6', s: 'Session 4', t: '12:02', x: 'This list of what to bring is exactly what I needed.' }] },
      { p: 2, n: 4, q: [{ w: 'P10', s: 'Day 2 entry', t: '', x: 'The reminder with directions saved me a stressful morning.' }] }] },
    { title: 'Fees appear late at checkout', cat: 'Pain point', src: [
      { p: 0, n: 1, q: [{ w: 'P1', s: 'Session 3', t: '24:18', x: 'The price changed on the last screen. That felt off.' }] },
      { p: 1, n: 2, q: [{ w: 'P8', s: 'Session 2', t: '18:33', x: 'Why is the fee only showing up now?' }] }] },
  ],
  R: [
    { title: 'Show live provider availability in search results', why: 'Participants in every project struggled to find an open slot without opening each provider. Showing next-available times in the list removes the extra clicks.', prio: 'High', th: [0, 2] },
    { title: 'Show coverage and the all-in price on each listing', why: 'Coverage and fees both surfaced late, after participants had chosen a provider. Moving them earlier lets people decide with the full picture.', prio: 'High', th: [1, 4] },
    { title: 'Add self-serve reschedule and cancel to the appointment', why: 'Reschedule was expected in all three projects and was missing in each, which sent people to the phone.', prio: 'High', th: [2] },
    { title: 'Send a prep checklist and directions after booking', why: 'The checklist and reminder were the most positive moments in two projects. Expanding them to all visit types extends that effect.', prio: 'Medium', th: [3] },
  ],
};
