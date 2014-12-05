from rest_framework import permissions
from rest_framework import filters


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class IsDraftOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if obj.draft is True:
            if obj.user == request.user:
                return True
            return False
        return True


class IsDraftOwnerFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if request.user.is_authenticated() is False:
            return queryset.filter(draft=False)
        return queryset.filter(user=request.user) | \
            queryset.filter(draft=False)
