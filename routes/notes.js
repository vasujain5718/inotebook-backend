const express = require('express')
const fetchuser = require('../midware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
const router = express.Router();


router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
})

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('content', 'Content must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const err =  validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }
   
    try {
        const note = await Notes.create({
            title : req.body.title,
            content: req.body.content,
            user: req.user.id
        });
        res.json(note);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
router.put('/updatenote/:id', fetchuser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('content', 'Content must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    const { title, content } = req.body;
    const err= validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array(), success : false });
    }
    // Create a new note object
    const newNote = {};
    if (title) { newNote.title = title };
    if (content) { newNote.content = content };

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note  ,success: true});
})
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    // Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found");
    }
    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note });
})
module.exports = router;