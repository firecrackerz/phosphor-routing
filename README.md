Quick test to try out Phosphor JS library. Altered the DockPanel example to focus on resizeable panes and routing signals between widgets.

Widgets implement Routable to define signals they emit and those they can receive. Routable widgets are registered with a SignalRouter which connects emitted signals to corresponding Slot functions on other widgets.
