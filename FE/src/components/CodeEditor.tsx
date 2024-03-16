import React, { useRef, useEffect } from "react";
import { ReactCodeMirrorRef, basicSetup } from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";

import { StateField, StateEffect, RangeSet } from "@codemirror/state";
import { EditorView, gutter, GutterMarker } from "@codemirror/view";
import ReactCodeMirror from "@uiw/react-codemirror";
import { pythonLanguage } from "@codemirror/lang-python";

const breakpointEffect = StateEffect.define<{ pos: number; on: boolean }>({
  map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
});

const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() {
    return RangeSet.empty;
  },
  update(set, transaction) {
    set = set.map(transaction.changes);

    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on) {
          set = set.update({ add: [breakpointMarker.range(e.value.pos)] });
        } else set = set.update({ filter: (from) => from != e.value.pos });
      }
    }

    return set;
  },
});

const breakpointMarker = new (class extends GutterMarker {
  toDOM() {
    return document.createTextNode("●");
  }
})();

const CodeEditor = (props) => {
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const { code, setCode, onBreakpointChange } = props;
  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
  }, []);

  function toggleBreakpoint(view: EditorView, pos: number) {
    let breakpoints = view.state.field(breakpointState);
    let hasBreakpoint = false;
    breakpoints.between(pos, pos, () => {
      hasBreakpoint = true;
    });

    view.dispatch({
      effects: breakpointEffect.of({ pos, on: !hasBreakpoint }),
    });
    let breakpoint: number = view.state.doc.lineAt(pos)?.number;
    breakpoint && onBreakpointChange(breakpoint, hasBreakpoint);
  }

  const breakpointGutter = [
    breakpointState,
    gutter({
      class: "cm-breakpoint-gutter",
      renderEmptyElements: true,
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

  useEffect(() => {
    // console.log(editorRef.current, "editorRef.current?.view");
  }, [editorRef.current]);

  return (
    <ReactCodeMirror
      value={code}
      height="100%"
      theme={okaidia}
      ref={editorRef}
      basicSetup={false}
      extensions={[...breakpointGutter, basicSetup(), pythonLanguage]}
      onChange={onChange}
      onStatistics={(data) => {
        // console.log("namme", data);
      }}
    />
  );
};

export default CodeEditor;
