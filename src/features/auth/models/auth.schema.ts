import { model, Model, Schema } from 'mongoose';
import { Password } from '@global/helpers/hash-and-compare';
import { IAuthDocument } from '@auth/interfaces/auth.interface';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await Password.toHash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return Password.compare(this.password as string, password);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return Password.toHash(password, SALT_ROUND);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
