from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["id", "display_name", "avatar_url", "bio", "updated_at"]

    def get_avatar_url(self, obj):
        return obj.avatar.url if obj.avatar else None


class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]
