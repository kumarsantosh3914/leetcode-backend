const bashConfig = ['/bin/bash', '-c'];

export const commands = {
    python: function(code: string) {
        const runCommand = `echo '${code}' > code.py && python3 code.py`;
        return [...bashConfig, runCommand];
    },
    cpp: function(code: string) {
        const runCommand = `mkdir app && cd app && echo '${code}' > code.cpp && g++ code.cpp -o run && ./run`
        return [...bashConfig, runCommand];
    }
}