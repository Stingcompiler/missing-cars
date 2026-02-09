# permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    الجميع يمكنهم القراءة
    المشرف والموظف يمكنهم الإضافة والتعديل
    المشرف فقط يمكنه الحذف
    """
    def has_permission(self, request, view):
        # السماح بالقراءة للجميع
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # التحقق من تسجيل الدخول
        if not (request.user and request.user.is_authenticated):
            return False
        
        # عمليات الحذف للمشرف فقط
        if request.method == 'DELETE':
            return getattr(request.user, 'is_admin', False) or getattr(request.user, 'role', '') == 'admin'
        
        # العمليات الأخرى (POST, PUT, PATCH) للمشرف والموظف
        role = getattr(request.user, 'role', '')
        is_admin = getattr(request.user, 'is_admin', False)
        return is_admin or role in ['admin', 'staff']


class IsAdminOrStaff(permissions.BasePermission):
    """
    السماح للمشرف والموظف فقط
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        role = getattr(request.user, 'role', '')
        is_admin = getattr(request.user, 'is_admin', False)
        return is_admin or role in ['admin', 'staff']


class IsAdminOnly(permissions.BasePermission):
    """
    السماح للمشرف فقط (للعمليات الحساسة مثل الحذف وإدارة المستخدمين)
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        is_admin = getattr(request.user, 'is_admin', False)
        role = getattr(request.user, 'role', '')
        return is_admin or role == 'admin'