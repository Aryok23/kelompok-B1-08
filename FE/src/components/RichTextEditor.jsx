"use client";

import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2, 
  Underline,
  Link
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [editorState, setEditorState] = useState(value || '');
  
  // Define editor commands
  const commands = [
    { 
      icon: <Bold size={18} />, 
      command: 'bold',
      tooltip: 'Bold'
    },
    { 
      icon: <Italic size={18} />, 
      command: 'italic',
      tooltip: 'Italic'
    },
    { 
      icon: <Underline size={18} />, 
      command: 'underline',
      tooltip: 'Underline'
    },
    { 
      icon: <Heading1 size={18} />, 
      command: 'formatBlock',
      value: '<h1>',
      tooltip: 'Heading 1'
    },
    { 
      icon: <Heading2 size={18} />, 
      command: 'formatBlock',
      value: '<h2>',
      tooltip: 'Heading 2'
    },
    { 
      icon: <ListOrdered size={18} />, 
      command: 'insertOrderedList',
      tooltip: 'Numbered List'
    },
    { 
      icon: <List size={18} />, 
      command: 'insertUnorderedList',
      tooltip: 'Bullet List'
    },
    { 
      icon: <AlignLeft size={18} />, 
      command: 'justifyLeft',
      tooltip: 'Align Left'
    },
    { 
      icon: <AlignCenter size={18} />, 
      command: 'justifyCenter',
      tooltip: 'Align Center'
    },
    { 
      icon: <AlignRight size={18} />, 
      command: 'justifyRight',
      tooltip: 'Align Right'
    },
    { 
      icon: <Link size={18} />, 
      command: 'createLink',
      tooltip: 'Insert Link',
      needsPrompt: true,
      promptMessage: 'Enter the URL:',
      defaultPromptValue: 'https://'
    },
  ];

  const handleCommand = (cmd, value = null) => {
    if (cmd === 'createLink') {
      const url = prompt('Enter the URL:', 'https://');
      if (url) {
        document.execCommand(cmd, false, url);
      }
    } else {
      document.execCommand(cmd, false, value);
    }
    
    // Get updated content
    const content = document.getElementById('rich-text-content').innerHTML;
    setEditorState(content);
    onChange(content);
  };

  // Handle paste to strip formatting
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Handle content change
  const handleContentChange = () => {
    const content = document.getElementById('rich-text-content').innerHTML;
    setEditorState(content);
    onChange(content);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-1">
        {commands.map((item, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={item.tooltip}
            onClick={() => handleCommand(item.command, item.value)}
          >
            {item.icon}
          </Button>
        ))}
      </div>
      
      <div
        id="rich-text-content"
        className="p-3 min-h-64 outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorState }}
        onInput={handleContentChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        style={{ minHeight: '250px' }}
      />
    </div>
  );
};

export default RichTextEditor;