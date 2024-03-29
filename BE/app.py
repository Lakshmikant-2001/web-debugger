import os
import subprocess
import threading
from flask import Flask

from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit



app = Flask(__name__)

# Socket io setup.
app.config['SECRET_KEY'] = 'secret!'
# |cors_allowed_origins| is required for localhost testing.
socket = SocketIO(app, cors_allowed_origins="*")

# For localhost testing.
CORS(app)

DEBUGGER_DEFAULT_BREAKPOINT = """
import pdb
pdb.set_trace()
"""

class HandleProcess():
    def __init__(self):
        self.process = None
    
    def start_process(self):
        self.process = subprocess.Popen(['python3', 'main.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    def write_input(self, command):
        try:
            if self.process:
              self.process.stdin.write(command + '\n')
              self.process.stdin.flush()
        except Exception as e:
            print(e,'error send input')
            raise

    def read_input(self):
        try:
            if self.process:
                message = self.process.stdout.readline()
                if '--Return--' in message:
                    self.process.kill()
                    return '__return__'
                return message
            return ''
        except Exception as e:
            print(e,'error read input')
            raise
    
handler = HandleProcess()
@socket.on('connect')
def connection():
    try:
        print("client connected")
        emit('connection-success',
         {'data': 'Server is connected'})
    except Exception as e:
        print(e,'error ')
        

@socket.on('code')
def send_code(data):
    try:
        with open("main.py", "w+") as mainf:
            mainf.write(DEBUGGER_DEFAULT_BREAKPOINT)
            mainf.write(data)
        handler.start_process()
        emit('code_execution',
         {'data': 'Code exectuion started'})

    except Exception as e:
        print(e,'error ')

@socket.on('command')
def send_command(command):
    try:
        print('-------received input------\t', command)

        # handler.write_input(command)
        
        writer = threading.Thread(target=handler.write_input, args=(command,))
        writer.start()
        message = handler.read_input()
        print('-------send message response-------\t', message)
        emit('command_execution', message)
        # print(handler.process, 'Process runiing')

    except Exception as e:
        print(e,'error ')

@socket.on('hello')
def test_connect(command):
    try:
        print(command,'Listen from client emit')
       
        

    except Exception as e:
        print(e,'error ')



# executor = subprocess.run(["python3", "proper/main.py"])
# Send commands to the stdin of the process



# print("stdout")
# while process.poll() is None:
#     # Read stdout and stderr
#     stdout_line = process.stdout.readline().strip()
#     print(stdout_line)
#     stderr_line = process.stderr.readline().strip()

# Close the stdin to indicate no more input
# process.stdin.close()
# Read output and errors
# exit_code = process.wait()

# output, error = process.communicate()
# # Wait for the process to finish
# print(f"Output:\n{output}")
# print(f"Errors:\n{error}")
# print(f"Exit code: {exit_code}")

# outs, err = executor.communicate()

# print(f"Out: {outs}, Err: {err}")
        

if __name__ == '__main__':
    print("Starting websocket server")
