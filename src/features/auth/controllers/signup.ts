import { Request, Response } from 'express';
import { Types } from 'mongoose';
import HTTP_STATUS from 'http-status-codes';
import { omit } from 'lodash';
import jwt from 'jsonwebtoken';
import { validateWithJoiDecorator } from '@global/decorators/joi-validation.decorator';
import { signupSchema } from '@auth/schemes/signup';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { uploads } from '@global/helpers/cloudinary-upload';
import { IUserDocument } from '@user/interfaces/user.interface';
import { config } from '@root/config';
import { UserCache } from '@service/redis/user.cache';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';

const userCache: UserCache = new UserCache();

class SignUp {
  @validateWithJoiDecorator<SignUp>(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const existingUser = await authService.getUserByUsernameOrEmail(username, email);
    if (existingUser) throw new BadRequestError('Account already exists.');

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

    // Add to redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;

    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);
    omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);

    const userJWT: string = SignUp.prototype.signUpToken(authData, userObjectId);
    req.session = { jwt: userJWT };

    // Send to rabbit mq to save to mongo db in the background
    authQueue.addAuthUserJob({ value: authData });
    userQueue.addUserJob({ value: userDataForCache });

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData, token: userJWT });
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

  private userData(data: IAuthDocument, userObjectId: Types.ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      uId,
      postsCount: 0,
      work: '',
      school: '',
      quote: '',
      location: '',
      blocked: [],
      blockedBy: [],
      followersCount: 0,
      followingCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
      },
      bgImageVersion: '',
      bgImageId: '',
      profilePicture: '',
    } as unknown as IUserDocument;
  }

  private signUpToken(data: IAuthDocument, userObjectId: Types.ObjectId): string {
    return jwt.sign(
      { userId: userObjectId, uId: data.uId, email: data.email, username: data.username },
      config.JWT_TOKEN!
    );
  }
}

export default SignUp;
