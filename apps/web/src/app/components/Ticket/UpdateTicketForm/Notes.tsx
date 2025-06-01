import { useRef, useState } from "react";
import { LexicalComposerProvider, RichTextEditor } from "../../ui/rich-text-input";
import { $getRoot, EditorState } from "lexical";
import { Button } from "../../ui/button";
import { User } from "@/app/models/userModel";
import { Note } from "./UpdateTicketSchema";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CreateTicketNoteAction } from "@/app/server-actions/CreateTicketNote";

function NoteEditor ({addNote, editable = true, canEdit = false}: {addNote: (note: string) => void, editable?: boolean, canEdit?: boolean}) {
    const [editor] = useLexicalComposerContext();
    const newNote = useRef<EditorState>({} as EditorState);

    return (
        <>
            <RichTextEditor
                editable={editable}
                onChange={(editorState) => {
                    newNote.current = editorState
                }} />
            {editable || canEdit ? (<Button type="button" className="mt-2" onClick={() => {
                addNote(JSON.stringify(newNote.current.toJSON()));
                newNote.current = {} as EditorState;
                editor.update(() => {
                    $getRoot().clear()
                })
            }
            }>{editable ? "Add Note" : "Edit Note"}</Button>) : null }
        </>
    )
}

export default function Notes({formNotes, userId, resources, ticketId}: {formNotes: Note[], userId: string, resources: User[], ticketId: string }) {
    const [notesList, setNotesList] = useState(formNotes);

    const addNote = async (note: string) => {
        // Optimistically push note
        const notes = [...notesList];
        const noteObj = {
            user: userId,
            content: note
        };
        notes.unshift(noteObj);
        setNotesList(notes);

        // Update ticket with new note
        try {
            const updatedNoteList = await CreateTicketNoteAction(ticketId, noteObj) as Note[]
            setNotesList(updatedNoteList);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <div>
                <LexicalComposerProvider>
                    <NoteEditor addNote={addNote} />
                </LexicalComposerProvider>
            </div>
            {notesList?.map((note, index) => {
                const user = resources.find(r => r._id === note.user);
                const displayName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
                return (
                    <div key={note._id || index} className="p-4 border rounded-md">
                        <p><strong>{displayName}</strong> - {note.createdAt && new Date(note.createdAt).toLocaleString()}</p>
                        <LexicalComposerProvider content={note.content} editable={false}>
                            <NoteEditor addNote={() => {}} editable={false} canEdit={user?._id === userId} />
                        </LexicalComposerProvider>
                    </div>
                )
            })}
        </div>
    )
}