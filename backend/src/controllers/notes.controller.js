import Note from "../models/Note.js";

export const createNote = async (req, res) =>{
    try {

        const { title, content } = req.body;
        if( !title || !content){
            return res.status(400).json({message: "Please provide all required fields"})
        }

        const userId = req.userId;
        console.log(userId);
        
        if(!userId){
            return res.status(400).json({
                message: "User Id is required!"
            })
        }
        

        const newNote = new Note({
            title,
            content,
            userId
        })

        const savedNote = await newNote.save();
        return res.status(201).json({message: "Note created successfully", note: savedNote})

    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
}

export const getNotes = async ( req, res) =>{
    try {
        const userId = req.userId;
        console.log(userId);
        
        if(!userId){
            return res.status(400).json({
                message: "User Id is required!"
            })
        }

        const notes = await Note.find({
            userId
        })

        console.log(notes);
        
        

        

        return res.status(200).json({
            success: true,
            notes: notes
        })

    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
}

export const getNoteById = async (req, res) =>{
    try {
        const noteId = req.params.noteId;
        
        if(!noteId){
            return res.status(400).json({
                message: "Note Id is required!"
            })
        }

        const note = await Note.findById(noteId);
        
        const userId = req.userId;
        console.log(userId);
        if(!userId){
            return res.status(400).json({
                message: "User Id is required!"
            })
        }

        if(userId !== note?.userId.toString()){
            return res.status(400).json({
                message: "You're not authorized!"
            })
        }

        if(!note){
            return res.status(404).json({
                message: "Note not found!"
            })
        }
        
        return res.status(200).json({
            success: true,
            note: note
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: (error ).message,
        })
    }
}

export const updateNote = async (req, res) =>{
    try {
        const noteId = req.params.noteId;
        if(!noteId) {
            return res.status(400).json({ message: "Note Id is required!" });
        }

        const {title, content, isPinned} = req.body;

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.userId },
            { title, content, isPinned },
            { new: true }
        );

        return res.status(200).json({
            success:true,
            message:'Note updated successfully',
            note: updatedNote 
        })
        
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({message: "Internal Server Error", error})
    }
}

export const deleteNote = async (req, res) =>{
    try {
        const noteId = req.params.noteId;
        if(!noteId) {
            return res.status(400).json({ message: "Note Id is required!" });
        }
        const note = await Note.findById(noteId);

        if(note?.userId.toString()!== req.userId?.toString()){
            console.log("User not authorized!!!");
            return res.status(403).json({ message: "You are not authorized to update this note" });
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);
        
        return res.status(200).json({
            success:true,
            message:'Note deleted successfully',
            note: deletedNote 
        })



    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error});
    }
}