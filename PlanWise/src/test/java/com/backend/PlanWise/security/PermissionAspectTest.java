package com.backend.PlanWise.security;

import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import lombok.SneakyThrows;

@ExtendWith(MockitoExtension.class)
public class PermissionAspectTest {

    @Mock
    private PermissionChecker permissionChecker;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private MethodSignature methodSignature;

    @Mock
    private Method method;

    @InjectMocks
    private PermissionAspect permissionAspect;

    private Long projectId;
    private String userId;
    private String[] paramNames;
    private Object[] args;

    @BeforeEach
    void setUp() {
        projectId = 1L;
        userId = "test-user-id";
        paramNames = new String[] { "projectId", "userId" };
        args = new Object[] { projectId, userId };
    }

    @Test
    void checkPermission_WithValidPermissions_Proceeds() throws Throwable {
        // Preparation
        when(joinPoint.getArgs()).thenReturn(args);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        when(methodSignature.getParameterNames()).thenReturn(paramNames);
        when(permissionChecker.hasAllPermissions(any(), any(), any())).thenReturn(true);

        // Execution
        Object result = permissionAspect.checkPermission(joinPoint);

        // Examination
        verify(joinPoint).proceed();
        assertNull(result);
    }

    @Test
    void checkPermission_WithInvalidPermissions_ThrowsAccessDeniedException() throws Throwable {
        // Preparation
        when(joinPoint.getArgs()).thenReturn(args);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        when(methodSignature.getParameterNames()).thenReturn(paramNames);
        when(permissionChecker.hasAllPermissions(any(), any(), any())).thenReturn(false);

        // Examination
        assertThrows(AccessDeniedException.class, () -> {
            permissionAspect.checkPermission(joinPoint);
        });
        verify(joinPoint, never()).proceed();
    }

    @Test
    void checkPermission_WithMissingParameters_ThrowsIllegalArgumentException() throws Throwable {
        // Preparation
        when(joinPoint.getArgs()).thenReturn(new Object[] { projectId });
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        when(methodSignature.getParameterNames()).thenReturn(paramNames);

        // Examination
        assertThrows(IllegalArgumentException.class, () -> {
            permissionAspect.checkPermission(joinPoint);
        });
        verify(joinPoint, never()).proceed();
    }

    @Test
    @SneakyThrows
    public void testCheckPermissionWithValidPermission() throws Exception {
        // Preparation
        RequiresPermission annotation = mock(RequiresPermission.class);
        when(annotation.value()).thenReturn(new String[] { "EDIT" });
        when(method.getAnnotation(RequiresPermission.class)).thenReturn(annotation);
        when(methodSignature.getMethod()).thenReturn(method);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        when(joinPoint.getArgs()).thenReturn(new Object[] { 1L, "user1" });
        when(methodSignature.getParameterNames()).thenReturn(new String[] { "projectId", "userId" });
        when(permissionChecker.hasAllPermissions(anyLong(), anyString(), any(String[].class))).thenReturn(true);
        when(joinPoint.proceed()).thenReturn(null);

        // Execution
        permissionAspect.checkPermission(joinPoint);

        // Examination
        verify(joinPoint).proceed();
    }

    @Test
    @SneakyThrows
    public void testCheckPermissionWithInvalidPermission() throws Exception {
        // Preparation
        RequiresPermission annotation = mock(RequiresPermission.class);
        when(annotation.value()).thenReturn(new String[] { "EDIT" });
        when(method.getAnnotation(RequiresPermission.class)).thenReturn(annotation);
        when(methodSignature.getMethod()).thenReturn(method);
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        when(joinPoint.getArgs()).thenReturn(new Object[] { 1L, "user1" });
        when(methodSignature.getParameterNames()).thenReturn(new String[] { "projectId", "userId" });
        when(permissionChecker.hasAllPermissions(anyLong(), anyString(), any(String[].class))).thenReturn(false);

        // Examination и выполнение
        assertThrows(AccessDeniedException.class, () -> {
            permissionAspect.checkPermission(joinPoint);
        });

        verify(joinPoint, never()).proceed();
    }
}