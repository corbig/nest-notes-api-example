import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Note DTO
 */
export class NoteDto {

    @ApiModelProperty({ required: false, example: 1 })
    id: number;

    @ApiModelProperty({ required: true, example: 'my_note_title' })
    @IsNotEmpty()
    title: string;

    @ApiModelProperty({ required: true, example: 'my_note_content' })
    @IsNotEmpty()
    content: string;
}
