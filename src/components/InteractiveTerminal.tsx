import React, { useState, useEffect, useRef } from 'react';
import { projectList } from '../lib/projects';

interface InteractiveTerminalProps {
  onExit: () => void;
}

interface TerminalLine {
  type: 'input' | 'output';
  content: React.ReactNode;
}

import ReactMarkdown from 'react-markdown';

export function InteractiveTerminal({ onExit }: InteractiveTerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to JugadOS v1.0.1' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [currentPath, setCurrentPath] = useState('~');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [history, input, cursorPos]); // Scroll when input or cursor changes too

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (trimmedCmd) {
        setCommandHistory(prev => [...prev, trimmedCmd]);
        setHistoryIndex(-1);
    }
    
    // Reset cursor
    setCursorPos(0);

    const commandParts = trimmedCmd.split(' ');
    const mainCommand = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);
    
    // Add command to history with current path
    const newHistory = [...history, { type: 'input', content: <><span className="text-blue-400 mr-2">{currentPath}</span>{trimmedCmd}</> } as TerminalLine];

    switch (mainCommand) {
      case 'help':
        setHistory([
          ...newHistory,
          {
            type: 'output',
            content: (
              <div className="space-y-1">
                <p>Available commands:</p>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-[#00ff00]">whoami</span>
                  <span>About me</span>
                  <span className="text-[#00ff00]">ls</span>
                  <span>List projects/files</span>
                  <span className="text-[#00ff00]">cd</span>
                  <span>Change directory (e.g., cd Nodebase)</span>
                  <span className="text-[#00ff00]">cat</span>
                  <span>View file content (e.g., cat README.md)</span>
                  <span className="text-[#00ff00]">contact</span>
                  <span>Contact information</span>
                  <span className="text-[#00ff00]">clear</span>
                  <span>Clear terminal</span>
                  <span className="text-[#00ff00]">exit</span>
                  <span>Return to GUI mode</span>
                </div>
              </div>
            ),
          },
        ]);
        break;
      case 'whoami':
        setHistory([
          ...newHistory,
          {
            type: 'output',
            content: 'ReferenceError: Identity not found... Just kidding. I am Raghav Seth, a Backend Engineer working with strongly typed languages like TypeScript and Java, and running on caffeine.',
          },
        ]);
        break;
      case 'ls':
      case 'projects':
        if (currentPath === '~') {
          setHistory([
            ...newHistory,
            {
              type: 'output',
              content: (
                <div className="space-y-4 mt-2">
                  <div className="text-gray-400 mb-2">Projects available (type 'cd &lt;name&gt;' to enter):</div>
                  {projectList.map((project, idx) => (
                    <div key={idx} className="border-l-2 border-[#00ff00] pl-4">
                      <div className="font-bold text-[#00ff00]">{project.name}</div>
                      <div className="text-sm opacity-80">{project.description}</div>
                      <div className="flex gap-4 mt-1 text-xs">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="underline hover:bg-[#00ff00] hover:text-black">
                            [Live Demo]
                          </a>
                        )}
                        {project.gitlink && (
                          <a href={project.gitlink} target="_blank" rel="noopener noreferrer" className="underline hover:bg-[#00ff00] hover:text-black">
                            [Source Code]
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]);
        } else {
            const projectName = currentPath.split('/')[1];
            const project = projectList.find(p => p.name === projectName);

            if (project && project.gitlink) {
              setHistory([...newHistory, { type: 'output', content: 'Fetching file list...' }]);

              const match = project.gitlink.match(/github\.com\/([^/]+)\/([^/]+)/);
              if (match) {
                const [, user, repo] = match;
                const contentsUrl = `https://api.github.com/repos/${user}/${repo}/contents`;

                try {
                  const response = await fetch(contentsUrl);
                  if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a: any, b: any) => {
                      if (a.type === b.type) return a.name.localeCompare(b.name);
                      return a.type === 'dir' ? -1 : 1;
                    });

                    setHistory(prev => [
                      ...prev.slice(0, prev.length - 1),
                      {
                        type: 'output',
                        content: (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {sortedData.map((item: any) => (
                              <div key={item.name} className={`${item.type === 'dir' ? 'text-blue-400 font-bold' : 'text-gray-300'}`}>
                                {item.name}{item.type === 'dir' ? '/' : ''}
                              </div>
                            ))}
                          </div>
                        )
                      }
                    ]);
                  } else {
                     setHistory(prev => [
                      ...prev.slice(0, prev.length - 1),
                       { type: 'output', content: 'Error: Failed to fetch file list from GitHub (Rate Limit or Private Repo).' }
                     ]);
                  }
                } catch (e) {
                   setHistory(prev => [
                      ...prev.slice(0, prev.length - 1),
                     { type: 'output', content: 'Error: Network error while fetching files.' }
                   ]);
                }
              } else {
                setHistory([...newHistory, { type: 'output', content: 'Error: Invalid GitHub URL.' }]);
              }
            } else {
               setHistory([...newHistory, { type: 'output', content: 'README.md' }]);
            }
        }
        break;
    
      case 'cd':
        if (args.length === 0 || args[0] === '~') {
          setCurrentPath('~');
          setHistory([...newHistory]);
        } else if (args[0] === '..') {
          setCurrentPath('~');
          setHistory([...newHistory]);
        } else {
            const targetDir = args.join(' '); 
            
            if (currentPath === '~') {
                const foundProject = projectList.find(p => p.name.toLowerCase() === targetDir.toLowerCase());
                
                if (foundProject) {
                  setCurrentPath(`~/${foundProject.name}`);
                  setHistory([...newHistory]);
                } else {
                  setHistory([
                    ...newHistory,
                    { type: 'output', content: `cd: no such file or directory: ${targetDir}` }
                  ]);
                }
            } else {
                setHistory([
                  ...newHistory,
                  { type: 'output', content: `cd: no such file or directory: ${targetDir}` }
                ]);
            }
        }
        break;

    case 'cat':
    case 'readme':
        const initialFileName = args[0] || 'README.md';
        
        if (currentPath === '~') {
            setHistory([
                ...newHistory,
                { type: 'output', content: 'cat: available only inside project directories' }
            ]);
        } else {
            const projectName = currentPath.split('/')[1];
            const project = projectList.find(p => p.name === projectName);
            
            if (project && project.gitlink) {
                setHistory([...newHistory, { type: 'output', content: `Fetching ${initialFileName}...` }]);
                 
                 try {
                     const match = project.gitlink.match(/github\.com\/([^/]+)\/([^/]+)/);
                     if (match) {
                        const [, user, repo] = match;
                        
                        const fetchFile = async (name: string) => {
                            let rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/main/${name}`;
                            let response = await fetch(rawUrl);
                            
                            if (!response.ok) {
                                rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/master/${name}`;
                                response = await fetch(rawUrl);
                            }
                            
                            return response;
                        };

                        let response = await fetchFile(initialFileName);
                        let finalFileName = initialFileName;

                        if (!response.ok) {
                             try {
                                 const contentsUrl = `https://api.github.com/repos/${user}/${repo}/contents`;
                                 const contentsRes = await fetch(contentsUrl);
                                 if (contentsRes.ok) {
                                     const files: any[] = await contentsRes.json();
                                     const match = files.find(f => f.name.toLowerCase() === initialFileName.toLowerCase());
                                     if (match) {
                                         finalFileName = match.name;
                                         response = await fetchFile(finalFileName);
                                     }
                                 }
                             } catch (ignore) {
                             }
                        }

                        if (response.ok) {
                            const text = await response.text();
                            setHistory(prev => [
                                ...prev.slice(0, prev.length - 1),
                                {  
                                  type: 'output', 
                                  content: (
                                    <div className="terminal-markdown text-xs md:text-sm text-gray-300 font-mono">
                                      <ReactMarkdown>{text}</ReactMarkdown>
                                    </div>
                                  )
                                }
                            ]);
                        } else {
                            throw new Error('Not found');
                        }
                     } else {
                          setHistory(prev => [
                                 ...prev.slice(0, prev.length - 1),
                                { type: 'output', content: 'Error: Invalid GitHub link format.' }
                        ]);
                     }
                 } catch (error) {
                       setHistory(prev => [
                                 ...prev.slice(0, prev.length - 1),
                                { type: 'output', content: `Error: Could not fetch ${initialFileName}. It might not exist or is in a subdirectory.` }
                        ]);
                 }
             } else {
                  setHistory([
                    ...newHistory,
                    { type: 'output', content: 'Error: Project repository not found.' }
                  ]);
             }
        }
        break;

      case 'contact':
        setHistory([
          ...newHistory,
          {
            type: 'output',
            content: (
              <div className="flex flex-col gap-1">
                <a href="https://www.linkedin.com/in/raghav-seth-a49902205" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn: raghav-seth
                </a>
                <a href="https://github.com/Raghav1428" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub: @Raghav1428
                </a>
              </div>
            ),
          },
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        onExit();
        return;
      case '':
        break;
      default:
        setHistory([
          ...newHistory,
          { 
            type: 'output', 
            content: `Command not found: ${trimmedCmd}. Type "help" for a list of commands.` 
          },
        ]);
    }
    setInput('');
    setCursorPos(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInput(val);
      // Sync cursor calculation: 
      // If we are typing, usually cursor is at selectionEnd.
      setCursorPos(e.target.selectionStart || val.length);
  };
  
  // Need to sync hidden input selection when we manually change cursor pos via Arrow Keys?
  // Ideally yes, otherwise typing inserts at the wrong place in the hidden input.
  useEffect(() => {
      if (inputRef.current) {
          inputRef.current.selectionStart = cursorPos;
          inputRef.current.selectionEnd = cursorPos;
      }
  }, [cursorPos]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Calculate current effective index (if -1, it's effectively "after end" i.e. length)
      const currentIdx = historyIndex === -1 ? commandHistory.length : historyIndex;
      
      if (currentIdx > 0) {
          const newIndex = currentIdx - 1;
          setHistoryIndex(newIndex);
          const newCmd = commandHistory[newIndex];
          setInput(newCmd);
          setCursorPos(newCmd.length);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            const newCmd = commandHistory[newIndex];
            setInput(newCmd);
            setCursorPos(newCmd.length);
        } else {
            setHistoryIndex(-1);
            setInput('');
            setCursorPos(0);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (cursorPos > 0) {
           setCursorPos(prev => Math.max(0, prev - 1));
       }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (cursorPos < input.length) {
        setCursorPos(prev => Math.min(input.length, prev + 1));
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCursorPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCursorPos(input.length);
    }
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto p-4 font-mono text-sm md:text-base cursor-text min-h-[50vh]" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-2">
        {history.map((line, idx) => (
          <div key={idx} className={`${line.type === 'input' ? 'text-[#00ff00]' : 'text-[#00ff00]/90'}`}>
             {line.type === 'input' && <span className="mr-2 text-blue-400">{'>'}</span>}
             {line.content}
          </div>
        ))}
      </div>
      
      <div className="flex items-center mt-2 group relative">
        <span className="text-blue-400 mr-2">{currentPath} &gt;</span>
        
        {/* Visible Text and Cursor */}
        <div className="relative inline-block whitespace-pre-wrap break-all max-w-full">
           <span>{input.slice(0, cursorPos)}</span>
           <span className="relative inline-block">
             {cursorPos < input.length ? (
                 <>
                   <span className="absolute inset-0 animate-cursor-blink -z-10"></span>
                   <span className="relative z-0 text-current mix-blend-normal">{input[cursorPos]}</span>
                 </>
             ) : (
                <span className="w-2.5 h-5 bg-[#00ff00] animate-blink inline-block align-middle ml-[1px]"></span>
             )}
           </span>
           <span>{input.slice(cursorPos + 1)}</span>
        </div>

        {/* Hidden Input for Capturing Typing */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          // Also listen to onClick/onSelect to sync cursor if user clicks or selects text
          onSelect={(e) => setCursorPos(e.currentTarget.selectionStart || 0)}
          className="absolute inset-0 opacity-0 cursor-default h-full w-full"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
