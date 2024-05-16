import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const ParamIdcuston = createParamDecorator(( _data: unknown, context: ExecutionContext ) => {
    return Number(context.switchToHttp().getRequest().params.id)
})