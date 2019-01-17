/*
 * Testing out resizing panes and inter-widget signaling with Phosphor JS
 */

import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@phosphor/messaging';

import {
  BoxPanel, DockPanel, Widget
} from '@phosphor/widgets';

import {
  Signal, ISignal
} from '@phosphor/signaling';

import { ContentWidget } from './contentwidget';

import { OutSignals, SignalRouter } from './routing';

import '../style/index.css';

// the main function, returns null
function main(): void {
  
  // instantiate some of our ContentWidget classes
  let r1 = new ContentWidget('Red');
  let b1 = new ContentWidget('Blue');
  let g1 = new ContentWidget('Green');
  let y1 = new ContentWidget('Yellow');

  let r2 = new ContentWidget('Red');

  // create a new DockPanel and add our ContentWidgets
  let dock = new DockPanel();
  // add first content pane
  dock.addWidget(r1);
  // split screen and add new content pane to the right
  dock.addWidget(b1, { mode: 'split-right', ref: r1 });
  // the right pane and add new content pane below
  dock.addWidget(y1, { mode: 'split-bottom', ref: b1 });
  // split the left pane and add new content pane below
  dock.addWidget(g1, { mode: 'split-bottom', ref: r1 });
  // add a new tab to the top right pane
  dock.addWidget(r2, { ref: b1 });
  // change the dock id
  dock.id = 'dock';

  // connect up the widgets
  const signalRouter = new SignalRouter();
  signalRouter.register(r1);
  signalRouter.register(b1);
  signalRouter.register(g1);
  signalRouter.register(y1);
  
  signalRouter.setup();

  BoxPanel.setStretch(dock, 1);

  let main = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  main.id = 'main';
  main.addWidget(dock);

  // update the main BoxPanel on window resize
  window.onresize = () => { main.update(); };

  // call the static method of the Widget class 'attach'
  // attaches the widget to an dom node
  // attaches the menu bar and the main panels to the body element
  Widget.attach(main, document.body);
}

// call the 'main' function onload
window.onload = main;
