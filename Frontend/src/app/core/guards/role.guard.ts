import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth-service";

export const roleGuard: CanActivateFn = (route, state)=> {
    const authService = inject(AuthService);
    const router = inject(Router)


    //Check if user is authenticated 
    if(!authService.isAuthenticated()){
        router.navigate(['/login']);
        return false;
    }
    //Get Required roles from route data 
    const requiredRoles = route.data['roles'] as string[]

    //If no roles required allow access
    if(!requiredRoles || requiredRoles.length === 0) return true;

    //Get user from storage 
    const user = authService.getUser();

    if(!user){
        router.navigate(['/login']);
        return false;
    }

    //Check if user has any of required roles 
    const userRole = user.role?.name;

    if(!userRole){
        router.navigate(['/unauthorized'])
        return false;
    }

    //Check if user's role matches any required role
    if(requiredRoles.includes(userRole)) return true;

    //User doesn't have required role 
    router.navigate(['/unauthorized']);
    return false;
}