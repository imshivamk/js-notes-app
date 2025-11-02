import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Title is required'] },
    content: { type: String, required: [true, 'Content is required'] },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

noteSchema.index({
    userId: 1,
    createdAt: -1
});
noteSchema.index({
    title: 'text',
    content: 'text',
});

export default mongoose.model('Note', noteSchema);
