import React from "react";
import CodeMirror, { lineNumbers } from "@uiw/react-codemirror";
// import {StateField, StateEffect, RangeSet} from "@codemirror/state"
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import {
  EditorView,
  gutter,
  GutterMarker,
  lineNumberMarkers,
} from "@codemirror/view";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { StateField, StateEffect, RangeSet } from "@codemirror/state";

const WrapperCodeMirror = () => {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value, viewUpdate);
  }, []);
  // loadLanguage('python')
  const breakpointEffect =
    StateEffect.define <
    {} >
    {
      map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
    };

  const breakpointState =
    StateField.define <
    RangeSet <
    GutterMarker >>
      {
        create() {
          return RangeSet.empty;
        },
        update(set, transaction) {
          set = set.map(transaction.changes);
          for (let e of transaction.effects) {
            if (e.is(breakpointEffect)) {
              if (e.value.on)
                set = set.update({
                  add: [breakpointMarker.range(e.value.pos)],
                });
              else set = set.update({ filter: (from) => from != e.value.pos });
            }
          }
          return set;
        },
      };

  // function toggleBreakpoint(view, pos) {
  //   let breakpoints = view.state.field(breakpointState)
  //   let hasBreakpoint = false
  //   breakpoints.between(pos, pos, () => {hasBreakpoint = true})
  //   view.dispatch({
  //     effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  //   })
  // }

  const breakpointMarker = new (class extends GutterMarker {
    toDOM() {
      return document.createTextNode("💔");
    }
  })();

  const breakpointGutter = [
    breakpointState,
    gutter({
      class: "cm-breakpoint-gutter",
      markers: (v) => v.state.field(breakpointState),
      initialSpacer: () => breakpointMarker,
      domEventHandlers: {
        mousedown(view, line) {
          toggleBreakpoint(view, line.from);
          return true;
        },
      },
    }),
    EditorView.baseTheme({
      ".cm-breakpoint-gutter .cm-gutterElement": {
        color: "red",
        paddingLeft: "5px",
        cursor: "default",
      },
    }),
  ];

  const emptyMarker = new (class extends GutterMarker {
    toDOM() {
      return document.createTextNode("ø");
    }
  })();

  const emptyLineGutter = gutter({
    lineMarker(view, line) {
      return line.from == line.to ? emptyMarker : null;
    },
    initialSpacer: () => emptyMarker,
  });

  return (
    <CodeMirror
      value={`print("hi")
      a = 1
      print(a)`}
      height="400px"
      theme={okaidia}
      extensions={[
        lineNumbers({
          formatNumber: (lineNo, state) => {
            return lineNo;
          },
        }),
        gutter({
          class: "breakpoints",
          renderEmptyElements: true,
          lineMarkerChange: ((update) => {

return true
          }),
          // lineMarker: ((view,
          //   line,
          //   otherMarkers) => {
          //   debugger
          // }),
        //   domEventHandlers() {
        //     scroll: () => alert('scroll'),
        // }
        }),
      ]}
      onChange={onChange}
    />
  );
};

export default WrapperCodeMirror;
