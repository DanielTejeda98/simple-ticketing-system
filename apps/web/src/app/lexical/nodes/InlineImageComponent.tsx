import { $getSelection, $isNodeSelection, $setSelection, BaseSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, DRAGSTART_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, LexicalEditor, NodeKey, SELECTION_CHANGE_COMMAND } from "lexical";
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { JSX, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Position } from "./InlineImageNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { default as NextImage } from "next/image";

const imageCache = new Set();

function useSuspenseImage(src: string) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
        });
    }
}

function LazyImage({
    altText,
    className,
    imageRef,
    src,
    width,
    height,
    position,
}: {
    altText: string;
    className: string | null;
    height: 'inherit' | number;
    imageRef: { current: null | HTMLImageElement };
    src: string;
    width: 'inherit' | number;
    position: Position;
}): JSX.Element {
    useSuspenseImage(src);
    return (
        <img
            className={className || undefined}
            src={src}
            alt={altText}
            ref={imageRef}
            data-position={position}
            style={{
                display: 'block',
                height,
                width,
            }}
            draggable="false"
        />
    );
}


export default function InlineImageComponent({
    src,
    altText,
    nodeKey,
    width,
    height,
    showCaption,
    caption,
    position
}: {
    altText: string;
    caption: LexicalEditor;
    height: 'inherit' | number;
    nodeKey: NodeKey;
    showCaption: boolean;
    src: string;
    width: 'inherit' | number;
    position: Position;
}): JSX.Element {
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [selection, setSelection] = useState<BaseSelection | null>(null);
    const [editor] = useLexicalComposerContext();
    const isEditable = useLexicalEditable();

    const imageRef = useRef<null | HTMLImageElement>(null);
    const activeEditorRef = useRef<LexicalEditor | null>(null);

    const $onEscape = useCallback(
        () => {
            if (
                activeEditorRef.current === caption
            ) {
                $setSelection(null);
                editor.update(() => {
                    setSelected(true);
                    const parentRootElement = editor.getRootElement();
                    if (parentRootElement !== null) {
                        parentRootElement.focus();
                    }
                });
                return true;
            }
            return false;
        },
        [caption, editor, setSelected],
    );

    useEffect(() => {
        let isMounted = true;
        const unregister = mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                if (isMounted) {
                    setSelection(editorState.read(() => $getSelection()));
                }
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_, activeEditor) => {
                    activeEditorRef.current = activeEditor;
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand<MouseEvent>(
                CLICK_COMMAND,
                (payload) => {
                    const event = payload;
                    if (event.target === imageRef.current) {
                        if (event.shiftKey) {
                            setSelected(!isSelected);
                        } else {
                            clearSelection();
                            setSelected(true);
                        }
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    if (event.target === imageRef.current) {
                        // TODO This is just a temporary workaround for FF to behave like other browsers.
                        // Ideally, this handles drag & drop too (and all browsers).
                        event.preventDefault();
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                $onEscape,
                COMMAND_PRIORITY_LOW,
            ),
        );
        return () => {
            isMounted = false;
            unregister();
        };
    }, [
        clearSelection,
        editor,
        isSelected,
        nodeKey,
        $onEscape,
        setSelected,
    ]);

    const draggable = isSelected && $isNodeSelection(selection);
    const isFocused = isSelected && isEditable;
    return (
        <Suspense fallback={null}>
            <>
                <span draggable={draggable}>
                    <LazyImage
                        className={
                            isFocused
                                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                                : null
                        }
                        src={src}
                        altText={altText}
                        imageRef={imageRef}
                        width={width}
                        height={height}
                        position={position}
                    />
                </span>
            </>
        </Suspense>
    )
}