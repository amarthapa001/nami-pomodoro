from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.db import models as db_models
from .models import Room
from .serializers import RoomSerializer
from apps.friends.models import Friendship


class MyRoomView(APIView):
    def get(self, request):
        return Response(RoomSerializer(request.user.room).data)


class FriendRoomsView(generics.ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        user = self.request.user
        friend_ids = Friendship.objects.filter(db_models.Q(user_a=user) | db_models.Q(user_b=user)).values_list(
            db_models.Case(db_models.When(user_a=user, then=db_models.F("user_b")), default=db_models.F("user_a")), flat=True)
        return Room.objects.filter(owner_id__in=friend_ids).select_related("owner__profile")


class RoomDetailView(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.prefetch_related("sessions__user__profile").get(pk=room_id)
        except Room.DoesNotExist:
            return Response(status=404)
        if room.owner != request.user and not Friendship.are_friends(request.user, room.owner):
            raise PermissionDenied
        return Response(RoomSerializer(room).data)
