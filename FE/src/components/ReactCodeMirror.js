import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";

const WrapperCodeMirror = () => {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <CodeMirror
      value="console.log('hello world!');"
      height="400px"
      theme={okaidia}
    //   extensions={[StreamLanguage.define(python())]}
      onChange={onChange}
    />
  );
};

export default WrapperCodeMirror;
