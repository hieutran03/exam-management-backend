import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUserDetails } from '../authentication/requestWithUsers.interface';
import JwtAuthenticationGuard from '../authentication/jwtAuthentication.guard';
import PermissionEnum from './permission.enum';

const PermissionGuard = (permission: PermissionEnum): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthenticationGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUserDetails>();
      if (!request.user.rolePermission) {
        return false;
      }
      return request.user.rolePermission.permissions.includes(permission);
    }
  }
  return mixin(PermissionGuardMixin);
}

export default PermissionGuard;
