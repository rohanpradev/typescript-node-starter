import { authService } from '@service/db/auth.service';
import { Job } from 'bullmq';

class AuthWorker {
  async addAuthUserToDb(job: Job) {
    const { value } = job.data;
    await authService.createAuthUser(value);
    // job.progress(100);
    // job.progress(100)
  }
}
