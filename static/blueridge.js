/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const { h, app } = window.hyperapp;

const randPlusMinus = n => Math.random() * n - n/2;

const mkMidpoints = points => {
  const newPoints = [];
  for (let i = 0; i < points.length*2 -1; i++) {
    if (i % 2 === 0) {
      newPoints[i] = points[i/2];
    } else {
      newPoints[i] = (points[(i-1)/2] + points[(i+1)/2]) / 2 + randPlusMinus(100/points.length);
    }
  }
  return newPoints;
}
const midpointDisplacement = () => {
  let points = new Array(8).fill(0).map(() => Math.random() * 25 + 30);
  for (const i of new Array(8))
    points = mkMidpoints(points);
  return points;
}

const actions = {
  generatePoints: state => ({points: new Array(10).fill(0).map(() => midpointDisplacement())}),
};

const state = {
  ...actions.generatePoints(),
};

const arrayToD = points => {
  const parts = ['M', '-200,200'];
  for (const i in points) {
    parts.push(`${i * 500 / (points.length - 1) - 200},${points[i] + 20}`);
  }
  parts.push([300,200]);
  return parts.join(' ');
};

const mountainRange = (fill, points) => h('path', {fill, d: arrayToD(points)}, []);

const generateMountainRanges = (points) => {
  const [sMin, sMax] = [30, 40];
  const [lMin, lMax] = [24, 40];
  const ranges = [];
  for (const i in points) {
    const s = sMin + (sMax - sMin) / points.length * i;
    const l = lMin + (lMax - lMin) / points.length * i;
    ranges.push(mountainRange(`hsl(209, ${s}%, ${l}%)`, points[i].map(p=>p-i)));
  }
  ranges.reverse();
  return ranges;
};

const sky = () => h('rect', {x: -200, y: -100, height: 300, width: 500, fill: 'hsl(211, 16%, 34%)'}, []);

const view = (state, actions) => {
  return h('svg', {
    viewBox: '0 0 100 100',
    style: {width: '100%', height: '100%'}
    //onclick: actions.generatePoints,
  }, [
    sky(),
    ...generateMountainRanges(state.points),
  ]);
};

app(state, actions, view, document.getElementById('mountains'));
