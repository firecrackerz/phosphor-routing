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

import '../style/index.css';

// interface defining the possible signals a widget can emit
interface OutSignals {
  [key:string]: any;
}

// interface defining the possible signals a widget can listen for
interface InSignals {
  [key:string]: any;
}

// widgets with a background colour and ability to send and receive signals 
class ContentWidget extends Widget {

  // static function createNode returning an HTMLElement type
  static createNode(): HTMLElement {
    let node = document.createElement('div');
    let content = document.createElement('div');
    node.appendChild(content);
    return node;
  }

  // ContentWidget constructor, takes a string argument 'name'
  constructor(name: string) {
    // call the superclass constructor with a new node argument
    super({ node: ContentWidget.createNode() });
    // what does this do?
    this.setFlag(Widget.Flag.DisallowLayout);
    // this class probably comes from imported css?
    this.addClass('content');
    this.addClass(name.toLowerCase());
    this.title.label = name;
    this.title.closable = true;
    this.title.caption = `Long description for: ${name}`;

    // add a click event listener on node div
    // when the div is clicked, a signal is emitted
    // with the name of the widget as an arg
    let outWidgetClicked = this._outWidgetClicked;
    this.node.addEventListener('click', function() {
      outWidgetClicked.emit(name)
    });
  }

  // getter for outbound signal to emit when the widget is clicked
  get outWidgetClicked(): ISignal<this, string> {
    return this._outWidgetClicked;
  }

  // the outbound signal to emit when the widget is clicked
  private _outWidgetClicked = new Signal<this, string>(this);

  // the action to take when an inbound WidgetClicked signal received 
  inWidgetClicked(sender: Widget, value: string): void {
    this.node.children[0].innerHTML = `The widget with name ${value} was clicked`; 
  }

  // object containing the available outbound signals
  public out: OutSignals = {
    widgetClicked: this.outWidgetClicked
  };

  // object containing possible actions to take on receipt of inbound signals
  public in: InSignals = {
    widgetClicked: this.inWidgetClicked
  };
  
  // gets the input element (using a get accessor)
  // returns an HTMLInputElement type
  get inputNode(): HTMLInputElement {
    // use a type assertion to tell the compiler an HTMLInputElement type
    // is returned from getElementsByTagName 
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }
  
  // returns null, takes a Message argument named 'msg'
  protected onActivateRequest(msg: Message): void {
    if (this.isAttached) {
      this.inputNode.focus();
    }
  }
}

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

  /* 
   * now connect up our widgets
   * this should be handled in a ConnectionRouter class or something...
   */

  // the widgets we want to connect
  const widgets: ContentWidget[] = [r1, b1, g1, y1];
  
  for (let i = 0; i < widgets.length; i++) {
    // get the out signals
    const outSignals: OutSignals = widgets[i].out;

    // loop over the out signals
    for (let outSignalProp in outSignals) {
      // loop over other widgets
      for (let j = 0; j < widgets.length; j++) {
        if (i != j) {
          const inFunc = widgets[j].in[outSignalProp];
	  if (inFunc) {
            outSignals[outSignalProp].connect(inFunc, widgets[j]);
	  }
	}
      }
    }
  }

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
