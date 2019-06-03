import { IsNotEmpty } from 'class-validator';

/**
 * Note DTO
 */
export class NoteDto {

    id: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;
}
