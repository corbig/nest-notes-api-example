import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Note DTO
 */
export class NoteDto {

    @ApiModelProperty({required: false})
    id: number;

    @ApiModelProperty({ required: true })
    @IsNotEmpty()
    title: string;

    @ApiModelProperty({ required: true })
    @IsNotEmpty()
    content: string;
}
