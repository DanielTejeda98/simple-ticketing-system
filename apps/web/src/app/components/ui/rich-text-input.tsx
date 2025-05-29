import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import LexicalEditorToolbar, { ToolbarContext } from './lexical-editor-toolbar';

const editorTheme = {
    code: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    heading: {
        h1: 'text-2xl font-bold',
        h2: 'text-xl font-semibold',
        h3: 'text-lg font-medium',
        h4: 'text-base font-medium',
        h5: 'text-sm font-medium',
        h6: 'text-xs font-medium',
    },
    image: 'border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm',
    link: 'text-blue-600 dark:text-blue-400 hover:underline',
    list: {
        listitem: 'mb-2',
        nested: {
            listitem: 'ml-4',
        },
        ol: 'list-decimal pl-4',
        ul: 'list-disc pl-4',
    },
    ltr: 'text-left',
    paragraph: 'mb-4 text-gray-900 dark:text-gray-100',
    placeholder: 'text-gray-500 dark:text-gray-400',
    quote: 'border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400',
    rtl: 'text-right',
    text: {
        bold: 'font-bold',
        code: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono px-1 py-0.5 rounded',
        italic: 'italic',
        overflowed: 'overflow-hidden text-ellipsis whitespace-nowrap',
        strikethrough: 'line-through',
        underline: 'underline',
        underlineStrikethrough: 'line-through underline',
    }
}

function onError(error) {
    console.error('Richtext Editor Error:', error);
}

function MyOnChangePlugin({ onChange }: { onChange: (editorState: any) => void }) {
    // Access the editor through the LexicalComposerContext
    const [editor] = useLexicalComposerContext();
    // Wrap our listener in useEffect to handle the teardown and avoid stale references.
    useEffect(() => {
        // most listeners return a teardown function that can be called to clean them up.
        return editor.registerUpdateListener(({ editorState }) => {
            // call onChange here to pass the latest state up to the parent.
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

function Editor({ onChange }: { onChange: (editorState: any) => void }) {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

    return (
        <div className='my-5 border-2 text-black relative leading-[20px] rounded-t-md'>
            <LexicalEditorToolbar editor={editor}
                activeEditor={activeEditor}
                setActiveEditor={setActiveEditor}
                setIsLinkEditMode={setIsLinkEditMode} />
            <div className='relative'>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className='min-h-[200px] resize-none text-md relative outline-none px-4 py-3 caret-slate-700'
                            aria-placeholder={"Enter some text..."}
                            placeholder={<div className='text-gray-700 absolute text-ellipsis top-[14px] left-[15px] text-md leading-[20px] select-none pointer-events-none'>Enter some text...</div>}
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <MyOnChangePlugin onChange={onChange} />
                <HistoryPlugin />
                <AutoFocusPlugin />
            </div>
        </div>
    )
}

export default function RichtextEditor({ onChange }: { onChange: (editorState: any) => void }) {
    const initialConfig = {
        namespace: 'richtext',
        theme: editorTheme,
        onError
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarContext>
                <Editor onChange={onChange} />
            </ToolbarContext>
        </LexicalComposer>
    )
}