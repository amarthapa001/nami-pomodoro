from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    display_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "display_name"]

    def create(self, validated_data):
        display_name = validated_data.pop("display_name")
        user = User.objects.create_user(**validated_data)
        from apps.profiles.models import Profile
        from apps.rooms.models import Room
        Profile.objects.create(user=user, display_name=display_name)
        Room.objects.create(owner=user, name=f"{display_name}'s Room")
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "created_at"]
