import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({
    title: String,
    permalink: String,
    content: String,
});
