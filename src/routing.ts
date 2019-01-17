
import { Signal, ISignal, Slot } from '@phosphor/signaling';


// defines properties of 
export interface InSignals {
  [prop: string]: Slot<object, string>;
}

export interface OutSignals {
  [prop: string]: ISignal<object, string>;
}

// to be used as a mixin
// adding properties in and out to an object
// in is an array of functions to perform actions on certain signals
// out is an array of Signal objects
export interface Routable {
  in: InSignals;
  out: OutSignals;
}

// Routable objects should be registered with the SignalRouter
// after registering the signals can all be linked up
// the possible Signals should be defined somewhere and checked during routing
// the args for each Signal should also be defined
export class SignalRouter {

  private widgets: Array<Routable> = [];

  constructor() {

  }

  // adds the widget to widgets array
  // eventually it would be nice to add an array of Routables at a time
  public register(widget: Routable): void {
    this.widgets.push(widget);  
  }

  // connects signals of different types on registered widgets
  public setup(): void {
    for (let i = 0; i < this.widgets.length; i++) {
      // get the out signals
      const outSignals: OutSignals = this.widgets[i].out;

      // loop over the out signals
      for (let outSignalProp in outSignals) {
        // loop over other widgets
        for (let j = 0; j < this.widgets.length; j++) {
          if (i != j) {
            const inFunc = this.widgets[j].in[outSignalProp];
	    if (inFunc) {
              outSignals[outSignalProp].connect(inFunc, this.widgets[j]);
	    }
	  }
        }
      }
    }


  }

}
