import React, { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import LocalVariable from "./components/LocalVariable";
import GlobalVariable from "./components/GlobalVariable";
import Console from "./components/Console";
import io from 'socket.io-client';

const App = () => {
  const [code, setCode] = useState(`import web_pdb\nweb_pdb.set_trace()\nprint("hi")\na = 1\nprint(a)`);
  // const [socketState, setSocketState] = useState(socket);
  const [breakpoint, setBreakpoint] = useState(0);

  const [responseData, setResponseData] = useState({});

  const handleContinue = () => {
    // socketState.emit("command", "continue()");
  };

  const handleNext = () => {
    // socketState.emit("next", {});
  };

  const handleDebugger = () => {
    // socketState.emit("debug", {});
  };

  // useEffect(() => {
  //   // socket.on("received", (data) => {
  //   //   console.log("data", data);
  //   // });
  // }, [socketState]);
  // console.log("socket", socket);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('ws://127.0.0.1:5000/');
    console.log("connection", socketInstance.connect());
    // setSocket(socketInstance);
  
    // listen for events emitted by the server
  
    socketInstance.on('connection-success', () => {
      console.log('Connected to server');
    });
  
    socketInstance.on('message', (data) => {
      console.log(`Received message: ${data}`);
    });
    console.log("connection", socketInstance);
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <div className="bg-white p-7 h-screen">
      <div className="flex flex-1 gap-4 h-1/2">
        <div className="w-2/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <CodeEditor code={code} setCode={setCode} />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <LocalVariable />
        </div>
        <div className="w-1/3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <GlobalVariable />
        </div>
      </div>
      <div className="h-1/2">
        <div className="flex items-center gap-4 py-3">
          <label className="block mb-2 font-medium text-gray-900 dark:text-white">
            Breakpoint :
          </label>
          <input
            type="number"
            id="breakpoint"
            className="bg-gray-50 border border-gray-300 rounded-sm"
            value={breakpoint}
            required
            onChange={(event) => {
              setBreakpoint(Number(event.target.value));
            }}
          />
          <button
            type="button"
            className="text-white bg-blue-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleContinue}
          >
            Continue
          </button>
          <button
            type="button"
            className="text-white bg-gray-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleNext}
          >
            Next
          </button>
          <button
            type="button"
            disabled={!breakpoint}
            className="text-white bg-red-700 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2"
            onClick={handleDebugger}
          >
            Debugger
          </button>
        </div>
        <div className="w-100 mt-3 relative overflow-hidden bg-gray-900 shadow-1xl text-white p-2 rounded-lg">
          <Console />
        </div>
      </div>
    </div>
  );
};

export default App;
