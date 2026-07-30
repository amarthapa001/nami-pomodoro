from django.urls import path
from .views import SendFriendRequestView, IncomingRequestsView, RespondToRequestView, FriendListView, UnfriendView

urlpatterns = [
    path("", FriendListView.as_view()),
    path("requests/", SendFriendRequestView.as_view()),
    path("requests/incoming/", IncomingRequestsView.as_view()),
    path("requests/<uuid:pk>/", RespondToRequestView.as_view()),
    path("<uuid:pk>/", UnfriendView.as_view()),
]
