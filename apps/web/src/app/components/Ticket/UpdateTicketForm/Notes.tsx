import { useRef, useState } from "react";
import { LexicalComposerProvider, RichTextEditor } from "../../ui/rich-text-input";
import { $getRoot, EditorState } from "lexical";
import { Button } from "../../ui/button";
import { User } from "@/app/models/userModel";
import { Note } from "./UpdateTicketSchema";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CreateTicketNoteAction } from "@/app/server-actions/CreateTicketNote";
import { UpdateTicketNoteAction } from "@/app/server-actions/UpdateTicketNote";
import { DeleteTicketNoteAction } from "@/app/server-actions/DeleteTicketNote";

function NoteEditor({ addNote }: { addNote: (note: string) => void }) {
    const [editor] = useLexicalComposerContext();
    const newNote = useRef<EditorState>({} as EditorState);

    const createNote = () => {
        addNote(JSON.stringify(newNote.current.toJSON()));
        newNote.current = {} as EditorState;
        editor.update(() => {
            $getRoot().clear()
        })
    }
    return (
        <>
            <RichTextEditor
                editable
                onChange={(editorState) => {
                    newNote.current = editorState
                }} />
            <Button type="button" className="mt-2" onClick={createNote}>Add Note</Button>
        </>
    )
}

function ExistingNoteEditor({
    updateNote,
    deleteNote,
    canEdit = false,
    editable = false,
    setEditable,
}: {
    updateNote: (content: string) => void,
    deleteNote: () => void,
    canEdit?: boolean,
    editable: boolean,
    setEditable: (editMode: boolean) => void
}
) {
    const note = useRef<EditorState>({} as EditorState);

    const updateNoteClick = () => {
        updateNote(JSON.stringify(note.current.toJSON()));
    }
    return (
        <>
            <RichTextEditor
                editable={editable}
                onChange={(editorState) => {
                    note.current = editorState
                }} />
            <div className="flex gap-3">
                {canEdit ? (<Button type="button" className="mt-2" onClick={() => {
                    if (editable) {
                        updateNoteClick();
                        setEditable(false);
                    } else {
                        setEditable(true);
                    }
                }
                }>{editable ? "Save Changes" : "Edit Note"}</Button>) : null}
                {canEdit ? (<Button type="button" variant={"destructive"} className="mt-2" onClick={deleteNote}>Delete Note</Button>) : null}
            </div>
        </>
    )
}

function ExistingNote({
    note,
    resources,
    userId,
    updateNote,
    deleteNote
}: {
    note: Note,
    resources: User[],
    userId: string,
    updateNote: (note: Note) => void,
    deleteNote: () => void
}) {
    const user = resources.find(r => r._id === note.user);
    const displayName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
    const [editable, setEditable] = useState(false);

    return (
        <div key={note._id} className="p-4 border rounded-md">
            <p><strong>{displayName}</strong> - {note.createdAt && new Date(note.createdAt).toLocaleString()}</p>
            <LexicalComposerProvider content={note.content} editable={editable}>
                <ExistingNoteEditor updateNote={(content: string) => updateNote({ ...note, content })}
                    deleteNote={deleteNote}
                    canEdit={user?._id === userId}
                    editable={editable}
                    setEditable={setEditable} />
            </LexicalComposerProvider>
        </div>
    )
}

export default function Notes({ formNotes, userId, resources, ticketId }: { formNotes: Note[], userId: string, resources: User[], ticketId: string }) {
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

    const updateNote = async (note: Note) => {
        // Update local copy of the notes array
        const notes = [...notesList]
        const updateNoteIndex = notes.findIndex(n => n._id === note._id);
        notes[updateNoteIndex].content = note.content;

        setNotesList(notes);

        try {
            const updatedNoteList = await UpdateTicketNoteAction(ticketId, note);
            setNotesList(updatedNoteList)
        } catch (error) {
            console.log(error);
        }
    }

    const deleteNote = async (noteId: string) => {
        // Update local copy of the notes array
        setNotesList(notesList.filter(n => n._id != noteId));

        try {
            const updatedNoteList = await DeleteTicketNoteAction(ticketId, noteId);
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
            {notesList?.map((note, index) => <ExistingNote key={note._id || index}
                note={note}
                resources={resources}
                userId={userId}
                updateNote={updateNote}
                deleteNote={() => deleteNote(note._id!)} />)}
        </div>
    )
}