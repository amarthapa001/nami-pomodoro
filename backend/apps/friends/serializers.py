from rest_framework import serializers
from .models import FriendRequest, Friendship
from apps.profiles.serializers import ProfileSerializer


class FriendRequestSerializer(serializers.ModelSerializer):
    sender_profile = ProfileSerializer(source="sender.profile", read_only=True)
    receiver_profile = ProfileSerializer(source="receiver.profile", read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["id", "sender_profile", "receiver_profile", "status", "created_at"]
        read_only_fields = ["id", "sender_profile", "receiver_profile", "created_at"]


class FriendshipSerializer(serializers.ModelSerializer):
    friend_profile = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ["id", "friend_profile", "created_at"]

    def get_friend_profile(self, obj):
        request_user = self.context["request"].user
        friend = obj.user_b if obj.user_a == request_user else obj.user_a
        return ProfileSerializer(friend.profile).data
