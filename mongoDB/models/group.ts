import mongoose, { Schema } from 'mongoose'

const groupScheme = new Schema(
   {
      name: String,
      number: Number,
      users: [String],
      leader: String,
      headman: String,
      avatar: String,
      status: String,
      money: {
         type: Number,
         required: true,
         default: 0,
      },
   },
   { versionKey: '_somethingElse' }
)

groupScheme.set('toJSON', {
   transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
   },
})

const Group = mongoose.models.Group || mongoose.model('Group', groupScheme)
export default Group
