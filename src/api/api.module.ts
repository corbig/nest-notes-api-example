import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

@Module({
    imports: [NotesModule, UsersModule, RolesModule],
})
export class ApiModule {
}
