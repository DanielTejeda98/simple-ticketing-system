import { LucideRedo, LucideUndo } from "lucide-react";
import { Menubar, MenubarItem, MenubarMenu, MenubarSeparator } from "./menubar";
import { CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, ElementFormatType, LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";
import { createContext, Dispatch, JSX, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "./button";

export const MIN_ALLOWED_FONT_SIZE = 8;
export const MAX_ALLOWED_FONT_SIZE = 72;
export const DEFAULT_FONT_SIZE = 15;

const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
};

export const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
};

//disable eslint sorting rule for quick reference to toolbar state
/* eslint-disable sort-keys-fix/sort-keys-fix */
const INITIAL_TOOLBAR_STATE = {
    bgColor: '#fff',
    blockType: 'paragraph' as keyof typeof blockTypeToBlockName,
    canRedo: false,
    canUndo: false,
    codeLanguage: '',
    elementFormat: 'left' as ElementFormatType,
    fontColor: '#000',
    fontFamily: 'Arial',
    // Current font size in px
    fontSize: `${DEFAULT_FONT_SIZE}px`,
    // Font size input value - for controlled input
    fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
    isBold: false,
    isCode: false,
    isHighlight: false,
    isImageCaption: false,
    isItalic: false,
    isLink: false,
    isRTL: false,
    isStrikethrough: false,
    isSubscript: false,
    isSuperscript: false,
    isUnderline: false,
    isLowercase: false,
    isUppercase: false,
    isCapitalize: false,
    rootType: 'root' as keyof typeof rootTypeToRootName,
};

type ToolbarState = typeof INITIAL_TOOLBAR_STATE;

type ToolbarStateKey = keyof ToolbarState;
type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key];

type ContextShape = {
    toolbarState: ToolbarState;
    updateToolbarState<Key extends ToolbarStateKey>(
        key: Key,
        value: ToolbarStateValue<Key>,
    ): void;
};

const Context = createContext<ContextShape | undefined>(undefined);

export const ToolbarContext = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE);
    const selectionFontSize = toolbarState.fontSize;

    const updateToolbarState = useCallback(
        <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => {
            setToolbarState((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [],
    );

    useEffect(() => {
        updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2));
    }, [selectionFontSize, updateToolbarState]);

    const contextValue = useMemo(() => {
        return {
            toolbarState,
            updateToolbarState,
        };
    }, [toolbarState, updateToolbarState]);

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useToolbarState = () => {
    const context = useContext(Context);

    if (context === undefined) {
        throw new Error('useToolbarState must be used within a ToolbarProvider');
    }

    return context;
};

export default function LexicalEditorToolbar({
    editor,
    activeEditor,
    setActiveEditor,
    setIsLinkEditMode,
}: {
    editor: LexicalEditor;
    activeEditor: LexicalEditor;
    setActiveEditor: Dispatch<LexicalEditor>;
    setIsLinkEditMode: Dispatch<boolean>;
}) {
    const { toolbarState, updateToolbarState } = useToolbarState();

    const [isEditable, setIsEditable] = useState(() => editor.isEditable());

    useEffect(() => {
        return mergeRegister(
            editor.registerEditableListener((editable) => {
                setIsEditable(editable);
            }),
            activeEditor.registerCommand<boolean>(
                CAN_UNDO_COMMAND,
                (payload) => {
                    updateToolbarState('canUndo', payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            activeEditor.registerCommand<boolean>(
                CAN_REDO_COMMAND,
                (payload) => {
                    updateToolbarState('canRedo', payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        )
    }, [editor, activeEditor, updateToolbarState]);

    return (
        <Menubar className="border-0 border-b-2 rounded-none">
            <Button aria-label="Undo"
                disabled={!toolbarState.canUndo || !isEditable}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                variant={"ghost"}>
                <LucideUndo />
            </Button>
            <Button aria-label="Redo"
                disabled={!toolbarState.canRedo || !isEditable}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                variant={"ghost"}>
                <LucideRedo />
            </Button>
            <div className="w-[1px] bg-slate-200 my-1 h-full"></div>
        </Menubar>
    )
}