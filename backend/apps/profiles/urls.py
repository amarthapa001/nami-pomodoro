from django.urls import path
from .views import MyProfileView, AvatarUploadView, PublicProfileView

urlpatterns = [
    path("me/", MyProfileView.as_view()),
    path("me/avatar/", AvatarUploadView.as_view()),
    path("<uuid:user_id>/", PublicProfileView.as_view()),
]
