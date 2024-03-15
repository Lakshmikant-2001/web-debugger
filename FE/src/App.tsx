import React from "react";
import CodeEditor from "./components/CodeEditor";
import LocalVariable from "./components/LocalVariable";
import GlobalVariable from "./components/GlobalVariable";
import Console from "./components/Console";

const App = () => {
  return (
    <div className="bg-white p-7 h-screen">
      <div className="flex flex-1 gap-4 h-1/2">
        <div className="w-2/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <CodeEditor />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <LocalVariable />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <GlobalVariable />
        </div>
      </div>
      <div className="w-100 mt-3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg h-1/2">
        <Console />
      </div>
    </div>
  );
};

export default App;
