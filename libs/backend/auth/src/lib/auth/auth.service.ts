import { Injectable, Logger } from '@nestjs/common';
import {
    ConflictException,
    UnauthorizedException
} from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import {
    User as UserModel,
    UserDocument
} from '@sharemunity-workspace/backend/user';
import { JwtService } from '@nestjs/jwt';
import { IUser, IUserCredentials, IUserIdentity } from '@sharemunity-workspace/shared/api';
import { CreateUserDto } from '@sharemunity-workspace/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    //
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async validateUser(credentials: IUserCredentials): Promise<any> {
        this.logger.log('validateUser');
        const user = await this.userModel.findOne({
            emailAddress: credentials.emailAddress
        });
        if (user && user.password === credentials.password) {
            return user;
        }
        return null;
    }

    async login(credentials: IUserCredentials): Promise<IUserIdentity> {
        this.logger.log('login ' + credentials.emailAddress);
        return await this.userModel
            .findOne({
                emailAddress: credentials.emailAddress
            })
            .select('+password +role')
            .exec()
            .then((user) => {
                if (user && user.password === credentials.password) {
                    const payload = {
                        user_id: user._id
                    };
                    return {
                        _id: user._id,
                        name: user.name,
                        emailAddress: user.emailAddress,
                        role:user.role,
                        token: this.jwtService.sign(payload)
                    };
                } else {
                    const errMsg = 'Email not found or password invalid';
                    this.logger.debug(errMsg);
                    throw new UnauthorizedException(errMsg);
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    async register(user: CreateUserDto): Promise<IUserIdentity> {
        this.logger.log(`Register user ${user.name}`);
        if (await this.userModel.findOne({ emailAddress: user.emailAddress })) {
            this.logger.debug('user exists');
            throw new ConflictException('User already exist');
        }
        this.logger.log('User not found, creating');
        const createdItem = await this.userModel.create(user)
            .then((user) =>{
                this.logger.debug(`Sending back payload`);
                this.logger.debug(user);
                const payload = {
                    user_id:user._id
                };
                return{
                    _id:user._id,
                    name:user.name,
                    emailAddress:user.emailAddress,
                    role:user.role,
                    token: this.jwtService.sign(payload)
                };
            })
        this.logger.debug(`Creating: ${createdItem}`)
        this.logger.debug(createdItem)
        return createdItem;
        }

}
