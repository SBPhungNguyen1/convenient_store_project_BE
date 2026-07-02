import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    if (await repository.count()) return;

    const hashedPassword = await bcrypt.hash('123', 10);

    await repository.save({
      name: 'Admin',
      email: 'admin@example.com',
      role: Role.ADMIN,
      password: hashedPassword,
    });
  }
}
