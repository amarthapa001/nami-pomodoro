from rest_framework import serializers
from .models import Room, RoomSession
from apps.profiles.serializers import ProfileSerializer


class RoomSessionSerializer(serializers.ModelSerializer):
    user_profile = ProfileSerializer(source="user.profile", read_only=True)

    class Meta:
        model = RoomSession
        fields = ["id", "user_profile", "status", "session_count", "updated_at"]


class RoomSerializer(serializers.ModelSerializer):
    owner_profile = ProfileSerializer(source="owner.profile", read_only=True)
    sessions = RoomSessionSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["id", "name", "owner_profile", "sessions", "created_at"]
