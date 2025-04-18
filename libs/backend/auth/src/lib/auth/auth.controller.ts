import {
    Controller,
    Request,
    Post,
    UseGuards,
    Logger,
    Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/decorators';
import {
    IUserCredentials,
    IUserIdentity,
    IUserRegistration
} from '@sharemunity-workspace/shared/api';
import { CreateUserDto } from '@sharemunity-workspace/backend/dto';
import { UserExistGuard } from '@sharemunity-workspace/backend/user';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('Login');
        this.logger.log(credentials)
        return await this.authService.login(credentials);
    }

    @Public()
    @UseGuards(UserExistGuard)
    @Post('register')
    async register(@Body() user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log('Register');
        this.logger.log(user);
        return await this.authService.register(user);
    }
}
