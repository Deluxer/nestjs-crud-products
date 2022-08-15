import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RowHeaders = createParamDecorator( (data: string, ctx: ExecutionContext) => {

    const { rawHeaders } = ctx.switchToHttp().getRequest();
    
    if(!rawHeaders) throw new BadRequestException('Not authorized')
    
    return rawHeaders;

});