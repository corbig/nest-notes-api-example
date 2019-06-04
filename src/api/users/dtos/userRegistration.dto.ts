import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

/**
 * UserRegistrationDto
 */
export class UserRegistrationDto {

    @ApiModelProperty({ required: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiModelProperty({ required: true, format: 'password' })
    @MinLength(6, { message: 'password must a least contains 6 characters'})
    password: string;

    @ApiModelProperty({ required: true, format: 'password' })
    @ValidateIf((userRegisrtrationdto: UserRegistrationDto) => userRegisrtrationdto.password === userRegisrtrationdto.confirmPassword,
        { message: 'passwords do not match'})
    @IsNotEmpty()
    confirmPassword: string;
}
