import mongoose, { Schema } from 'mongoose'

const wordleScheme = new Schema(
   {
      randomWord: {
         type: String,
         required: true,
      },
      rows: [{ type: String }],
   },
   { versionKey: '_somethingElse' }
)

wordleScheme.set('toJSON', {
   transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
   },
})

const Wordle = mongoose.models.Wordle || mongoose.model('Wordle', wordleScheme)
export default Wordle
