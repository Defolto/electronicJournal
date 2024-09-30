import mongoose, { Schema } from 'mongoose'

const historyScheme = new Schema(
   {
      from: String,
      to: String,
      value: Number,
      title: String,
      text: String,
      date: Date,
   },
   { versionKey: '_somethingElse' }
)

historyScheme.set('toJSON', {
   transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
   },
})

const History = mongoose.models.History || mongoose.model('History', historyScheme)
export default History
