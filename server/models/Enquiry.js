import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  stage: { type: String, required: true, enum: ['Early years', 'Primary', 'Middle school', 'Academy'] },
  childName: { type: String, trim: true, maxlength: 100 },
  currentGrade: { type: String, trim: true, maxlength: 50 },
  contactPreference: { type: String, enum: ['Phone', 'Email', 'WhatsApp'], default: 'Phone' },
  message: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
