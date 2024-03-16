import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

const CodeEditor = (props) => {
  const { code, setCode } = props;
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value, viewUpdate);
    setCode(value);
  }, []);

  return (
    <CodeMirror
      value={code}
      height="100%"
      theme={okaidia}
      extensions={[loadLanguage("python")]}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
