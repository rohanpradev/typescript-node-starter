import { Request, Response } from 'express';
import { Types } from 'mongoose';
import HTTP_STATUS from 'http-status-codes';
import { validateWithJoiDecorator } from '@global/decorators/joi-validation.decorator';
import { signupSchema } from '@auth/schemes/signup';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { uploads } from '@global/helpers/cloudinary-upload';

class SignUp {
  @validateWithJoiDecorator<SignUp>(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const existingUser = await authService.getUserByUsernameOrEmail(username, email);
    if (existingUser) throw new BadRequestError('Acoount already exists.');

    const authObjectId: Types.ObjectId = new Types.ObjectId();
    const userObjectId: Types.ObjectId = new Types.ObjectId();
    const uId = Helpers.generateUid();

    const authData = SignUp.prototype.sanitizeSignUpData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
    });
    const result = await uploads(avatarImage, `${userObjectId}`);
    if (!result?.public_id) throw new BadRequestError('File upload failed. Try again.');

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData });
  }

  private sanitizeSignUpData(data: ISignUpData): IAuthDocument {
    const { _id, uId, username, email, password, avatarColor } = data;

    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowercase(email),
      password,
      avatarColor,
    } as IAuthDocument;
  }
}

export default SignUp;
