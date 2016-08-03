from django.contrib import admin
from .models import Group, PushInformation, SubscriptionInfo


class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', )


class PushInformationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', )


class SubscriptionInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'browser', )

admin.site.register(Group, GroupAdmin)
admin.site.register(PushInformation, PushInformationAdmin)
admin.site.register(SubscriptionInfo, SubscriptionInfoAdmin)
