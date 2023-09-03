import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { validateWithJoiDecorator } from '@global/decorators/joi-validation.decorator';
import { loginSchema } from '@auth/schemes/signin';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { ISignInData } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password';
import { emailQueue } from '@service/queues/email.queue';

class SignIn {
  @validateWithJoiDecorator<SignIn>(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser = await authService.getUserByUsername(username);
    if (!existingUser) throw new BadRequestError('No account exits.');

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) throw new BadRequestError('Invalid credentials.');

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const jwtPayload = SignIn.prototype.sanitizeSignInData(existingUser as ISignInData, `${user._id}`);
    const userJWT: string = SignIn.prototype.signInToken(jwtPayload);
    req.session = { jwt: userJWT };

    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      avatarColor: existingUser.avatarColor,
      uId: existingUser.uId,
      createdAt: existingUser.createdAt,
    } as IUserDocument;

    const resetLink = 'https://www.mailinator.com/';
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    emailQueue.addEmailJob({ template, receiverEmail: 'justine44@ethereal.email', subject: 'Password reset Link' });

    res.status(HTTP_STATUS.OK).json({ message: 'User logged in successfully', user: userDocument, token: userJWT });
  }

  private sanitizeSignInData(data: ISignInData, userId: string): ISignInData {
    const { uId, username, email, password, avatarColor } = data;

    return {
      userId,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowercase(email),
      password,
      avatarColor,
    } as ISignInData;
  }

  private signInToken(data: ISignInData): string {
    return jwt.sign(data, config.JWT_TOKEN!);
  }
}

export default SignIn;
