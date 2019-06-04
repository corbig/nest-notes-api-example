import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * UserRegistrationDto
 */
export class UserLoginDto {

    @ApiModelProperty({ required: true, example: 'user@user.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiModelProperty({ required: true, example: 'user_password' })
    @IsNotEmpty()
    @MinLength(4, { message: 'password must a least contains 4 characters' })
    password: string;
}
