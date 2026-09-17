from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["id", "display_name", "avatar_url", "profile_image_url", "bio", "updated_at"]

    def get_avatar_url(self, obj):
        url = None
        if obj.avatar:
            url = obj.avatar.url
        elif obj.profile_image_url:
            url = obj.profile_image_url
        elif hasattr(obj, "user") and obj.user and getattr(obj.user, "profile_image_url", None):
            url = obj.user.profile_image_url

        if not url:
            return None

        request = self.context.get("request")
        if request is not None and not (url.startswith("http://") or url.startswith("https://")):
            return request.build_absolute_uri(url)
        return url

    def get_profile_image_url(self, obj):
        return self.get_avatar_url(obj)


class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]
