import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';
import { Helpers } from '@global/helpers/helpers';

class AuthService {
  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowercase(email) }],
    };
    return AuthModel.findOne(query).exec() as Promise<IAuthDocument>;
  }

  public async getUserByUsername(username: string): Promise<IAuthDocument> {
    const query = {
      username: Helpers.firstLetterUppercase(username),
    };
    return AuthModel.findOne(query).exec() as Promise<IAuthDocument>;
  }
}

export const authService = new AuthService();
