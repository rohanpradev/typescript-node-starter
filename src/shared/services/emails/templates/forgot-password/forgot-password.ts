import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string) {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf-8'), {
      username,
      resetLink,
      image_url: 'https://th.bing.com/th/id/OIP.DfL5_Eb4qYPlGvQENkUeqAAAAA?pid=ImgDet&rs=1',
    });
  }
}

export const forgotPasswordTemplate = new ForgotPasswordTemplate();
