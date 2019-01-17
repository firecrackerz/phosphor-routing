import {
  Widget
} from '@phosphor/widgets';

import {
  Signal, ISignal, Slot
} from '@phosphor/signaling';

import {
  Message
} from '@phosphor/messaging';


import { InSignals, OutSignals, Routable } from './routing';

// widgets with a background colour and ability to send and receive signals 
export class ContentWidget extends Widget implements Routable {

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


