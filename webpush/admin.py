from django.contrib import admin
from .models import Group, PushInformation, SubscriptionInfo


class GroupAdmin(admin.ModelAdmin):
    pass


class PushInformationAdmin(admin.ModelAdmin):
    pass


class SubscriptionInfoAdmin(admin.ModelAdmin):
    pass

admin.site.register(Group, GroupAdmin)
admin.site.register(PushInformation, PushInformationAdmin)
admin.site.register(SubscriptionInfo, SubscriptionInfoAdmin)
