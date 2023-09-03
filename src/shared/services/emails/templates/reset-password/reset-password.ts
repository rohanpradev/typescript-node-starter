import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams) {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf-8'), {
      username,
      email,
      ipaddress,
      date,
      image_url: 'https://th.bing.com/th/id/OIP.DfL5_Eb4qYPlGvQENkUeqAAAAA?pid=ImgDet&rs=1',
    });
  }
}

export const resetPasswordTemplate = new ResetPasswordTemplate();