const bashConfig = ['/bin/bash', '-c'];

export const commands = {
    python: function(code: string, input?: string) {
        let runCommand = `echo '${code}' > code.py`;
        
        if (input) {
            // Create input file and pipe it to the program
            runCommand += ` && echo '${input}' > input.txt && python3 code.py < input.txt`;
        } else {
            runCommand += ` && python3 code.py`;
        }
        
        return [...bashConfig, runCommand];
    },
    
    cpp: function(code: string, input?: string) {
        let runCommand = `mkdir app && cd app && echo '${code}' > code.cpp && g++ code.cpp -o run`;
        
        if (input) {
            runCommand += ` && echo '${input}' > input.txt && ./run < input.txt`;
        } else {
            runCommand += ` && ./run`;
        }
        
        return [...bashConfig, runCommand];
    }
}