import uuid
from django.db import models
from django.conf import settings


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    profile_image_url = models.CharField(max_length=500, blank=True, default="")
    bio = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.avatar:
            url = self.avatar.url
            self.profile_image_url = url
            if self.user and self.user.profile_image_url != url:
                self.user.profile_image_url = url
                self.user.save(update_fields=["profile_image_url"])
        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name
