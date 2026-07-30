from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from .models import FriendRequest, Friendship
from .serializers import FriendRequestSerializer, FriendshipSerializer


class SendFriendRequestView(APIView):
    def post(self, request):
        receiver_id = request.data.get("receiver_id")
        if not receiver_id:
            return Response({"error": "receiver_id required"}, status=400)
        if str(request.user.id) == str(receiver_id):
            return Response({"error": "Cannot add yourself"}, status=400)
        freq, created = FriendRequest.objects.get_or_create(sender=request.user, receiver_id=receiver_id)
        return Response(FriendRequestSerializer(freq).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class IncomingRequestsView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(receiver=self.request.user, status=FriendRequest.Status.PENDING).select_related("sender__profile", "receiver__profile")


class RespondToRequestView(APIView):
    def patch(self, request, pk):
        try:
            freq = FriendRequest.objects.get(pk=pk, receiver=request.user)
        except FriendRequest.DoesNotExist:
            return Response(status=404)
        new_status = request.data.get("status")
        if new_status not in [FriendRequest.Status.ACCEPTED, FriendRequest.Status.REJECTED]:
            return Response({"error": "status must be accepted or rejected"}, status=400)
        freq.status = new_status
        freq.save()
        if new_status == FriendRequest.Status.ACCEPTED:
            Friendship.objects.get_or_create(user_a=freq.sender, user_b=freq.receiver)
        return Response(FriendRequestSerializer(freq).data)


class FriendListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(models.Q(user_a=user) | models.Q(user_b=user)).select_related("user_a__profile", "user_b__profile")


class UnfriendView(APIView):
    def delete(self, request, pk):
        user = request.user
        try:
            friendship = Friendship.objects.get(models.Q(user_a=user, pk=pk) | models.Q(user_b=user, pk=pk))
        except Friendship.DoesNotExist:
            return Response(status=404)
        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
