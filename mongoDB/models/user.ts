import {
   MAX_LENGTH_LOGIN,
   MIN_LENGTH_LOGIN,
   MIN_LENGTH_PASSWORD,
   REG_EXP_EMAIL,
   REG_EXP_LOGIN,
   REG_EXP_RUS_WORD,
   ROLE_RUS,
} from 'helpers/constants'
import mongoose, { Schema } from 'mongoose'

const roles = Object.keys(ROLE_RUS)
const genders = [0, 1]

const userScheme = new Schema(
   {
      publicId: {
         type: String,
         required: true,
      },
      login: {
         type: String,
         required: true,
         minLength: MIN_LENGTH_LOGIN,
         maxLength: MAX_LENGTH_LOGIN,
         validate: (text: string) => REG_EXP_LOGIN.test(text),
      },
      email: {
         type: String,
         required: true,
         validate: (text: string) => REG_EXP_EMAIL.test(text),
      },
      password: {
         type: String,
         required: true,
         minLength: MIN_LENGTH_PASSWORD,
      },
      info: {
         name: {
            type: String,
            required: true,
            validate: (text: string) => REG_EXP_RUS_WORD.test(text),
         },
         surname: {
            type: String,
            required: true,
            validate: (text: string) => REG_EXP_RUS_WORD.test(text),
         },
         birthday: Date,
         gender: {
            type: Number,
            enum: genders,
            validate: (value: number) => genders.includes(value),
         },
      },
      personalization: {
         avatar: String,
         background: String,
         about: String,
         border: String,
      },
      collections: [
         {
            name: String,
            values: [Number],
         },
      ],
      money: {
         type: Number,
         required: true,
         default: 0,
      },
      thanks: {
         type: Number,
         required: true,
         default: 0,
      },
      role: {
         type: String,
         enum: roles,
         validate: (value: string) => roles.includes(value),
         required: true,
         default: 'guest',
      },
      customization: {
         isShortToolbar: {
            type: Boolean,
         },
         theme: {
            type: Object,
         },
      },
      achievements: [String],
      wordle: {
         lastGame: Date,
         id: String,
         winGames: Number,
         loseGames: Number,
         recordWinGames: Number,
         averageTrys: Number,
      },
      verifying: {
         type: Boolean,
      },
      groups: [String],
   },
   { versionKey: false }
)

// с удалением приватных данных
userScheme.set('toJSON', {
   transform: function (doc, ret) {
      delete ret._id
      delete ret.password
   },
})

// публичный
userScheme.set('toObject', {
   transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
   },
})

const User = mongoose.models.User || mongoose.model('User', userScheme)
export default User

export type UserDocument = InstanceType<typeof User>
