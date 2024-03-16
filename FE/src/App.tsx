import React, { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import LocalVariable from "./components/LocalVariable";
import GlobalVariable from "./components/GlobalVariable";
import Console from "./components/Console";
import io from "socket.io-client";
const socket = io("ws://localhost:5000");

const App = () => {
  const [code, setCode] = useState(`print("Hello world")`);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [consoleData, setConsoleData] = useState("");
  const [isDebugMode, setDebugMode] = useState(false);

  const handleContinue = () => {
    console.log("command continue.....");
    socket.emit("command", "continue()");
  };

  const handleNext = () => {
    console.log("command next.....");
    socket.emit("command", "next()");
  };

  const handleDebugger = () => {
    setDebugMode(true);
    console.log("code postingg.....", code);
    socket.emit("code", code);
  };

  const onBreakpointChange = (breakpoint, hasBreakpoint) => {
    const list = !hasBreakpoint
      ? [breakpoint, ...breakpoints]
      : breakpoints?.filter((v) => v != breakpoint);
    list && setBreakpoints(list);
  };

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected....");
    });
    socket.on("connection-success", () => {
      console.log("connection success emitted from server");
    });
    socket.on("code_execution", (data) => {
      console.log("code executed", data);
    });
    socket.on("command_execution", (data) => {
      console.log("command executed", data);
      if (data !== "__return__") setConsoleData(data);
      else {
        setDebugMode(false);
        setConsoleData("");
      }
    });
  }, [socket]);

  return (
    <div className="bg-white p-7 h-screen">
      <div className="flex flex-1 gap-4 h-2/3">
        <div className="w-2/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <CodeEditor
            code={code}
            setCode={setCode}
            onBreakpointChange={onBreakpointChange}
          />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <LocalVariable />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <GlobalVariable />
        </div>
      </div>
      <div className="h-1/2">
        <div className="flex items-center py-3">
          <button
            type="button"
            className="text-white bg-red-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleDebugger}
          >
            Debug
          </button>
          <button
            type="button"
            className="text-white bg-gray-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleNext}
            disabled={!isDebugMode}
          >
            Next
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleContinue}
            disabled={!isDebugMode}
          >
            Continue
          </button>
        </div>
        <div className="w-100 mt-3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg  h-1/4">
          <Console data={consoleData} />
        </div>
      </div>
    </div>
  );
};

export default App;
