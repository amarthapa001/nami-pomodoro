from django.urls import path
from .views import MyRoomView, FriendRoomsView, RoomDetailView

urlpatterns = [
    path("", FriendRoomsView.as_view()),
    path("me/", MyRoomView.as_view()),
    path("<uuid:room_id>/", RoomDetailView.as_view()),
]
