package com.backend.PlanWise.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    @Autowired
    private PermissionChecker permissionChecker;

    @Around("@annotation(RequiresPermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        RequiresPermission requiresPermission = signature.getMethod().getAnnotation(RequiresPermission.class);

        // We get the parameters of the method
        Object[] args = joinPoint.getArgs();
        Long projectId = null;
        String userId = null;

        // We are looking for parameters projectId And userId In the arguments of the method
        for (int i = 0; i < signature.getParameterNames().length; i++) {
            String paramName = signature.getParameterNames()[i];
            if ("projectId".equals(paramName)) {
                projectId = (Long) args[i];
            } else if ("userId".equals(paramName)) {
                userId = (String) args[i];
            }
        }

        if (projectId == null || userId == null) {
            throw new IllegalArgumentException("Method must have projectId and userId parameters");
        }

        // Check the permits
        boolean hasPermission;
        if (requiresPermission.requireAll()) {
            hasPermission = permissionChecker.hasAllPermissions(projectId, userId, requiresPermission.value());
        } else {
            hasPermission = permissionChecker.hasAnyPermission(projectId, userId, requiresPermission.value());
        }

        if (!hasPermission) {
            throw new AccessDeniedException("User does not have required permissions");
        }

        return joinPoint.proceed();
    }
}